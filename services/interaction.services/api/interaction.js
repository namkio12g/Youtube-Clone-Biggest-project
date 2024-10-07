const express= require("express")
const interactionService=require("../service/interaction-service.js")
module.exports=(app)=>{
    app.post("/login",async (req,res,next)=>{

    })
    // app.get("/hello", (req, res) => {
    //     res.json({
    //         message: "hello"
    //     });
    // });
    
    app.post("/createChannel",async (req,res,next)=>{
        const {email,password}=req.body;
        const data=await interactionService.createChannel({email,password});
        res.json(data)
    })
    app.get("/getChannels",async(req,res,next)=>{
        const data=await interactionService.getChannels();
        return res.json(data)
    })
}