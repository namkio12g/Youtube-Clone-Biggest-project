const express=require("express")
const {commentRepository} = require("../database")
class interactionService{
    constructor(){
        this.commentRepo = new commentRepository()
    }
    // ----------------COMMENT SERVICE------------------------------//
    async updateComment(channelId, content, commentId) {
        try {
            const find = {
                _id: commentId
            };
            const updateInfo = {
                content: content
            }
            const comment = await this.commentRepo.updateComment(find, updateInfo);
            comment.content=content;
            return comment;
        } catch (error) {
            throw error;
        }
    }
    async deleteComment(commentId) {
        try {
            const find = {
                $or: [{
                        _id: commentId
                    }, 
                    {
                        parentId: commentId
                    }
                ]
            };
            const comment = await this.commentRepo.deleteComment(find);
            return comment;
        } catch (error) {
            throw error;
        }
    }
    async getComments(videoId) {
        try {
            const find = {
                videoId: videoId
            };
            const sort = {
                createdAt: "desc"
            }
            const comments = await this.commentRepo.findComments(find, sort);
            return comments;
        } catch (error) {
            throw error;
        }
    }
    async createComment(videoId, channelId, parentId, content) {
        try {
            const comment = await this.commentRepo.createOne(videoId, channelId, parentId, content);
            return comment;
        } catch (error) {
            throw error;
        }
    }
     async adjustLikes(amount, commentId) {
         try {
             const comment = await this.commentRepo.updateComment({_id:commentId}, {
                 $inc: {
                     likesCount: amount
                 }
             })
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
            commentId,
            amount
        } = data;
        switch (event) {
            case "ADJUST_LIKES":
                return await this.adjustLikes(amount, commentId);
                break;


        }
    }
    
}
module.exports=interactionService;