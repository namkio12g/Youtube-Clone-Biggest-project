const express= require("express")
const channelService=require("../service/channel-service.js")
const {SubcribeMSG, PushlishMSGWithReply, PushlishMSGNoReply}=require("../untils")

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
    app.get("/fetchChannel",async(req,res)=>{
        const token = req.cookies.token;
        const channel=await service.fetchChannel(token)
        if(channel){
        res.json({
            channel:channel
        });
        return ;
        }
        res.status(403).send("Token was not found or not available")
    })
      // get info
      app.get("/getInfo/:id", async (req, res) => {
        const id=req.params.id
          const channel = await service.getInfoChannel(id)
          if (channel) {
              res.json({
                  channel: channel
              });
              return;
          }
          res.status(403).send("Token was not found or not available")
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
    //get channel
    app.get("/getChannelWithReply/:id",async(req,res,next)=>{
        const id=req.params.id;
        console.log(id)
        const data=await service.getChannel(id);
        const data1=await PushlishMSGWithReply(channel,JSON.stringify({mymsg:"my msg"}),"video")
        res.json(data1)
    })
        //get channel
    app.get("/getChannelNoReply/:id", async (req, res, next) => {
            const id = req.params.id;
            console.log(id)
            const data = await service.getChannel(id);
            PushlishMSGNoReply(channel, JSON.stringify({
                mymsg: "my msg"
            }), "video")
            res.json(data)
    })
}