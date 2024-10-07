const express = require("express");
const cors = require("cors");
const api=require("./api/video")
module.exports = async (app)=>{
    app.use(express.json());
    app.use(cors());
    api(app);
    
}