const express= require("express")
const channelService=require("../service/channel-service.js")
const {SubcribeMSG}=require("../untils")

module.exports=(app,passport,channel)=>{
    const service = new channelService();
    SubcribeMSG(channel,service);
    function isLoggedIn(req, res, next) {
        req.user ? next() : res.sendStatus(401)
    }
    // authentication with google
    app.get("/auth/google",
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
       
    )
    app.get('/auth/google/callback', passport.authenticate('google',{
        successRedirect:"/auth/protected",
        failureRedirect: "/auth/failure"
    }));
    app.get("/auth/protected", isLoggedIn, async (req, res) => {
        const name = req.user._json.name;
        const email = req.user._json.email;
        const id=req.user.id;
        const thumbnail = req.user._json.picture;
        const token=await service.login(name,email,id,thumbnail)
        res.cookie("token",token,{
            maxAge: 3600000,
            httpOnly:true
        })
        res.redirect("http://localhost:5173/")
    });
    app.get("/auth/failure", (req, res) => {
          res.json({
              message: "hello failure"
          });
    });
    app.get("/hello", (req, res) => {
        res.json({
            message: "hello failure"
        });
    });
    // fetch user
    app.get("/getInfo",async(req,res)=>{
        const token = req.cookies.token;
        const channel=await service.getInfoLogin(token)
            res.json({
            channel:channel
        });
    })
    //other
    app.post("/createChannel",async (req,res,next)=>{
        const {email,password}=req.body;
        const data=await service.createChannel({email,password});
        res.json(data)
    })
    app.get("/getChannels",async(req,res,next)=>{
        const data=await service.getChannels();
        return res.json(data)
    })
}