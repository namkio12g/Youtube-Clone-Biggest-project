const mongoose = require("mongoose")
const videoModel = require('../models/video.model.js');
const cateforyModel = require('../models/category.model.js');

class videoRepository {
    async createVideo(channelId) {
        try {
            const newvideo = new videoModel({
                channelId:channelId,
            })
            const result = await newvideo.save()
            return result;
        } catch (error) {
            throw error;
        }


    }
    // update video url
    async updateVideoUrl(videoId, videoUrl){
        try {
            const result=await videoModel.findByIdAndUpdate(videoId,{
                videoUrl:videoUrl,
                status:"ready"
            })
            return result;
        } catch (error) {
            throw error
        }
    }
    // get videos
    async getNewVideos(channelId, number){
        try {
            const newVideos=await videoModel.find({channelId:channelId}).sort({date:"desc"}).limit(number);
            return newVideos
        } catch (error) {
            throw error
        }
    };
    async getMostLikedVideos(channelId, number) {
        try {
            const mostLikeVideos=await videoModel.find({channelId:channelId}).sort({likesCounts:"desc"}).limit(number);
            return mostLikeVideos
        } catch (error) {
            throw error
        }

    };
    async getMostViewsVideos(channelId, number) {
        try {
            const mostViewsVideos=await videoModel.find({channelId:channelId}).sort({vimostLike:"desc"}).limit(number);
            return mostViewsVideos
        } catch (error) {
            throw error
        }

    }

       async getVideosForChannel(channelId, pagination,sort,number=8) {
           try {
               const videos = await videoModel.find({
                   channelId: channelId
               }).sort({
                   date: "desc"
               }).limit(number)
               .skip(pagination*number);
               return videos
           } catch (error) {
               throw error
           }
       };
    //update

    async updateVideo(id,updateInfo) {
        try {
            const video = await videoModel.findByIdAndUpdate(id, updateInfo)
            return video;
        } catch (error) {
            throw error
        }

    }
    //delete
    async deleteVideo(id) {
        try {
            const video = await videoModel.findByIdAndUpdate(id, {
                delete: true
            })
            return video;
        } catch (error) {
            throw error
        }

    }
    //find one category by id
    async findOneVideoId(id) {
        try {
            const video = await videoModel.findById(id)
            return video;
        } catch (error) {
            console.log(error);
            return null;
        }

    }
    //find videos
    async findVideos(find,sort,pagination,number=8) {
        try {
            if(number==0){
            const videos = await videoModel.find(find).sort(sort);
            return videos;
            }
            const videos = await videoModel.find(find).sort(sort).skip(pagination*number).limit(number);
            return videos;
        } catch (error) {
            throw error;
        }
    }
  //find videos
  async findVideosWithFields(find, sort, pagination, fields,number = 8) {
      try {
          if (number == 0) {
              const videos = await videoModel.find(find).sort(sort).select(fields);
              return videos;
          }
          const videos = await videoModel.find(find).sort(sort).skip(pagination * number).limit(number).select(fields);
          return videos;
      } catch (error) {
          throw error;
      }
  }
}
module.exports = videoRepository;