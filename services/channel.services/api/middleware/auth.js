const jwt = require("jsonwebtoken")
const {JWTSECRETKEY}=require("../config")
module.exports.authJWT=(req,res,next)=>{
     const token = req.cookies.token
     if (token) {
         jwt.verify(token,JWTSECRETKEY, (err, decoded) => {
             if (err) {
                 req.session.destroy(err => {
                     if (err) {
                         return res.send('Error logging out.');
                     }
                 })
                 res.json({
                     flag:false
                 })


             } else {
                 // req.session.staff=decoded
                 next()

             }
         });
}
    res.json({
        flag:false
    })
}