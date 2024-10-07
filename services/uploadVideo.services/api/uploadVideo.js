const express= require("express")
const uploadvideoService=require("../service/uploadvideo-service.js")
// const multer = require("multer");
// const storage = require("./output");
// const upload = multer({
//     storage: storage()
// });
module.exports=(app)=>{
    const service = new uploadvideoService();

    app.post("/processAndUploadVideo" ,async (req, res, next) => {
        const qualities = [{
                value: '1920x1080',
                output: '1080p.mp4'
            },
            {
                value: '1280x720',
                output: '720p.mp4'
            },
            {
                value: '854x480',
                output: '480p.mp4'
            }
        ];

        const result=await service.processsAndUploadCloud(req.body.file,qualities,"title1")
        res.json(result)

    })
    app.get("/hello", (req, res) => {
        res.json({
            message: "hello"
        });
    });
    
   
}