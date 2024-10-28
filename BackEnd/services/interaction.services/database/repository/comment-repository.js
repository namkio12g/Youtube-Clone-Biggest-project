const mongoose = require("mongoose")
const commentModel = require('../models/comment.model.js');


class commentRepository {
    async findComments(find,sort){
        const comments= await commentModel.find(find).sort(sort);
        return comments;
    }
    async updateComment(find, updateInfo) {
        const comment = await commentModel.findOneAndUpdate(find,updateInfo);
        return comment;
    }
    async deleteComment(find) {
        const comment = await commentModel.deleteMany(find);
        return comment;
    }
    async createOne(videoId, channelId, parentId,content){
        const newComment = new commentModel({
            parentId:parentId?parentId:null,
            channelId:channelId,
            videoId:videoId,
            content:content
        })
        return await newComment.save();
    }

}
module.exports = commentRepository;