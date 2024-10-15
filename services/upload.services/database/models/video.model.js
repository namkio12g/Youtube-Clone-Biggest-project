const mongoose =require("mongoose")
const Schema=mongoose.Schema
const videoSchema=new Schema({
    videoUrl:[{
        value:Number,
        url:String
    }],
    title: {
        type: String,
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
    modeView: {
             type: String,
             enum: ['private', 'public'],
             default: 'private',
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

}, {
    getters: true
})
videoSchema
    .virtual('durationText')
    .get(function () {
        const text=''
        const secs=Math.floor(this.duration)%60;
        const minutes = Math.floor(Math.floor(this.duration)%3600/60);
        const hours = Math.floor(this.duration / 3600);
        if(hours>0){
             return [
                 String(hours).padStart(2, '0'),
                 minutes > 0 ? String(minutes).padStart(2, '0') : '00',
                 String(secs).padStart(2, '0')
             ].join(':');
        }
         return [
             minutes > 0 ? String(minutes).padStart(2, '0') : '00',
             String(secs).padStart(2, '0')
         ].join(':');
    });
module.exports=mongoose.model("video",videoSchema,"videos")