const mongoose = require("mongoose")
const notificationModel =require('../models/notification.model.js');
class channelRepository{
    async create(info) {
        try {
            const noti = await notificationModel(info)
            return await noti.save();
        } catch (error) {
            throw error;
        }
    }

   
     async update(find,updateInfo) {
         try {
             const noti = await notificationModel.updateOne(find,updateInfo);
             return noti;
         } catch (error) {
             throw error;
         }
     }
       async findOne(find) {
           try {
               const noti = await notificationModel.findOne(find);
               return noti;
           } catch (error) {
               throw error;
           }
       }
    async get(find,sort,fields,number=6) {
        try {
            const notis = await notificationModel.find(find).sort(sort).select(fields).limit(number);
            return notis
        } catch (error) {
            throw error;
        }
    }
}
module.exports=channelRepository;