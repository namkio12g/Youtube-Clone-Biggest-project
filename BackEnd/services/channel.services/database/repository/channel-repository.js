const mongoose = require("mongoose")
const channelModel=require('../models/channel.model.js');
class channelRepository{
    async createChannel(email, name, google_id, thumbnail) {
        try {
            const newChannel=new channelModel({
                email:email,
                google_id:google_id,
                title:name,
                profilePicture:thumbnail
            })
            const channelResult = await newChannel.save();
            return channelResult;
        } catch (error) {
            console.log(error);
            return null;
            
        }
    }
    async updateManyChannel(find, updateInfo){
        try {
            const result=await channelModel.updateMany(find,updateInfo);
            return result;
        } catch (error) {
            throw error;
        }
    }
    async findOneChannelByGoogleId(google_id){

            try {
            const channel=await channelModel.findOne({google_id:google_id})
            return channel
        } catch (error) {
            throw error
        }
    }
    async findOneChannelById(id) {

        try {
            const channel = await channelModel.findById(id)
            return channel
        } catch (error) {
            throw error
        }
    }

    async getChannels(){
        try {
            const channels=await channelModel.find({});
            return channels
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async LikeInteraction(google_id,video_id,flag) {
      try {
          const channel=await channelModel.findOne({google_id:google_id})
          if (flag) {
                  const result=await channelModel.findOneAndUpdate({google_id:google_id},{
                    $pull:{
                        likesVideo:video_id
                    }
                  });
                  return result;
              } else {
                   const result = await channelModel.findOneAndUpdate({
                       google_id: google_id
                   }, {
                       $push: {
                           likesVideo: video_id
                       }
                   });
                   return result;
              
              return await channel.save()
          }
      } catch (error) {
          throw error
      }
    }
    async increaseView(google_id) {
        try {
           await channelModel.updateOne({
                   google_id: google_id
               }, {
                   $inc: {
                       views: 1
                   }
               } 
           );
        } catch (error) {
            throw error
        }
    }
    async findUpdateOneChannel(find,updateInfo){
        try {
           const result = await channelModel.findOneAndUpdate(find,updateInfo);
           return result;
        } catch (error) {
            throw error;
        }
    }
      async updateOneChannel(find, updateInfo) {
          try {
              const result = await channelModel.updateOne(find, updateInfo);
              return result;
          } catch (error) {
              throw error;
          }
      }
    async findChannels(find,sort){
        try {
            const channels= await channelModel.find(find).sort(sort);
            return channels;
        } catch (error) {
            throw error
        }
    }
      async findChannelsWithPagination(find, sort,pagination,number=6) {
          try {
              const channels = await channelModel.find(find).sort(sort).skip(pagination*number).limit(number);
              return channels;
          } catch (error) {
              throw error
          }
      }
    async findChannelsWithFields(find,fields) {
        try {
            const channels = await channelModel.find(find).select(fields)
            return channels;
        } catch (error) {
            throw error
        }
    }
    async ChangeNotification(google_id,flag){
          try {
            if(flag){
                return await channelModel.updateOne({
                    google_id: google_id
                }, {
                    $inc: {
                        notifycount: 1
                    }
                });
            }
                return await channelModel.updateOne({
                    google_id: google_id
                }, {
                    notifycount: 0
                });
          } catch (error) {
              throw error
          }
    }
     async changeSubcribeCount(google_id, flag) {
        try {
            if(flag){
                return await channelModel.updateOne({
                    google_id: google_id
                }, {
                    $inc: {
                        subcribersCount: 1
                    }
                });
            }
            
            return await channelModel.updateOne({
                google_id: google_id
            }, {
                $inc: {
                    subcribersCount: -1
                }
            });
                
        } catch (error) {
            throw error
        }
     }
      async updateChannel(find,updateInfo) {
        try {
              return await channelModel.findByIdAndUpdate(find, updateInfo);
        } catch (error) {
            throw error
        }
      }
    }
    
module.exports=channelRepository;