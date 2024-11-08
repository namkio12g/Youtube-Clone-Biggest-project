const express=require("express")
const {channelRepository,notificationRepository} = require("../database")
const {generateJWTToken,verifyJWTToken,formatData,PushlishMSG,destroyJWTToken} =require("../untils")
const mongoose = require('mongoose');
const CustomError = require("../untils/customError");
const { create } = require("../database/models/notification.model");
const { ObjectId } = mongoose.Types;
class channelService{
    constructor(){
        this.channelRepo=new channelRepository();
        this.notificationRepo=new notificationRepository();
    }
    // -------------------FILTER--------------------///
    async getFilterChannels(key, pagination, number){
        try {
            const channels=await this.channelRepo.findChannelsWithPagination({title:{"$regex":key}},{subscribersCount:"desc"},pagination,number)
            return channels;
        } catch (error) {
            throw error;
        }
    }
    // -------------------FILTER--------------------///
    async getOneChannel(id){
        try {
            if(mongoose.isValidObjectId(id)){
                const channel=await this.channelRepo.findOneChannelById(id);
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
            const userChannel=await this.channelRepo.findOneChannelById(userId);
            var channel=await this.channelRepo.findOneChannelById(channleId);
            if (!channel){
                throw new CustomError("channel was not found",401)
            }
            channel={...channel.toObject(),subscribedByMe:userChannel?userChannel.channelSubscribed.includes(channel._id.toString()):false}
            return channel;

            
        } catch (error) {
            throw error;
        }
        
    }
    //subscribe

    async subscribeChannel(channelId, channelSubscribedId) {
        try {
            const channel=await this.channelRepo.findOneChannelById(channelId)
            if(channel.channelSubscribed.includes(channelSubscribedId))
            {
                 await this.channelRepo.updateOneChannel({
                     _id: channelId
                 }, {$pull: {channelSubscribed: channelSubscribedId}
                 })
                 await this.channelRepo.updateOneChannel({
                     _id: channelSubscribedId
                 }, { $inc: {subscribersCount: -1}
                 })
                 return {addFlag:false,id:channelId}
            }
             await this.channelRepo.updateOneChannel({
                _id: channelId}, {$push: {channelSubscribed: channelSubscribedId}
            })
            await this.channelRepo.updateOneChannel({
                     _id: channelSubscribedId
                 }, { $inc: {subscribersCount: 1}
                 })
             return {addFlag:true,id:channelId}
           
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    //comment 
    async addCommentsLiked(channelId, commentId){
        try {
             {
            const channel =await this.channelRepo.findOneChannelById(channelId)
            if(channel.commentsLiked.includes(commentId)){
                await this.channelRepo.updateOneChannel({
                    _id: channelId
                }, {
                    $pull: {
                        commentsLiked: commentId
                    }
                })
                return {addFlag:false}
            }
            }
             await this.channelRepo.updateOneChannel({
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
                    const channel=await this.channelRepo.findOneChannelById(data.id);
                    const response={
                        id:channel.id,
                        email:channel.email,
                        thumbnail:channel.profilePicture,
                        title:channel.title,
                        likesVideo: channel.likesVideo,
                        favouriteVideos: channel.favouriteVideos,
                        channelSubscribed: channel.channelSubscribed

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
        
            const channel = await this.channelRepo.findOneChannelById(id);
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
    /// --------------------------lOG IN-LOG OUT START----------------------------------/////
    async login(name,email,id,thumbnail){
        try {
            var channel=await this.channelRepo.findOneChannelByGoogleId(id);

            if(channel){
                const token=generateJWTToken(channel.email,channel._id)
                return token;
            }

            channel = await this.channelRepo.createChannel(email,name,id,thumbnail);
            await this.notificationRepo.create(channel._id);
            const token = generateJWTToken(channel.email, channel._id)
            return formatData(token);
        } catch (error) {
            throw error
        }
    }
    // async logOut(token){
    //     try {
    //         destroyJWTToken(token);
    //         return true;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    /// --------------------------lOG IN-LOG OUT END----------------------------------/////


    async getChannelSubscriptions(channelId){
       try {
            const channel = await this.channelRepo.findOneChannelById(channelId)
            const subscriptions=[]
            if(channel)
                await Promise.all(
                    channel.channelSubscribed.map(async (id) => {
                        const channelTemp=await this.channelRepo.findOneChannelById(id)
                        subscriptions.push({
                            _id:channelTemp._id,
                            title:channelTemp.title,
                            videosCount:channelTemp.videosCount,
                            subscribersCount:channelTemp.subscribersCount,
                            thumbnail:channelTemp.profilePicture
                        })
                    })
                )
            return subscriptions;
       } catch (error) {
            throw error;
       }
    }
  
    async increaseViews(id) {
       const result=await this.channelRepo.increaseView(id)
       return(formatData(result))
    }


    //history
    async addHistory(channelId,videoId){
        try {
            await this.channelRepo.updateOneChannel({_id:channelId},{$pull:{history:{videoId:new ObjectId(videoId)}}})
            const result=await this.channelRepo.updateOneChannel({_id:channelId},{$push:{history:{videoId:new ObjectId(videoId)}}})
            return formatData(result);
        } catch (error) {
            throw error
        }
    }
    async removeHistory(channelId, videoId) {
        try {
            const result = await this.channelRepo.updateOneChannel({
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
            const channel = await this.channelRepo.findOneChannelById(channelId)
            if (channel.likesVideo.includes(videoId)){
                await this.channelRepo.updateOneChannel({
                    _id: channelId
                }, {
                    $pull: {
                        likesVideo: videoId
                    }
                })
                return {addFLag:false}
            }
            await this.channelRepo.updateOneChannel({
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
              const result = await this.channelRepo.updateOneChannel({
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
            const channel = await this.channelRepo.findOneChannelById(channelId)
            if (channel.favouriteVideos.includes(videoId)) {
                await this.channelRepo.updateOneChannel({
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
            await this.channelRepo.updateOneChannel({
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
            const result = await this.channelRepo.updateOneChannel({
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

    async getChannelSubscribed(channelId) {
        try {
            const fields = "title profilePicture videosCount subscribersCount description _id"
            const channel = await this.channelRepo.findOneChannelById(channelId);
            const channels=await this.channelRepo.findChannelsWithFields({_id:{$in:channel.channelSubscribed}},fields);
            return formatData(channels);
        } catch (error) {
            throw error
        }
    }

    // get channel titles
    async getChannelsTitle(channelIds){
        try {
        let channelTitles=[]
        await Promise.all(
            channelIds.map(async (id) => {
                const channel = await this.channelRepo.findOneChannelById(id);
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
            const channel=await this.channelRepo.updateChannel({_id:channelId},{$inc:{videosCount:amount}});
            return channel;
        } catch (error) {
            console.log(error)
            return null;
        }
    }
    async adjustSubscribers(channelId ,subscriberChannelId,flag){
        try {
            if(flag){
            //if true add to subscribers
                channel = await this.channelRepo.updateChannel({_id:channelId}, {
                    $push: {
                        subscribers: subscriberChannelId
                    },
                    $inc: {
                        subscribersCount:1
                    }
                })
                return channel;
            }
            // if false remove from subscribers
            channel = await this.channelRepo.updateChannel({_id:channelId}, {
                $pull: {
                    subscribers: subscriberChannelId
                },
                $inc: {
                    subscribersCount: -1
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
                const channel = await this.channelRepo.findOneChannelById(channelId);
                commentsLiked=channel.commentsLiked;
            }
            let channelsInfo = []
            await Promise.all(
                channelIds.map(async (id) => {
                    const channel = await this.channelRepo.findOneChannelById(id);
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
            const result = await this.channelRepo.updateManyChannel(find,updateInfo);
        } catch (error) {
            console.log(error)
            return null;
        }
    }
    async getChannelInfo(channelId){
        try {
            const fields = "title profilePicture subscribersCount _id"
            const channel = await this.channelRepo.findChannelsWithFields({
                _id:channelId
            }, fields);
            return formatData(channel);
        } catch (error) {
            throw error
        }
    }
    async getLikeFavouriteSubscribe(id){
        try {
            const fields = "likesVideo channelSubscribed favouriteVideos"
            const channel = await this.channelRepo.findChannelsWithFields({
                _id: id
            }, fields);
            return formatData(channel);
        } catch (error) {
            throw error
        }
    }
///--------------------------Notification ------------------------------//
    async notifyNewVideo(videoId,channelId,videoTitle){
        try {
            const subscribers=await this.channelRepo.findChannels({channelSubscribed:channelId},{})
            if(subscribers.length>0){
                
                await Promise.all(
                    subscribers.map(async(channel) => {
                        const notiContent = {
                            videoId: videoId,
                            channelId: channel._id,
                            channelInteractionId:channelId,
                            messageType: "NEW_VIDEO",
                            content: `đã tải lên video mới : ${videoTitle}`

                        }
                        await this.notificationRepo.create(notiContent);
                    })
                )
            }
        } catch (error) {
            throw error;
        }
    }
    async notifyInteraction(videoId, channelId,channelInteractionId,type) {
        try {
            if(channelId!=channelInteractionId){
                var content="";
                if(type=="LIKE_COMMENT")
                    content="đã thích bình luận của bạn"
                else 
                    content = "đã trả lời bình luận của bạn"
                const notiContent = {
                    videoId: videoId,
                    channelId:channelId,
                    channelInteractionId: channelInteractionId,
                    messageType: type,
                    content: content
                }
                const isExist=await this.notificationRepo.findOne({channelId:channelId, messageType: type,videoId:videoId })

                if(isExist){
                    await this.notificationRepo.update({channelId:channelId, messageType: type,videoId:videoId },{createdAt:new Date(),channelInteractionId:channelInteractionId})
                    return ;
                }
                await this.notificationRepo.create(notiContent);
                return;
            }
        } catch (error) {
            throw error;
        }
    }
    async getNotifcations(channelId){
        try {
            const fields = "channelInteractionId content createdAt videoId"
            const notifcations=await this.notificationRepo.get({channelId:channelId},{createdAt:"desc"},fields,15);
            const formatNotifications=[];
            await Promise.all(
                notifcations.map(async(noti)=>{
                    const channelTemp = await this.channelRepo.findOneChannelById(noti.channelInteractionId);
                    formatNotifications.push({
                        ...noti.toObject(),
                        channelInteractionThumbnail:channelTemp.profilePicture,
                        channelInteractionTitle:channelTemp.title
                        
                    })
                })

            )
            return formatNotifications;
        } catch (error) {
            throw error;
        }

    }


    async SubscribeEvent(payload){
        payload=JSON.parse(payload)
        const {event,data}=payload;
        const {
            channelIds,
            amount,
            channelId,
            channelInteractionId,
            subscriberChannelId,
            commentId,
            flag,
            videoId,
            videoTitle,
            type
        } = data;
        switch(event){
            case "NEW_VIDEO_NOTIFICATION":
                return await this.notifyNewVideo(videoId,channelId,videoTitle);
                break;
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
                return await this.adjustSubscribers(channelId,subscriberChannelId,flag);
                break;
            case "GET_CHANNELS_TITLE":
                return await this.getChannelsTitle(channelIds);
                break;
            case"ADJUST_VIDEO_COUNT":
                return await this.adjustVideoCount(channelId,amount);
                break;
            case"NEW_VIDEO_NOTIFICATION":
                return await this.notifyNewVideo(videoId,channelId,videoTitle);
                break;
            case "INTERACTED_NOTIFICATION":
                return await this.notifyInteraction(videoId, channelId,channelInteractionId, type);
                break;
            
        
            
        
        }
    }
    
}


module.exports=channelService;