const mongoose = require("mongoose")
const notificationModel =require('../models/notification.model.js');
class channelRepository{
    async add(channelId, notiContent) {
        try {
            const noti = await notificationModel({
                channelId: channelId
            })
            return await noti.save();
        } catch (error) {
            throw error;
        }
    }
    async add(channelId,notiContent){
        try {
            const noti=await notificationModel.findOneAndUpdate({channelId:channelId},{$push:{messages:notiContent}});
            return noti;
        } catch (error) {
            throw error;
        }
    }
    async get(channelId, notiContent) {
        try {
            const noti = await notificationModel.findOne({
                channelId: channelId
            })
            return noti
        } catch (error) {
            throw error;
        }
    }
}
module.exports=channelRepository;