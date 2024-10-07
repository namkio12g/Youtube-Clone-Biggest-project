const express = require("express");
const cors = require("cors");
const api=require("./api/uploadVideo")
module.exports = async (app)=>{
    app.use(express.json());
    app.use(cors());
    api(app);
    
}