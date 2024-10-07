const axios = require("axios");
const bcrypt = require("bcrypt")
const {SALTROUND} = require("../config")
const jwt=require("jsonwebtoken")
const {JWTSECRETKEY,EXCHANGE_NAME,RABBITMQ_URL,CHANNEL_SERVICE}=require("../config")
const amqlib =require("amqplib")

module.exports.verifyJWTToken=async(token)=>{
    let data;
    jwt.verify(token,JWTSECRETKEY, (err, decoded) => {
        if (err) {
            req.session.destroy(err => {
                if (err) {

                    return "1";
                }
            })
            return "1";


        } else {
            data= decoded;

        }
    });
    return data
}
module.exports.generateJWTToken = (email, google_id) => {
    const token = jwt.sign(
        {channelId: google_id,email:email}
        , process.env.JWTSECRETKEY, {expiresIn: '1h'});
    return token;
}
module.exports.formatData=(data)=>{
    if(data){
        return {data};
    }
    else{
        throw new Error("Data not found!")
    }
}
module.exports.bcryptPassword=async(password)=>{
    try {
         const salt = await bcrypt.genSaltSync(SALTROUNDS);
         const hash = await bcrypt.hashSync(password, salt);
         return hash
    } catch (error) {
        throw error
    }
  

}
module.exports.compareBcryptPassword = async (password,passwordhash) => {
    try {
       const result = bcrypt.compare(password,passwordhash);
       return result
    } catch (error) {
        throw error
    }


};
module.exports.createRabbitConnection=async()=>{
    try {
        const connection=await amqlib.connect(RABBITMQ_URL);
        const channel=await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME,"direct",{durable:true})
        return channel
    } catch (error) {
        throw error;
    }
};



module.exports.PushlishMSG=async(channel,msg,service)=> {
    await channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
    console.log("send",msg);

};

module.exports.SubcribeMSG=async(channel,service)=>{
    const q =await channel.assertQueue("",{exclusive:true});
    channel.bindQueue(q.queue,EXCHANGE_NAME,CHANNEL_SERVICE)
    console.log("wating for messages in queue")
    channel.consume(q.queue,(mgs)=>{
        if(msg.content){
            console.log("the msg is :",msg.content.toString())  
        }
        console.log("msg received")
    },{noAck:true});

};