const mongoose = require("mongoose")
const Schema = mongoose.Schema
const notificationSchema = new Schema({
    channelId: mongoose.Schema.Types.ObjectId,
    messages:{
         type: [{
            videoId: mongoose.Schema.Types.ObjectId,
            channelId: mongoose.Schema.Types.ObjectId,
            content:String,
            createdAt:{
                type:Date,
                default:Date.now
            }
         }],
        default: []
    },
    delete: {
        type: Boolean,
        default: false
    },


})
module.exports = mongoose.model("notification", notificationSchema, "notifications")