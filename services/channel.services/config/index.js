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
    SALTROUNDS: process.env.SALTROUNDS,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    JWTSECRETKEY: process.env.JWTSECRETKEY,
    EXCHANGE_NAME: process.env.EXCHANGE_NAME,
    RABBITMQ_URL: process.env.RABBITMQ_URL,
    CHANNEL_SERVICE: process.env.CHANNEL_SERVICE

}