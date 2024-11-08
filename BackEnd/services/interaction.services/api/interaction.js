const express= require("express")
const interactionService=require("../service/interaction-service.js")
const CustomError = require("../untils/customError")
const {authJWT}=require("./middleware/auth.js")
const {SubscribeMSG,PushlishMSGNoReply, PushlishMSGWithReply}=require("../untils");
module.exports = (app, channel) => {

    const service=new interactionService()
    SubscribeMSG(channel, service);

    app.get("/hello", (req, res) => {
        res.json({
            message: "hello failure1"
        });
    });
    app.post("/create-comment", async (req, res, next) => {
        try {
            const channelId = req.body.channelId;
            const content = req.body.content;
            const parentId = req.body.parentId;
            const videoId = req.body.videoId;
            const comment = await service.createComment(videoId, channelId, parentId, content);
            var msg = {
                  event: "ADJUST_VIDEO_COMMENT_COUNT",
                  data: {
                      amount:1,
                      videoId:videoId
                  }
              }
            PushlishMSGNoReply(channel,msg,"video")




            msg = {
                event: "GET_COMMENTS_INFO_AND_CHANNEL_COMMENTSLIKE",
                data: {
                    channelId: null,
                    channelIds: [channelId]
                }
            }
            var replies = await PushlishMSGWithReply(channel, msg, "channel")
            replies = await JSON.parse(replies);
            const channelsInfo = replies.channelsInfo;
            const newcomment = {
                ...comment.toObject(),
                likedByMe: false,
                channelTitle: channelsInfo[0].title,
                channelThumbnail: channelsInfo[0].thumbnail,
            }

            if (parentId) {
                const commentReplied = await service.findOne(parentId);
                console.log(commentReplied)
                const message = {
                    event: "INTERACTED_NOTIFICATION",
                    data: {
                        videoId: videoId,
                        channelInteractionId: channelId,
                        channelId: commentReplied.channelId,
                        type: "REPLY_COMMENT"
                    }
                }
                PushlishMSGNoReply(channel, message, "channel")
            }
            res.json(newcomment)

        } catch (error) {
            next(error)
        }
    })
    app.patch("/update-comment", async (req, res, next) => {
        try {
            const channelId = req.body.channelId;
            const content = req.body.content;
            const commentId = req.body.commentId
            const comment = await service.updateComment(channelId, content, commentId);
            res.json(comment)
        } catch (error) {
            next(error)
        }
    })
    app.post("/delete-comment", async (req, res, next) => {
        try {
            const channelId = req.body.channelId;
            const commentId = req.body.commentId;
            const comment=await service.findOne(commentId)
            const result = await service.deleteComment(commentId);
            if (result.deletedCount==0){
                next(new CustomError("Cant find comment Id",404))
            }
            var msg = {
                event: "ADJUST_VIDEO_COMMENT_COUNT",
                data: {
                    amount: -1,
                    videoId: comment.videoId
                }
            }
            PushlishMSGNoReply(channel, msg, "video")


            msg = {
                event: "DELETE_COMMENT_LIKE",
                data: {
                    commentId: commentId
                }
            }
            PushlishMSGNoReply(channel, msg, "channel")
            res.json(result)

        } catch (error) {
            next(error)
        }
    })
    app.get("/get-comments/:videoId", async (req, res, next) => {
        try {
            const channelId = req.query.channelId;
            const videoId = req.params.videoId;
            var comments = await service.getComments(videoId)
            const channelIds = [...new Set(comments.map((comment) => comment.channelId.toString()))]
            const msg = {
                event: "GET_COMMENTS_INFO_AND_CHANNEL_COMMENTSLIKE",
                data: {
                    channelId: channelId,
                    channelIds: channelIds
                }
            }
            var replies = await PushlishMSGWithReply(channel, msg, "channel")
            replies = await JSON.parse(replies);
            const commentsLiked = replies.commentsLiked;
            const channelsInfo = replies.channelsInfo;
            const channelMap = channelsInfo.reduce((acc, channel) => {
                acc[channel.id] = {
                    title: channel.title,
                    thumbnail: channel.thumbnail
                };
                return acc;
            }, {});
            comments = comments.map((comment) => {
                const commentObj = comment.toObject();
                return {
                    ...commentObj,
                    likedByMe: commentsLiked ? commentsLiked.includes(comment._id.toString()) : false,
                    channelTitle: channelMap[comment.channelId].title,
                    channelThumbnail: channelMap[comment.channelId].thumbnail,


                }
            })

            res.json(comments)
        } catch (error) {
            next(error)
        }
    })
     }
