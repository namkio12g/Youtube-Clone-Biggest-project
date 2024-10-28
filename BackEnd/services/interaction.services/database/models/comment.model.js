const mongoose=require("mongoose")
const commentSchema=new mongoose.Schema({
    parentId:{
        type:mongoose.Schema.Types.ObjectId,
        default:"null"
    },
    channelId:{
        type: mongoose.Schema.Types.ObjectId,
    },
    videoId: mongoose.Schema.Types.ObjectId,
    content:String,
    likesCount:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
commentSchema.virtual("timeDifferenceText").get(function () {
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
commentSchema
    .set('toJSON', {
        getters: true,
        virtuals: true
    });
commentSchema.set('toObject', {
    virtuals: true
});
module.exports=mongoose.model("comment",commentSchema,"comments")