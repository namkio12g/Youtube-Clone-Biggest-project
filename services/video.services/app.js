const express = require("express");
const cors = require("cors");
const api=require("./api/video");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const {createRabbitConnection}=require("./untils");
module.exports = async (app)=>{
    const channel = await createRabbitConnection();
    app.use(express.json());
    app.use(cookieParser());

    app.use(bodyParser.urlencoded({
        extended: true
    }))
    app.use(bodyParser.json())
    api(app,channel);
}