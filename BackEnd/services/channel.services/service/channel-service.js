const express=require("express")
const {channelRepository} = require("../database")
const {generateJWTToken,verifyJWTToken,formatData,PushlishMSG} =require("../untils")
const mongoose = require('mongoose');
const CustomError = require("../untils/customError");
const { ObjectId } = mongoose.Types;
class channelService{
    constructor(){
        this.repository=new channelRepository()
    }
    async getOneChannel(id){
        try {
            if(mongoose.isValidObjectId(id)){
                const channel=await this.repository.findOneChannelById(id);
                return channel;
            }
            else
                throw new Error("Cant Find channel")
        } catch (error) {
            throw error
        }
    }
    async getChannelInfoPage(channleId, userId){
        try {
            const userChannel=await this.repository.findOneChannelById(userId);
            var channel=await this.repository.findOneChannelById(channleId);
            if (!channel){
                throw new CustomError("channel was not found",401)
            }
            channel={...channel.toObject(),subcribedByMe:userChannel?userChannel.channelSubcribed.includes(channel._id.toString()):false}
            return channel;

            
        } catch (error) {
            throw error;
        }
        
    }
    //subcribe

    async subcribeChannel(channelId, channelSucribedId) {
        try {
            const channel=await this.repository.findOneChannelById(channelId)
            if(channel.channelSubcribed.includes(channelSucribedId))
            {
                 await this.repository.updateOneChannel({
                     _id: channelId
                 }, {$pull: {channelSubcribed: channelSucribedId}
                 })
                 await this.repository.updateOneChannel({
                     _id: channelSucribedId
                 }, { $inc: {subcribersCount: -1}
                 })
                 return {addFlag:false,id:channelId}
            }
             await this.repository.updateOneChannel({
                _id: channelId}, {$push: {channelSubcribed: channelSucribedId}
            })
            await this.repository.updateOneChannel({
                     _id: channelSucribedId
                 }, { $inc: {subcribersCount: 1}
                 })
             return {addFlag:true,id:channelId}
           
        } catch (error) {
            throw error;
        }
    }

    //comment 
    async addCommentsLiked(channelId, commentId){
        try {
             {
            const channel =await this.repository.findOneChannelById(channelId)
            if(channel.commentsLiked.includes(commentId)){
                await this.repository.updateOneChannel({
                    _id: channelId
                }, {
                    $pull: {
                        commentsLiked: commentId
                    }
                })
                return {addFlag:false}
            }
            }
             await this.repository.updateOneChannel({
                 _id: channelId
             }, {
                 $push: {
                     commentsLiked: commentId
                 }
             })
             return {
                 addFlag: true
             }
        } catch (error) {
            throw error;
        }
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
                        title:channel.title,
                        likesVideo: channel.likesVideo,
                        favouriteVideos: channel.favouriteVideos,
                        channelSubcribed: channel.channelSubcribed

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
            return formatData(data);
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
  
    async increaseViews(id) {
       const result=await this.repository.increaseView(id)
       return(formatData(result))
    }


    //history
    async addHistory(channelId,videoId){
        try {
            await this.repository.updateOneChannel({_id:channelId},{$pull:{history:{videoId:new ObjectId(videoId)}}})
            const result=await this.repository.updateOneChannel({_id:channelId},{$push:{history:{videoId:new ObjectId(videoId)}}})
            return formatData(result);
        } catch (error) {
            throw error
        }
    }
    async removeHistory(channelId, videoId) {
        try {
            const result = await this.repository.updateOneChannel({
                _id: channelId
            }, {
                $pull: {
                    history: {
                        videoId: new ObjectId(videoId)
                    }
                }
            })
            return formatData(result);
        } catch (error) {
            throw error
        }
    }
    //history

    //videoliked
    async addVideosLiked(channelId, videoId) {
        try {
            const channel = await this.repository.findOneChannelById(channelId)
            if (channel.likesVideo.includes(videoId)){
                await this.repository.updateOneChannel({
                    _id: channelId
                }, {
                    $pull: {
                        likesVideo: videoId
                    }
                })
                return {addFLag:false}
            }
            await this.repository.updateOneChannel({
                _id: channelId
            }, {
                $push: {
                    likesVideo: videoId
                }
            })
            return {
                addFlag: true
            }
            
        } catch (error) {
            throw error
        }
    }
    async removeVideosLiked(channelId, videoId) {
          try {
              const result = await this.repository.updateOneChannel({
                  _id: channelId
              }, {
                  $pull: {
                      likesVideo: videoId
                  }
              })
              return formatData(result);
          } catch (error) {
              throw error
          }
      }
    //videoliked
    //favourite video
    async addFavouriteVideos(channelId, videoId) {
        try {
            const channel = await this.repository.findOneChannelById(channelId)
            if (channel.favouriteVideos.includes(videoId)) {
                await this.repository.updateOneChannel({
                    _id: channelId
                }, {
                    $pull: {
                    favouriteVideos: videoId
                    }
                })
                return {
                    addFlag: false
                }
            }
            await this.repository.updateOneChannel({
                _id: channelId
            }, {
                $push: {
                favouriteVideos: videoId
                }
            })
            return {
                addFlag: true
            }

        } catch (error) {
            throw error
        }
    }
    async removeFavouriteVideos(channelId, videoId) {
        try {
            const result = await this.repository.updateOneChannel({
                _id: channelId
            }, {
                $pull: {
                    favouriteVideos: videoId
                }
            })
            return formatData(result);
        } catch (error) {
            throw error
        }
    }
    //favourite video

    async getChannelSubcribed(channelId) {
        try {
            const fields = "title profilePicture videosCount subcribersCount description _id"
            const channel = await this.repository.findOneChannelById(channelId);
            const channels=await this.repository.findChannelsWithFields({_id:{$in:channel.channelSubcribed}},fields);
            return formatData(channels);
        } catch (error) {
            throw error
        }
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
    async adjustVideoCount(channelId, amount){
        try {
            const channel=await this.repository.updateChannel({_id:channelId},{$inc:{videosCount:amount}});
            return channel;
        } catch (error) {
            console.log(error)
            return null;
        }
    }
    async adjustSubcribers(channelId ,subcriberChannelId,flag){
        try {
            if(flag){
            //if true add to subcribers
                channel = await this.repository.updateChannel({_id:channelId}, {
                    $push: {
                        subcribers: subcriberChannelId
                    },
                    $inc: {
                        subcribersCount:1
                    }
                })
                return channel;
            }
            // if false remove from subcribers
            channel = await this.repository.updateChannel({_id:channelId}, {
                $pull: {
                    subcribers: subcriberChannelId
                },
                $inc: {
                    subcribersCount: -1
                }
            })
            return channel;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async getCommentsInfoAndChannelCommenstLike(channelId, channelIds){
        try {
            let commentsLiked;
            if(channelId){
                const channel = await this.repository.findOneChannelById(channelId);
                commentsLiked=channel.commentsLiked;
            }
            let channelsInfo = []
            await Promise.all(
                channelIds.map(async (id) => {
                    const channel = await this.repository.findOneChannelById(id);
                    if (channel) {
                        channelsInfo.push({
                            title: channel.title,
                            thumbnail:channel.profilePicture,
                            id: channel._id
                        });
                    }
                })
            );
            return {commentsLiked:commentsLiked,channelsInfo:channelsInfo};


        } catch (error) {
            return null;
        }
    }


    async deleteVideoLiked(commentId){
        try {
            const find = {
                    commentsLiked: {
                        $elemMatch: {
                            $eq: commentId
                        }
                    }
            }
            const updateInfo = {
                    $pull: {
                        commentsLiked:commentId
                    }
            }
            const result = await this.repository.updateManyChannel(find,updateInfo);
        } catch (error) {
            console.log(error)
            return null;
        }
    }
    async getChannelInfo(channelId){
        try {
            const fields = "title profilePicture subcribersCount _id"
            const channel = await this.repository.findChannelsWithFields({
                _id:channelId
            }, fields);
            return formatData(channel);
        } catch (error) {
            throw error
        }
    }
    async getLikeFavouriteSubcribe(id){
        try {
            const fields = "likesVideo channelSubcribed favouriteVideos"
            const channel = await this.repository.findChannelsWithFields({
                _id: id
            }, fields);
            return formatData(channel);
        } catch (error) {
            throw error
        }
    }

    async SubcribeEvent(payload){
        payload=JSON.parse(payload)
        const {event,data}=payload;
        const {
            google_id,
            video_id,
            channelIds,
            amount,
            channelId,
            subcriberChannelId,
            commentId,
            flag
        } = data;
        switch(event){
            case "GET_CHANNEL_INFO":
                return await this.getChannelInfo(channelId);
                break;
            case "DELETE_COMMENT_LIKE":
                return await this.deleteVideoLiked(commentId);
                break;
            case "GET_COMMENTS_INFO_AND_CHANNEL_COMMENTSLIKE":
                return await this.getCommentsInfoAndChannelCommenstLike(channelId,channelIds);
                break;
            case"ADJUST_SUBCRIBERS":
                return await this.adjustSubcribers(channelId,subcriberChannelId,flag);
                break;
            case "GET_CHANNELS_TITLE":
                return await this.getChannelsTitle(channelIds);
                break;
            case"ADJUST_VIDEO_COUNT":
                return await this.adjustVideoCount(channelId,amount);
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