const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const api=require("./api/channel")
const session = require('express-session');
const passport = require('passport');
const {GOOGLE_CLIENT_SECRET,GOOGLE_CLIENT_ID}=require("./config");
const errorHandler = require("./api/middleware/errorHandler")
const { Session } = require("inspector/promises");
const { redirect } = require("react-router-dom");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {createRabbitConnection}=require("./untils")
const bodyParser = require('body-parser');
passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:2021/auth/google/callback',
        passReqToCallback:true
    },
    function(request,accessToken,refreshToken,profile,done){
        redirect("/")
        return done(null,profile)
    }
 
));
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
module.exports = async (app)=>{
    const channel=await createRabbitConnection();
    app.use(session({
        secret: 'little_love',
     
    }));
    
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(cookieParser());
    app.use(express.json());
    app.use(cors());
      app.use(bodyParser.urlencoded({
          extended: true
      }))
    app.use(bodyParser.json())
    api(app,passport,channel);
    app.use(errorHandler)

    
}