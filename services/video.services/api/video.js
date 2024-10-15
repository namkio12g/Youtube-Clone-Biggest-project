const express= require("express")
const videoService=require("../service/video-service.js");
const axios =require("axios")
const multer = require('multer');
const path = require('path');
const FormData = require('form-data');
const videoModel=require('../database/models/video.model.js')
const {authJWT}=require("./middleware/auth.js")
const {SubcribeMSG,PushlishMSG, PushlishMSGWithReply}=require("../untils");
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
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}
let timeOutForVideo;
const updateEmitter = new EventEmitter();
module.exports=(app,channel)=>{
    const service = new videoService();
    SubcribeMSG(channel, service);

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

    
    app.post("/login",async (req,res,next)=>{

    })
    app.get("/hello", (req, res) => {
        res.json({
            message: "hello1"
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
 

    app.get("/get-for-channel-home",async(req,res,next)=>{
        const idChannel=req.body.idChannel;
        const data=await service.getVideosForChannelHome(idChannel)
        res.json({
            videos:data
        })
    })
    app.get("/get-for-channel-videos", async (req, res, next) => {

            const idChannel = req.body.pagination;
            const data = await service.getVideosForChannelVideos(idChannel,pagination)
            res.json({
                videos: data
            })
    })
    app.get("/get-video/:id", async (req, res, next) => {
        const id = req.params.id;
        const data = await service.getVideo(id)
        res.json({data
        })
    })
      app.get("/get-videos-home", async (req, res, next) => {
        try {
            
            const pagination = req.query.pagination;
            const number = req.query.number;
            const categoryId = req.query.categoryId;
            const videos = await service.getVideos(pagination,number,categoryId);
            console.log(videos)
            const channelIds = [...new Set(videos.map(video => video.channelId))];
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