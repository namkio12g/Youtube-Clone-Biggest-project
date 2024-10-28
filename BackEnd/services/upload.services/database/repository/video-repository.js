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
                videoUrl:videoUrl
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
    async cgetMostViewsVideos(channelId, number) {
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

    async updateVideo(id, description, channelId, duration, categoryId, thumbnail) {
        try {
            const video = await videoModel.findByIdAndUpdate(id, {
                title: title,
                description: description,
                categoryId: categoryId,
                thumbnail: thumbnail,
            })
            return VideoDecoder;
        } catch (error) {
            throw error
        }

    }
    //delete
    async deleteVideo(id) {
        try {
            const video = await categoryModel.findByIdAndUpdate(id, {
                delete: true
            })
            return category;
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
            throw error;
        }

    }
    //find categories

    async findVideos(find,sort,number=8) {
        try {
            const videos = await videoModel.find(find).sort(sort);
            return videos;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = videoRepository;