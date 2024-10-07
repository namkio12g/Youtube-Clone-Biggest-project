const express= require("express")
const videoService=require("../service/video-service.js")
module.exports=(app)=>{
    app.post("/login",async (req,res,next)=>{

    })
    app.get("/hello", (req, res) => {
        res.json({
            message: "hello1"
        });
    });
    
    app.post("/createChannel",async (req,res,next)=>{
        const {email,password}=req.body;
        const data=await videoService.createChannel({email,password});
        res.json(data)
    })
    app.get("/getChannels",async(req,res,next)=>{
        const data=await videoService.getChannels();
        return res.json(data)
    })
}