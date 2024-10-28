const express = require("express");
const cors = require("cors");
const api=require("./api/upload")
const {createRabbitConnection}=require("./untils")

module.exports = async (app)=>{
    
    const channel = await createRabbitConnection();
    app.use(express.json());
    app.use(cors());
    api(app,channel);
    
}