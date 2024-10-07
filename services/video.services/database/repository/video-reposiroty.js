const mongoose = require("mongoose")
const videoModel = require('../models/video.model.js');
class videoRepository {
    async createVideo(title, description,channelId,duration,categoryId,thumbnail,videoUrl) {
        try {
            const newvideo = new videoModel({
                title: title,
                description: description,
                channelId:channelId,
                duration:duration,
                categoryId:categoryId,
                thumbnail:thumbnail,
                videoUrl:videoUrl
            })
            const result = await newvideo.save()
            return result;
        } catch (error) {
            throw error;
        }


    }

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

    async findVideos(status, categoryId,title) {
        try {
            const find = {}
            if (status != "") {
                find.status = status
            }
            if(categoryId!=""){
                find.categoryId=categoryId
            }
            if (title != "") {
                find.title = {
                    $regex: title,
                    $option: "i"
                }
            }
            const videos = await videoModel.find(find)
            return videos;
        } catch (error) {
            throw error;
        }
    }
}