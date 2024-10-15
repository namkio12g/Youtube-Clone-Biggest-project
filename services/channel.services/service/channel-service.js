const express=require("express")
const {channelRepository} = require("../database")
const {generateJWTToken,verifyJWTToken,formatData,PushlishMSG} =require("../untils")
class channelService{
    constructor(){
        this.repository=new channelRepository()
    }
    // fetch channel
    async fetchChannel(token){
        try {
            if (token) {
                const data=await verifyJWTToken(token)
                if(data){
                    const channel=await this.repository.findOneChannelById(data.id);
                    const response={
                        id:channel.id,
                        email:channel.email,
                        thumbnail:channel.profilePicture,
                        title:channel.title
                    };
                    return formatData(response);
                }
                return null;;
            } else {
                return null;
            }
        } catch (error) {

            return null;
            throw error
        }
    }
      // fetch channel
      async getInfoChannel(id) {
          try {
        
            const channel = await this.repository.findOneChannelById(id);
            return formatData(channel);
          } catch (error) {

              return null;
              throw error
          }
      }
    async getChannel(id){
        try {
            const data={
                id:id
            }
            return data;
        } catch (error) {
            
        }
    }
    /// login event
    async login(name,email,id,thumbnail){
        try {
            var channel=await this.repository.findOneChannelByGoogleId(id);

            if(channel){
                const token=generateJWTToken(channel.email,channel._id)
                return token;
            }

            channel = await this.repository.createChannel(email,name,id,thumbnail);
             const token = generateJWTToken(channel.email, channel._id)
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

    // get channel titles
    async getChannelsTitle(channelIds){
        try {
        let channelTitles=[]
        await Promise.all(
            channelIds.map(async (id) => {
                const channel = await this.repository.findOneChannelById(id);
                if (channel) {
                    channelTitles.push({title:channel.title,id:channel._id});
                }
            })
        );

        return channelTitles
        } catch (error) {
            console.log(error)
            return []
        }
    }


    async SubcribeEvent(payload){
        payload=JSON.parse(payload)
        const {event,data}=payload;
        const  {google_id,video_id,flag,channelIds,amount}=data;
        switch(event){
            case"CHANGE_VIDEO_COUNTS":
                return await this.LikeInteraction(google_id,video_id);
                break;
            case "GET_CHANNELS_TITLE":
                return await this.getChannelsTitle(channelIds);
                break;
            case"INCREASE_VIEW":
                return await this.increaseViews(google_id);
                break;
            case"ADD_HISTORY":
                return await this.addHistory(google_id, video_id);
                break;
            case"CHANGE_SUBCRIBECOUNT":
                return await this.changeSubcribeCount(google_id, flag);
                break;
            case"CHANGE_NOTIFICATION":
                return await this.ChangeNotification(google_id, flag);
                break;
            
        
            
        
        }
    }
    
}
module.exports=channelService;