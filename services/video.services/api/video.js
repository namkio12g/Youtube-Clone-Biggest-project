const express= require("express")
const videoService=require("../service/video-service.js");
const axios =require("axios")
const multer = require('multer');
const path = require('path');
const CustomError = require("../untils/customError")
const FormData = require('form-data');
const videoModel=require('../database/models/video.model.js')
const {authJWT}=require("./middleware/auth.js")
const {SubcribeMSG,PushlishMSGNoReply, PushlishMSGWithReply}=require("../untils");
const EventEmitter = require('events');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage
});

const fs = require('fs');
const { channel } = require("diagnostics_channel");
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}
let timeOutForVideo;
const updateEmitter = new EventEmitter();
module.exports=(app,channel)=>{
    const service = new videoService();
    SubcribeMSG(channel, service);
     app.get("/hello", (req, res) => {
         res.json({
             message: "hello failure1"
         });
     });
    app.get("/throw", (req, res,next) => {
        throw new CustomError("some thing went wrong 1",404)
    });


    //-------------------CHANNEL PAGE------------------------------//
    
    app.get("/channel-home-videos",async (req,res,next)=>{
        try {
            
            const channelId=req.body.channelId;
            const videos=await service.getChannelHomeVideos(channelId)
            res.json(videos)
        } catch (error) {
            next(error);
        }

    })
    app.get("/channel-videos/:sort", async (req, res,next) => {
        try {
            const channelId = req.body.channelId;
            var sort = req.params.sort;
            if(sort=="time-asc")
                sort={createdAt:"asc"}
            else if (sort == "views")
                 sort={views:"desc"}
            else if(sort=="time-desc")
                 sort={createdAt:"desc"}
            const videos = await service.getChannelVideos(channelId,sort);
            res.json(videos)
        } catch (error) {
            next(error);
        }

    })

app.post("/increase-views/:id",async (req,res,next)=>{
    try {
        const id =req.params.id;
        await service.increaseViews(id);
        res.json("successs")
    } catch (error) {
        next(error)
    }
})






     // ----------------VIDEO SERVICE------------------------------/ /
    async function triggerUpdateVideos(channelId) {
        clearTimeout(timeOutForVideo)
        timeOutForVideo = setTimeout(async () => {
            await updateEmitter.emit('update', channelId);
        }, 1000);
        
    }

    // server sent events 
    app.get('/events', async (req, res) => {
        const channelId=req.query.channelId;
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        const sendUpdate = (data,firstLoad=false) => {
           res.write(`data: ${JSON.stringify({ videos: data,firstLoad:firstLoad })}\n\n`);
        };

        const initialData = await service.getVideosForChannel(channelId);
        sendUpdate(initialData,true);
        const onUpdate = async (channelId) => {
            const Data = await service.getVideosForChannel(channelId);
            sendUpdate(Data);
        };

        updateEmitter.on('update', onUpdate);

        req.on('close', () => {
            console.log("close")
            updateEmitter.removeListener('update', onUpdate);
            res.end(); // Close the response
        }); 
    });

    //update video
    app.post("/update-video/:id",upload.single("thumbnail"),authJWT,async (req,res,next)=>{
        if(req.body.channelId){
            const videoId = req.params.id;
            const channelId=req.body.channelId
            const data=await service.updateVideo(videoId,req.body);
            if(req.file){
                console.log(fs.createReadStream(req.file.path))
                const formData = new FormData();
                formData.append('file', fs.createReadStream(req.file.path));
                formData.append("videoId", data._id.toString());
                formData.append("oldUrl", data.thumbnail);
                axios.post("http://localhost:2024/changeImage", formData, {
                    headers: {
                        ...formData.getHeaders()
                    },
                }).then(async (response) => {
                    await fs.unlinkSync(req.file.path);
                    triggerUpdateVideos(channelId)
                    console.log('Success: wwin', );
                }).catch((error) => {
                    console.error('Error',error);
                });
        }}

        res.redirect("back")

    })
 
    
    app.get("/get-video/:id", async (req, res, next) => {
        const id = req.params.id;
        const data = await service.getVideo(id);
        const msg={
            event:"GET_CHANNEL_INFO",
            data:{
                channelId:data.channelId
            }
        };
        const response=await PushlishMSGWithReply(channel,msg,"channel");
        const channelsInfo=JSON.parse(response);
        res.json({video:data,channel:channelsInfo[0]
        })
    })
      app.get("/get-one-video/:id", async (req, res, next) => {
          const id = req.params.id;
          const data = await service.getVideo(id);
          res.json({
              video: data,
          })
      })

    app.get("/get-videos-home", async (req, res, next) => {
    try {
        
        const pagination = req.query.pagination;
        const number = req.query.number;
        const categoryId = req.query.categoryId;
        const videos = await service.getVideos(pagination,number,categoryId);
        const channelIds = [...new Set(videos.map(video => video.channelId.toString()))];
        const payload={
            event:"GET_CHANNELS_TITLE",
            data:{
                channelIds:channelIds
            }
        }
        const channelsResponse = await PushlishMSGWithReply(channel,payload,"channel");
        const channels=JSON.parse(channelsResponse);
        const channelMap = channels.reduce((acc, channel) => {
            acc[channel.id] = channel.title;
            return acc;
        }, {});
        const videosWithChannel = videos.map(video => {
            const videoObj = video.toObject();
            return {
                ...videoObj, 
                channelTitle: channelMap[video.channelId], 
            };
        });
            res.json({
                videosWithChannel
            })
    } catch (error) {
        console.log(error)
    }
    })

    app.get("/get-videos-sidebar", async (req, res, next) => {
        const channelId = req.query.channelId;
        const categoryId = req.query.categoryId;
        const pagination =req.query.pagination;
        const videoId = req.query.videoId;
        const data = await service.getVideosSidebar(videoId,pagination,channelId,categoryId)
        res.json({
            data
        })
    })

    app.get("/get-videos" ,async (req, res, next) => {
        const data = await service.getVideos()
        res.json({
            video: data
        })
    })
    // delete video
    app.post("/delete-video", authJWT, async (req, res) => {
           if (req.body.channelId) {
                const videoIds=req.body.videoIds;
                const result=await service.deleteVideos(videoIds);
                if(result){
                    const payload = {
                        event: "ADJUST_VIDEO_COUNT",
                        data: {
                            amount: -1*videoIds.length,
                            channelId: channelId
                        }
                    };
                    PushlishMSGNoReply(channel, payload, "channel");
                }
                triggerUpdateVideos(req.body.channelId);
                res.json(
                    result
                );
                return;
           }
           res.json({
               message: "you have no right to do this"
           })
       })
 
    //create video
    app.post("/create-video", upload.single('file'), authJWT, async (req, res, next) => {
    const channelId=req.body.channelId;
    const data = await service.createVideo(channelId)
    if(data){
        const payload={
            event:"ADJUST_VIDEO_COUNT",
            data:{
                amount:1,
                channelId:channelId
            }
        }
        PushlishMSGNoReply(channel,payload,"channel");

        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path));
        formData.append("videoId", data._id.toString());
        axios.post("http://localhost:2024/processAndUploadVideo", formData,{
            headers: {
                ...formData.getHeaders()
            },
        }).then(async (response) =>{
                await fs.unlinkSync(req.file.path)
                clearTimeout(timeOutForVideo)
                triggerUpdateVideos(channelId);
                
                console.log('Success: wwin', );
        }).catch(async (error) => {
                await fs.unlinkSync(req.file.path)
                console.error('Error:',error);
        });
        triggerUpdateVideos(channelId);
    }
    res.json({
            video: data
        })
    })

    // CATEGORY
    app.get("/get-categories", async (req, res, next) => {
        
        const data = await service.getCategories()
         res.json({
            data
         })

     })

    app.post("/create-category", async (req, res, next) => {
        const name=req.body.name;
        const description=req.body.description;
        if(name){
            const data = await service.createCategory(name,description)
            res.json({
                category: data
            })
            return;
        }
        res.status(400).json({
            message:"missing fields"
        })
        
    })
}