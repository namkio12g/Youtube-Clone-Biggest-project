const express=require("express");
const {PORT} =require("./config");
const expressApp=require("./app");
const {databaseConnection}=require("./database/connection")
const StartSever=async()=>{
    const app=express();
    await expressApp(app);
    app.listen((PORT),()=>{
        console.log(`listening to PORT ${PORT}`)
    }).on('error',(err)=>{
        console.log(err);
        process.exit();
    })
}
StartSever()
