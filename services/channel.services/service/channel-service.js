const express=require("express")
const {channelRepository} = require("../database")
const {generateJWTToken,verifyJWTToken,formatData} =require("../untils")
class channelService{
    constructor(){
        this.repository=new channelRepository()
    }
    // fetch channel
    async getInfoLogin(token){
        try {
            if (token) {
                const data=await verifyJWTToken(token)
                if(data){
                    const channel=await this.repository.findOneChannelByGoogleId(data.channelId);
                    const response={
                        google_id:channel.google_id,
                        email:channel.email,
                        thumbnail:channel.profilePicture,
                        title:channel.title
                    };
                    return formatData(response);
                }
                 console.log("res")
                return null;;
            } else {
                return null;
            }
        } catch (error) {

            return null;
            throw error
        }
    }
    /// login event
    async login(name,email,id,thumbnail){
        try {
            var channel=await this.repository.findOneChannelByGoogleId(id)

            if(channel){
                const token=generateJWTToken(channel.email,channel.google_id)
                return token;
            }

            channel = await this.repository.createChannel(email,name,id,thumbnail);
             const token = generateJWTToken(channel.email, channel.google_id)
             return formatData(token);
        } catch (error) {
            throw error
        }
    }


    async getChannels(){
        return this.repository.getChannels()
    }
    async LikeInteraction(google_id,video_id){
         const channel = await this.repository.findOneChannelByGoogleId(
             google_id
         )
        if (channel&&channel.likesVideo.includes(video_id)) {
            const result = await this.repository.LikeInteraction(google_id, video_id,true)
             return (formatData(result))
        }
         const result = await this.repository.LikeInteraction(google_id, video_id, false)
        
       return (formatData(result))

    }
    async increaseViews(google_id) {
       const result=await this.repository.increaseView(google_id)
       return(formatData(result))
    }
    async addHistory(google_id,video_id){
        const result=await this.repository.addHistory(google_id,video_id);
        return formatData(result);
    }
    async changeSubcribeCount(google_id,flag) {
            const result = await this.repository.changeSubcribeCount(google_id, flag);
            return formatData(result);
        
    }
    async ChangeNotification(google_id, flag) {
        const result = await this.repository.ChangeNotification(google_id, flag);
        return formatData(result);
    }
    async update(google_id, descriptions, status, title) {
        const result = await this.repository.updateChannel(google_id, descriptions, status, title)
        return formatData(result);
    }
    async 
    async SubcribeEvent(payload){
        paylod=JSON.parse(payload)
        const {event,data}=payload;
        const  {google_id,video_id,flag}=data;
        switch(event){
            case"LIKE_VIDEO":
                await this.LikeInteraction(google_id,video_id);
                break;
            case"INCREASE_VIEW":
                await this.increaseViews(google_id);
                break;
            case"ADD_HISTORY":
                await this.addHistory(google_id,video_id);
                break;
            case"CHANGE_SUBCRIBECOUNT":
                await this.changeSubcribeCount(google_id,flag);
                break;
            case"CHANGE_NOTIFICATION":
                await this.ChangeNotification(google_id,flag);
                break;
            
        
            
        
        }
    }
    
}
module.exports=channelService;