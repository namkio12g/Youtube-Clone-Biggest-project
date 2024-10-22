const express=require("express")
const {videoRepository,categoryRepository} = require("../database")
const { formatData } = require("../untils")
const CustomError= require("../untils/customError")

const video = require("../api/video")
const mongoose = require("mongoose")
const { ObjectId } = mongoose.Types;
class channelService{
    constructor(){
        // reposiroties
        this.videoRepo=new videoRepository(); 
        this.categoryRepo = new categoryRepository();

    }
    //-------------------VIEWS -----------------------------//
    async increaseViews(id){
        try {
            const updateInfo={
                $inc:{views:1}
            }
            return await this.videoRepo.updateVideo(id,updateInfo);
            
        } catch (error) {
            throw error;
        }
    }
    //------------------VIEWS ------------------------------//

    //-------------------CHANNEL PAGE------------------------------//

    async getChannelHomeVideos(channelId){
        try {
            const newVideos=await this.videoRepo.findVideos({channelId:channelId,status:"ready",modeView:"public"},{createdAt:"desc"},0,6)
            const mostViewsVideos = await this.videoRepo.findVideos({
                channelId: channelId,
                status: "ready",
                modeView: "public"
            }, {
                views: "desc"
            }, 0, 6)
            const mostLikedVideos = await this.videoRepo.findVideos({
                channelId: channelId,
                status: "ready",
                modeView: "public"
            }, {
                likesCounts: "desc"
            }, 0, 6)
            return {
                newVideos:newVideos,
                mostViewsVideos:mostViewsVideos,
                mostLikedVideos:mostLikedVideos
            }
        } catch (error) {
            throw error
        }
    }
    async getChannelVideos(channelId,sort){
        try {
            const videos=await this.videoRepo.findVideos({channelId:channelId,status:"ready",modeView:"public"},sort,0,8)
            return videos;
        } catch (error) {
            throw error
        }
    }
    // ----------------VIDEO SERVICE------------------------------/ /
    //delete video
    async deleteVideos(videoIds){
        try {
            videoIds.map(async (item)=>{
                await this.videoRepo.deleteVideo(item)
            })
            return {message:"deleted success"}
        } catch (error) {
            throw errr
        }
    }
    /// update video
    async updateVideo(videoId, data){
        try {
            const video = await this.videoRepo.findOneVideoId(videoId);
            const updateInfo={
                description:data.description,
                title:data.title,
                categoryId:data.category,
                modeView:data.modeView,
            }
            if (video.status == "processing") {
                updateInfo.status = "ready";
            } else if(video.status=="created") {
                updateInfo.status = "processing";
            }
            video=await this.videoRepo.updateVideo(videoId,updateInfo);
            return formatData(video);
        } catch (error) {
            
        }

    }
    // create category
        // get categories
    async getCategories(){
         try {
             const result = await this.categoryRepo.findCategories("active","");
             return formatData(result);
         } catch (error) {
             throw error
         }
    }
    async createCategory(name, description){
        try {
            const result=await this.categoryRepo.createCategory(name,description);
            return formatData(result);
        } catch (error) {
            throw error
        }
    }
    //get video for channel home page 
    async createVideo(channelId) {
        try {
            const newVideo =await this.videoRepo.createVideo(channelId);
            return formatData(newVideo);
        } catch (error) {
            throw error
        }
    }
      //get video for channel
      async getVideosForChannel(channelId) {
          try {
              const videos = await this.videoRepo.findVideos({channelId:channelId,delete:false},{},0,0)
              return formatData(videos);
          } catch (error) {
              throw error
          }
      }
 

    //getVideobyId
    async getVideo(id){
        try {
            if(mongoose.isValidObjectId(id)){
                const video=await this.videoRepo.findOneVideoId(id);
                return formatData(video)
            }
                return null;                
        } catch (error) {
                throw error;
        }
    }
       //getVideos
    async getVideos(pagination,number,categoryId) {
        try {
        const find = {
            modeView: "public",
            status: "ready"
        }
        if(categoryId)
            find.categoryId=categoryId;
        const fields = "title _id views thumbnail createdAt channelId categoryId duration";
            const videos = await this.videoRepo.findVideosWithFields(find,{views:"desc",createdAt:"desc"},pagination,fields,number);
            return formatData(videos)
        } catch (error) {
            throw error;
        }
    }
    async getVideosSidebar(videoId,pagination,channelId,categoryId) {
        try {
        const fields = "title _id views thumbnail createdAt";
        
        const videoChannelRelateds = await this.videoRepo.findVideosWithFields({modeView:"public",status:"ready",channelId:channelId,_id:{$ne:videoId},categoryId:categoryId}, {createdAt: "desc"},pagination,fields,2);

        const videoCategoryRelateds = await this.videoRepo.findVideosWithFields({modeView:"public",status:"ready",categoryId:categoryId,channelId:{$ne:channelId}}, {views: "desc"},pagination,fields,2);

        const videoMostViews = await this.videoRepo.findVideosWithFields({modeView:"public",status:"ready",categoryId:{$ne:categoryId},channelId:{$ne:channelId}}, {views: "desc"},pagination,fields,2);
        const arrayFinal = videoCategoryRelateds.concat(videoChannelRelateds,videoMostViews)
        return formatData(arrayFinal)
        } catch (error) {
        console.log(error)
        }
    }
    // update the video url
    async updateVideoAfterUpload(videoId,videoUrl,duration,thumbnail) {
        try {
        const updateInfo = {videoUrl: videoUrl,duration: duration}
        const video=await this.videoRepo.findOneVideoId(videoId);
        if(video.thumbnail==""){
            updateInfo.thumbnail=thumbnail;
        }
            if (video.status == "processing") {
                updateInfo.status = "ready";
            } else if (video.status == "created") {
                updateInfo.status = "processing";
            }
        video = await this.videoRepo.updateVideo(videoId,updateInfo)
        return formatData(video)
        } catch (error) {

        }
    }
     // get categories
    async getCategories(videoId, videoUrl, duration, thumbnail) {
        try {
            const video = await this.categoryRepo.getCategories(videoId)
            return formatData(video)
        } catch (error) {

        }
    }
    // ---get history video info
    async getHistoryVideos(videoIds){
        try {
            videoIds=videoIds.map((item)=>new ObjectId(item));
            const fields="thumbnail _id views channelId description title"
            const videos=await this.videoRepo.findVideosWithFields({_id:{$in:videoIds}},{},0,fields,0)
            return videos;
        } catch (error) {
            console.log("error at get history videos")
            console.log(error)
            console.log("==============================================")
        }

    }

    // after upload image
    async uploadImage(videoId,thumbnail){
    try {
        const video = await this.videoRepo.updateVideo(videoId,{thumbnail:thumbnail})
        return formatData(video)
    } catch (error) {
        throw error;
    }
    }

    async adjustLikes(amount, videoId){
        try {
            const video = await this.videoRepo.updateVideo(videoId,{$inc:{likesCounts:amount}})
        return formatData(video)
        } catch (error) {
            throw error;
        }
    }
  async SubcribeEvent(payload) {
      payload = JSON.parse(payload)
      const {
          event,
          data
      } = payload;
      const {
          videoId,
          flag,
          videoUrl,
          duration,
          thumbnail,
          videoIds,
          amount
      } = data;
      switch (event) {
        case "ADJUST_LIKES":
           return await this.adjustLikes(amount,videoId);
           break;
        case "GET_VIDEOS_INFO":
            return await this.getHistoryVideos(videoIds);
            break;
        case "UPLOAD_SUCCESS":
            return await this.updateVideoAfterUpload(videoId, videoUrl, duration, thumbnail);
            break;
        case "CHANGE_IMAGE":
                return await this.uploadImage(videoId,thumbnail);
                break;
        case "INCREASE_VIEW":
            await this.increaseViews(google_id);
            break;
        case "ADD_HISTORY":
            await this.addHistory(google_id, video_id);
            break;
        case "CHANGE_SUBCRIBECOUNT":
            await this.changeSubcribeCount(google_id, flag);
            break;
        case "CHANGE_NOTIFICATION":
            await this.ChangeNotification(google_id, flag);
            break;




      }
  }
}
module.exports=channelService;