const express= require("express")
constuserService=require("../serviceuser-service.js")
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
        const data=awaituserService.createChannel({email,password});
        res.json(data)
    })
    app.get("/getChannels",async(req,res,next)=>{
        const data=await userService.getChannels();
        return res.json(data)
    })
}