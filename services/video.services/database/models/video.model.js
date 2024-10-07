const mongoose =require("mongoose")
const Schema=mongoose.Schema
const videoSchema=new Schema({
    videoUrl:[{
        value:Number,
        url:String
    }],
    title: {
        type: String,
        max,
        trim: true,
        maxlengths: 200,
        default: ""
    },
    thumbnail:{
        type: String,
        default:""
    },
     duration: {
         type: Number,
         default:0 
     },
     status: {
         type: String,
         enum: ['processing', 'waiting','ready', 'removed'],
         default: 'processing',
     },
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"channel",
    },
    categoryId:{
       type: mongoose.Schema.Types.ObjectId,
           ref: "category",
    },
    views: {
        type: Number,
        default: 0
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    commentsCount: {
        type: Number,
        default: 0,
    },
    updatedAt: {
          type: Date,
          default: Date.now,
    },
    likes:{
        type:[String]
    },
    likesCounts:{
        type: Number,
        default: 0
    },
    dislikesCount:[{
        type:Number,
        default:0
    }],
    description:{
        type:String,
        default:"",
        maxlengths:5000
    }, delete:{
        type:Boolean,
        default:false
    },

})
module.exports=mongoose.model("video",videoSchema,"videos")