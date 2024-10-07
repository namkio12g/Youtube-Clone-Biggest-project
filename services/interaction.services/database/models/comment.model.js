const mongoose = require("mongoose")
const Schema = mongoose.Schema
const commentSchema = new Schema({
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    channelId: mongoose.Schema.Types.ObjectId,
    text: {
        type: String,
    },
    createdAt: {
        type: date,
        default: date.now
    },
    replies:[ {
      channelId: mongoose.Schema.Types.ObjectId, // Who replied
        text: String, // Reply text
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    likes: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    likesCount:{
        type:Number,
        default:0
    },
    dislikesCount: {
        type: Number,
        default: 0
    }, delete: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: "active"
    }

})
module.exports = mongoose.model("comment", commentSchema, "comments")