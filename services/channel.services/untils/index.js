const axios = require("axios");
const bcrypt = require("bcrypt")
const {SALTROUND} = require("../config")
const jwt=require("jsonwebtoken")
const {JWTSECRETKEY,EXCHANGE_NAME,RABBITMQ_URL,CHANNEL_SERVICE,REPLY_QUEUE}=require("../config")
const amqlib =require("amqplib")
const { v4: uuidv4 } = require('uuid'); 

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
module.exports.generateJWTToken = (email, id) => {
    const token = jwt.sign(
        {id: id,email:email}
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
        const connection = await amqlib.connect(RABBITMQ_URL, {
            reconnect: true,
            heartbeat: 10
        });
        const channel=await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME,"direct",{durable:true})
        await channel.assertQueue(REPLY_QUEUE, {
            exclusive: true
        });
        return channel
    } catch (error) {
        throw error;
    }
};



module.exports.PushlishMSGNoReply=async(channel,msg,service)=> {
    msg = JSON.stringify(msg);
    channel.publish(EXCHANGE_NAME, service, Buffer.from(msg),{
    });
    console.log("send",msg);
};
module.exports.PushlishMSGWithReply = (channel, msg, service) => {
    return new Promise(async (resolve, reject) => {
        const correlationId = uuidv4();
        console.log(correlationId);
        msg = JSON.stringify(msg);
        channel.consume(
            REPLY_QUEUE,
            (msg) => {
                if (msg.properties.correlationId === correlationId) {
    
                    console.log("Request Received response:", msg.content.toString());
                    resolve(msg.content.toString());
                }
            }, {
                noAck: true
            }
        );
        await channel.publish(EXCHANGE_NAME, service, Buffer.from(msg), {
            correlationId: correlationId,
            replyTo: REPLY_QUEUE,
        });
        console.log("send", msg);
    })

};

module.exports.SubcribeMSG=async(channel,service)=>{
    const q =await channel.assertQueue("",{exclusive:true});
    channel.bindQueue(q.queue,EXCHANGE_NAME,CHANNEL_SERVICE)
    channel.consume(q.queue,async(msg)=>{
        if(msg.content){
            if(msg.properties.replyTo){
                var response = await service.SubcribeEvent(msg.content.toString());

                response=JSON.stringify(response)
                console.log("i send")
                channel.sendToQueue(msg.properties.replyTo, Buffer.from(response), {
                    correlationId: msg.properties.correlationId,
                });
                console.log("i sended")

                return ;
            }
            else{
                console.log("the msg is :", msg.content.toString())
            }
        }
    },{noAck:true});

};