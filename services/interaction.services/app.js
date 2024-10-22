const express = require("express");
const cors = require("cors");
const api=require("./api/interaction")
const cookieParser = require('cookie-parser');
const errorHandler = require("./api/middleware/errorHandler")
const bodyParser = require('body-parser');
const {
    createRabbitConnection
} = require("./untils");
module.exports = async (app)=>{
    const channel = await createRabbitConnection();
    app.use(express.json());
    app.use(cookieParser());

    app.use(bodyParser.urlencoded({
        extended: true
    }))
    app.use(cors());
    api(app, channel);
    app.use(errorHandler)
    
    
}