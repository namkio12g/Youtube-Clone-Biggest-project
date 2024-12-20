const mongoose =require("mongoose")
const Schema=mongoose.Schema
const channelSchema=new Schema({
    email:{
        type: String,
        default:"true"
    },
    title:{type:String},
    profilePicture: {
        type: String,
        default: ""
    },
    google_id:String,
    banner:{
        type: String,
        default: ""
    },
    subscribersCount: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
      videosCount: {
          type: Number,
          default: 0
      },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    socialLink:{
        type: String,
        default: ""
    },
    tags:[{
        type:String,
        default:[]
    }],
    likesVideo:{
        type:[String],
        default:[]
    },
     favouriteVideos: {
         type: [String],
         default: []
     },
     commentsLiked: {
         type: [String],
         default: []
     },
    channelSubscribed: {
        type: [String],
        default: []
    },
    history:[{
        videoId:{type:mongoose.Schema.Types.ObjectId},
        createdAt:{
            type:Date,
            default:Date.now
        }
    }],
    notifycount:{
        type:Number,
        default:0
    },
    descriptions:{
        type:String,
        default:""
    },
    delete: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            default: "public"
        }

})
module.exports=mongoose.model("channel",channelSchema,"channels")