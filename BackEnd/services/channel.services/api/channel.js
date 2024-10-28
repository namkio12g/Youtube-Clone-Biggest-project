const express= require("express")
const channelService=require("../service/channel-service.js")
const {SubcribeMSG, PushlishMSGWithReply, PushlishMSGNoReply}=require("../untils")
const CustomError = require("../untils/customError")
const {authJWT}=require("./middleware/auth.js")

module.exports=(app,passport,channel)=>{
    const service = new channelService();
    SubcribeMSG(channel,service);
    function isLoggedIn(req, res, next) {
        req.user ? next() : res.sendStatus(401)
    }
    app.get("/get-channel-info-page/:id",async (req,res,next)=>{
        try {
            const channleId=req.params.id;
            const userId=req.query.userId;
            const channel=await service.getChannelInfoPage(channleId,userId);
            res.json(channel)
        } catch (error) {
            next(error);
        }
    })
    // -------------------hisory--------------------///
    app.delete("/remove-history",async (req,res,next)=>{
        try {
            const channelId = req.body.id;
            const videoId = req.body.videoId;
            const response = await service.removeHistory(channelId, videoId)
            res.json(response)

        } catch (error) {
            next(error)
        }
    })
    app.get("/history/:id",async(req,res,next)=>{
        try {
            const channelId=req.params.id;
            const channelUser=await service.getOneChannel(channelId);
            if(!channelUser)
                next(new CustomError("cant find channel",404))
            const videoIds=channelUser.history.map((item)=>{
                return item.videoId
            })
            const payload = {
                event: "GET_VIDEOS_INFO",
                data: {
                    videoIds: videoIds
                }
            }
            const response = await PushlishMSGWithReply(channel,payload,"video");
            var videos=JSON.parse(response)



            const videosMap = channelUser.history.reduce((acc, item) => {
                    acc[item.videoId.toString()] = item.createdAt;
                    return acc;
                }, {});

            videos=await Promise.all( videos.map(async(video)=>{
                const channel=await service.getChannelInfo(video.channelId)
                return{
                    ...video,
                    createAt: videosMap[video._id.toString()],
                    channelTitle:channel[0].title
                }
            }))

            res.json(videos)
        } catch (error) {
            next(error)
        }

    })
    app.post("/add-history",async(req,res,next)=>{
        try {
            const channelId=req.body.id;
            const videoId=req.body.videoId;
            const response=await service.addHistory(channelId,videoId)
            res.json(response)

        } catch (error) {
            next(error)
        }
    })
    // ------------------videosliked--------------------///
    app.delete("/remove-videos-liked", async (req, res, next) => {
        try {
            const channelId = req.body.id;
            const videoId = req.body.videoId;
            const response = await service.removeVideosLiked(channelId, videoId)
            const payload = {
                event: "ADJUST_LIKES",
                data: {
                    amount: -1,
                    videoId: videoId
                }
            }
            PushlishMSGNoReply(channel, payload, "video");
            res.json(response)

        } catch (error) {
            next(error)
        }
    })
    app.get("/videos-liked/:id", async (req, res, next) => {
        try {
            const channelId = req.params.id;
            const channelUser = await service.getOneChannel(channelId);
            if (!channelUser)
                next(new CustomError("cant find channel", 404))
            console.log(channelUser.likesVideo)
            const payload = {
                event: "GET_VIDEOS_INFO",
                data: {
                    videoIds: channelUser.likesVideo
                }
            }
            const response = await PushlishMSGWithReply(channel, payload, "video");
            var videos = JSON.parse(response)
            videos = await Promise.all(videos.map(async (video) => {
                const channel = await service.getChannelInfo(video.channelId)
                return {
                    ...video,
       
                    channelTitle: channel[0].title
                }
            }))
            res.json(videos)
        } catch (error) {
            next(error)
        }

    })
    app.post("/add-videos-liked", async (req, res, next) => {
        try {

            const channelId = req.body.id;
            const videoId = req.body.videoId;
            const response = await service.addVideosLiked(channelId, videoId)
            var amount=-1
            if(response.addFlag)
                amount=1
            const payload = {
                event: "ADJUST_LIKES",
                data: {
                    amount: amount,
                    videoId:videoId
                }
            }
            PushlishMSGNoReply(channel, payload, "video");
            res.json(response)

        } catch (error) {
            next(error)
        }
    })
    // ------------------favourite videos--------------------///
    app.delete("/remove-favourite-videos", async (req, res, next) => {
        try {

            const channelId = req.body.id;
            const videoId = req.body.videoId;
            const response = await service.removeFavouriteVideos(channelId, videoId)
            res.json(response)

        } catch (error) {
            next(error)
        }
    })
    app.get("/favourite-videos/:id", async (req, res, next) => {
        try {
            const channelId = req.params.id;
            const channelUser = await service.getOneChannel(channelId);
            if (!channelUser)
                   next(new CustomError("cant find channel", 404))
            const payload = {
                event: "GET_VIDEOS_INFO",
                data: {
                    videoIds: channelUser.favouriteVideos
                }
            }
            const response = await PushlishMSGWithReply(channel, payload, "video");
            var videos = JSON.parse(response)
            videos = await Promise.all(videos.map(async (video) => {
                const channel = await service.getChannelInfo(video.channelId)
                return {
                    ...video,
                    channelTitle: channel[0].title
                }
            }))
            res.json(videos)
        } catch (error) {
            next(error)
        }

    })
    app.post("/add-favourite-videos", async (req, res, next) => {
        try {
            const videoId = req.body.videoId;
            const channelId=req.body.id;
            const response = await service.addFavouriteVideos(channelId, videoId)
            res.json(response)

        } catch (error) {
            next(error)
        }
    })
    // ------------------channels subcribed--------------------///

    app.get("/channels-subcribed/:id", async (req, res, next) => {
        try {
            const channelId = req.params.id;
            const channels=await service.getChannelSubcribed(channelId);
            res.json(channels)
        } catch (error) {
            next(error)
        }

    })
    app.post("/subcribe-channel", async (req, res, next) => {
        try {
            const channelId = req.body.channelId;
            const channelSucribedId = req.body.channelSucribedId;
            const response = await service.subcribeChannel(channelId, channelSucribedId)
            res.json(response);
        } catch (error) {
            next(error)
        }
    })
    app.get("/get-like-favourite-subcribe/:id",async (req, res, next) => {
        try {
            const id=req.params.id;
            const response=await service.getLikeFavouriteSubcribe(id)
            res.json(response)
        } catch (error) {
            next(error)
        }
    })
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
    //------------------comment-----------------------//
    app.post("/add-comment-liked", async (req, res, next) => {
        try {
            const commentId = req.body.commentId;
            const channelId = req.body.channelId;
            const response = await service.addCommentsLiked(channelId, commentId);
            var amount=-1
            if(response.addFlag)
                amount=1
            const payload = {
                event: "ADJUST_LIKES",
                data: {
                    amount: amount,
                    commentId: commentId
                }
            }
            PushlishMSGNoReply(channel, payload, "interaction");
            res.json(response);
        } catch (error) {
            next(error)
        }
    })

    app.delete("/remove-comment-liked", async (req, res, next) => {
        try {
            const commentId = req.body.commentId;
            const channelId = req.body.channelId;
            const response = await service.removeCommentsLiked(channelId, commentId);
            const payload = {
                event: "ADJUST_LIKES",
                data: {
                    amount: -1,
                    commentId: commentId
                }
            }
            PushlishMSGNoReply(channel, payload, "interaction");
            res.json(response);
        } catch (error) {
            next(error)
        }
    })
}