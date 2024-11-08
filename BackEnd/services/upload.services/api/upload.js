const express= require("express")
const uploadService=require("../service/upload-service.js")
const path = require('path');
const multer = require('multer');

const {
    SubscribeMSG,
    PushlishMSGWithReply,
    PushlishMSGNoReply
} = require("../untils/index.js")


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
module.exports=(app,channel)=>{
    const service = new uploadService();
    SubscribeMSG(channel, service);
    app.post("/changeImage", upload.single('file'), async (req, res, next) => {
        if (!req.file) {
            console.log("error")
            return res.status(400).send('No file uploaded.');
        }
        const inputFile = req.file.path;
        if (req.body.videoId) {
            const result = await service.processsAndUploadImageCloud(req.file.path)
            if(result){
                const keyDelete = req.body.oldUrl.split('/').pop();
                await service.deleteObjectFromS3(keyDelete)
            }
            const data = {
                 videoId: req.body.videoId,
                 thumbnail: result
             }
             const msg = {
                 event: "CHANGE_IMAGE",
                 data: data
             }
             await PushlishMSGNoReply(channel, msg, "video")
             res.json(result)
             return
        }
        res.json({
            message: "video-upload failed"
        })
        return

    })


    app.post("/processAndUploadVideo", upload.single('file'), async (req, res, next) => {
        if (!req.file) {
            console.log("error")
              return res.status(400).send('No file uploaded.');
        }
        const inputFile = req.file.path;
        if (req.body.videoId) {
        const qualities = [{
                value: '1280x720',
                output: '720p.mp4'
            },
            {
                value: '854x480',
                output: '480p.mp4'
            },
            {
                value: '640x360',
                output: '360p.mp4'
            }
        ];
        const [result, imagePath] = await Promise.all([
            service.processsAndUploadCloud(inputFile, qualities),
            service.extractFrameFromVideo(inputFile, '00:00:05','1280x720'),
        ]);
        const [imagePathCloud, duration] = await Promise.all([
            await service.uploadImageCloud(imagePath),
            await service.getVideoDuration(inputFile),
        ]);
        const data={
            videoId:req.body.videoId,
            videoUrl:result,
            duration:duration,
            thumbnail:imagePathCloud
        }
        const msg={
            event:"UPLOAD_SUCCESS",
            data:data
        }
        await PushlishMSGNoReply(channel,msg,"video")
        res.json(result)
        return
        }
        res.json({message:"video-upload failed"})
        return

    })
    app.get("/hello", (req, res) => {
        res.json({
            message: "hello"
        });
    });
    
   
}