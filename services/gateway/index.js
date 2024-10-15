const express=require("express");
const{createProxyMiddleware} = require("http-proxy-middleware")
require('dotenv').config();
const app=express();
const cors = require("cors");
app.use(cors());

app.use("/channel", createProxyMiddleware({
    target: "http://localhost:2021",
    changeOrigin: true
}))
app.use("/user", createProxyMiddleware({
    target: "http://localhost:2022",
    changeOrigin: true
}))
app.use("/interaction", createProxyMiddleware({
    target: "http://localhost:2023",
    changeOrigin: true
}))
app.use("/upload", createProxyMiddleware({
    target: "http://localhost:2024",
    changeOrigin: true
}))
app.use("/", createProxyMiddleware({
    target: "http://localhost:2020",
    changeOrigin: true
}))

app.listen(process.env.PORT||3000,()=>{
    console.log(`listening to port ${process.env.PORT||3000}`)
})