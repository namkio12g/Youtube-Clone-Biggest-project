const dotNetv=require("dotenv")

if(process.env.NODE_ENV!=="prod"){
    const configFile =`./env.${process.env.NODE_ENV}`;
    dotNetv.config({path:configFile})
}
else{
    dotNetv.config()
}
module.exports={

    DATABASE_URL: process.env.MONGODB_URL,
    PORT:process.env.PORT,
    RABBITMQ_URL:process.env.RABBITMQ_URL,
    EXCHANGE_NAME:process.env.EXCHANGE_NAME,
    VIDEO_SERVICE:process.env.VIDEO_SERVICE
}