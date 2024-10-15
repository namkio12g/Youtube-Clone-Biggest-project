const express=require("express")
const {videoRepository,categoryRepository} = require("../database")
const { formatData } = require("../untils")
const video = require("../api/video")
const { default: mongoose } = require("mongoose")
class channelService{
    constructor(){
        this.repository=new videoRepository()
        this.categoryRepo = new categoryRepository()

    }
    async createNewChannel({email,password}){
        return this.repository.createNewChannel({email,password})
    }
    async getChannels(){
        return this.repository.getChannels()
    }
    //delete video
    async deleteVideos(videoIds){
        try {
            videoIds.map(async (item)=>{
                await this.repository.deleteVideo(item)
            })
            return {message:"deleted success"}
        } catch (error) {
            throw errr
        }
    }
    /// update video
    async updateVideo(videoId, data){
        try {
            const video = await this.repository.findOneVideoId(videoId);
            const updateInfo={
                description:data.description,
                title:data.title,
                categoryId:data.category,
                modeView:data.modeView,
            }
            if (video.status == "processing") {
                updateInfo.status = "ready";
            } else {
                updateInfo.status = "processing";
            }
            video=await this.repository.updateVideo(videoId,updateInfo);
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
            const newVideo =await this.repository.createVideo(channelId);
            return formatData(newVideo);
        } catch (error) {
            throw error
        }
    }
      //get video for channel home page 
      async getVideosForChannel(channelId) {
          try {
              const videos = await this.repository.findVideos({channelId:channelId,delete:false},{},0,0)
              return formatData(videos);
          } catch (error) {
              throw error
          }
      }
    //get video for channel home page 
    async getVideosForChannelHome(channelId){
        try {
            const newVideos = this.repository.getNewVideos(channelId,12);
            const mostLikedVideos=this.repository.getMostLikedVideos(channelId,12);
            const mostViewsVideos = this.repository.getMostViewsVideos(channelId, 12);
            const response={
                new_videos:newVideos,
                most_liked_videos:mostViewsVideos,
                most_views_videos:mostViewsVideos
            }
            return formatData(response);
        } catch (error) {
            throw error
        }
    }
 
    //get video for channel home videos 
    async getVideosForChannelVideos(channelId,pagination,query) {
        try {
            let sort={}
            if(query=="new")
                sort.date="desc";
            else if(query=="old")
                sort.date="asc"
            else if(query=="views")
                sort.views="desc"
            const videos = this.repository.getVideosForChannel(channelId,pagination,sort);
            return formatData(videos);
        } catch (error) {
            throw error
        }
    }
    //getVideobyId
    async getVideo(id){
        try {
            if(mongoose.isValidObjectId(id)){
                const video=await this.repository.findOneVideoId(id);
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
            const fields = "title _id views thumbnail createdAt channelId categoryId";
               const videos = await this.repository.findVideosWithFields(find,{views:"desc",createdAt:"desc"},pagination,fields,number);
               console.log(videos)
               return formatData(videos)
           } catch (error) {
                throw error;
           }
       }
          async getVideosSidebar(videoId,pagination,channelId,categoryId) {
              try {
                const fields = "title _id views thumbnail createdAt";
               
                const videoChannelRelateds = await this.repository.findVideosWithFields({modeView:"public",status:"ready",channelId:channelId,_id:{$ne:videoId},categoryId:categoryId}, {createdAt: "desc"},pagination,fields,2);

                const videoCategoryRelateds = await this.repository.findVideosWithFields({modeView:"public",status:"ready",categoryId:categoryId,channelId:{$ne:channelId}}, {views: "desc"},pagination,fields,2);

                const videoMostViews = await this.repository.findVideosWithFields({modeView:"public",status:"ready",categoryId:{$ne:categoryId},channelId:{$ne:channelId}}, {views: "desc"},pagination,fields,2);
                console.log(videoChannelRelateds)
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
            const video=await this.repository.findOneVideoId(videoId);
            if(video.thumbnail!=""){
                updateInfo.thumbnail=thumbnail;
            }
            if(video.status=="processing"){
               updateInfo.status = "ready";
            }
            else{
                updateInfo.status = "processing";
            }
            video = await this.repository.updateVideo(videoId,updateInfo)
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

     // after upload image
     async uploadImage(videoId,thumbnail){
        try {
            const video = await this.repository.updateVideo(videoId,{thumbnail:thumbnail})
            return formatData(video)
        } catch (error) {
            
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
      } = data;
      switch (event) {
          case "UPLOAD_SUCCESS":
              return await this.updateVideoAfterUpload(videoId,videoUrl,duration,thumbnail);
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