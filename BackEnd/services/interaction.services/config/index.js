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
    JWTSECRETKEY: process.env.JWTSECRETKEY,
    EXCHANGE_NAME: process.env.EXCHANGE_NAME,
    RABBITMQ_URL: process.env.RABBITMQ_URL,
    INTERACTION_SERVICE: process.env.INTERACTION_SERVICE,
    REPLY_QUEUE: process.env.REPLY_QUEUE
}