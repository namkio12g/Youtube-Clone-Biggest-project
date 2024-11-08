const mongoose = require("mongoose")
const Schema = mongoose.Schema
const notificationSchema = new Schema({
    channelId: String,
    videoId:String,
    channelInteractionId:String,
    messageType: String,
    content: String,
    createdAt: {
            type: Date,
            default: Date.now
     },
 
})
notificationSchema.virtual("timeDifferenceText").get(function () {
    if (!this.createdAt)
        return "not found createdAt";
    const msInMinute = 60 * 1000;
    const msInHour = 60 * msInMinute;
    const msInDay = 24 * msInHour;
    const msInMonth = 30 * msInDay;
    const difference = new Date() - this.createdAt;

    if (difference < msInMinute) {
        return `${Math.floor(difference / 1000)} seconds ago`;
    } else if (difference < msInHour) {
        return `${Math.floor(difference / msInMinute)} minutes ago`;
    } else if (difference < msInDay) {
        return `${Math.floor(difference / msInHour)} hours ago`;
    } else if (difference < msInMonth) {
        return `${Math.floor(difference / msInDay)} days ago`;
    } else {
        return `${Math.floor(difference / msInMonth)} months ago`;
    }
});
notificationSchema
    .set('toJSON', {
        getters: true,
        virtuals: true
    });
notificationSchema.set('toObject', {
    virtuals: true
});
module.exports = mongoose.model("notification", notificationSchema, "notifications")