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
    UPLOAD_SERVICE: process.env.UPLOAD_SERVICE,
    BUCKET: process.env.BUCKET,
    REGION: process.env.REGION,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    REPLY_QUEUE: process.env.REPLY_QUEUEa

}