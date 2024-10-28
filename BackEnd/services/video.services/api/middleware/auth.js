const jwt = require("jsonwebtoken")
const {JWTSECRETKEY}=require("../../config")
const {verifyJWTToken}=require("../../untils")
module.exports.authJWT=async (req,res,next)=>{
    const channelId=req.body.channelId;
    const token = req.cookies.token

     if (token) {
        const data=await verifyJWTToken(token);
        if(!data){
             res.status(401).json({
                 message: "cant find your channel"
             })
             return;
        }
        if (channelId && channelId != data.id) {
            console.log(data)
            console.log(channelId)

             res.status(403).json({
                 message: "hacker right?"
             })
             return;
         }
         next()
         return;
    }
    res.status(401).json({
        message:"cant find token"
    })
    return;
}