const mongoose =require("mongoose");
const Schema=mongoose.Schema
const videoSchema=new Schema({
    videoUrl:[{
        value:String,
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
         enum: ['created','processing','ready', 'removed'],
         default: 'created',
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
    dislikesCount:{
        type:Number,
        default:0
    },
    description:{
        type:String,
        default:"",
        maxlengths:5000
    }, delete:{
        type:Boolean,
        default:false
    },

},{
    getters: true
})
videoSchema.virtual('formatCreatedAt').get(function () {
    if(!this.createdAt)
        return "not found createdAt";
    let newDate = new Date(this.createdAt);
    return newDate.toISOString().split('T')[0];

});
videoSchema
    .virtual('durationText')
    .get(function () {
        if(!this.duration)
            return "not found durartion";
        const text = ''
        const secs = Math.floor(this.duration) % 60;
        const minutes = Math.floor(Math.floor(this.duration) % 3600 / 60);
        const hours = Math.floor(this.duration / 3600);
        if (hours > 0) {
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
videoSchema.virtual("timeDifferenceText").get(function () {
    if(!this.createdAt)
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
videoSchema
    .set('toJSON', {
        getters: true,
        virtuals: true
    });
videoSchema.set('toObject', {
    virtuals: true
});
module.exports=mongoose.model("video",videoSchema,"videos")