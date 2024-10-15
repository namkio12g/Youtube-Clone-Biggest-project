const axios = require("axios");
const {RABBITMQ_URL,EXCHANGE_NAME,VIDEO_SERVICE,REPLY_QUEUE,JWTSECRETKEY}=require("../config")
const amqlib =require("amqplib");
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require('uuid'); 
module.exports.verifyJWTToken = async (token) => {
    let data;
    await jwt.verify(token, JWTSECRETKEY, (err, decoded) => {
        if (err) {
            req.session.destroy(err => {
                if (err) {
                    throw err;
                    return data;
                }
            })
            return data;


        } else {
            data = decoded;

        }
    });
    return data
}
module.exports.formatData=(data)=>{
    if(data){
        return data;
    }
    else{
        console.log("data not found");
        return null;    

    }
}
module.exports.createRabbitConnection = async () => {
    try {
        const connection = await amqlib.connect(RABBITMQ_URL,{
            reconnect: true, 
            heartbeat: 10
        });
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, "direct", {
            durable: true
        })
          await channel.assertQueue(REPLY_QUEUE, {
              exclusive: true
          });
        return channel
    } catch (error) {
        throw error;
    }
};



module.exports.PushlishMSGNoReply = async (channel, msg, service) => {
    msg = JSON.stringify(msg);
    channel.publish(EXCHANGE_NAME, service, Buffer.from(msg), {});
};
module.exports.PushlishMSGWithReply = (channel, msg, service) => {
    return new Promise(async (resolve, reject) => {
        const correlationId = uuidv4();
        msg = JSON.stringify(msg);
        const consumerTag = `consumer-${correlationId}`;
        channel.consume(
            REPLY_QUEUE,
            (msg) => {
                console.log("first:",correlationId)
                console.log("first2:",msg.properties.correlationId)

                if (msg.properties.correlationId === correlationId) {
                    resolve(msg.content.toString());
                    channel.cancel(consumerTag);
                }
            }, {
                noAck:true,
                consumerTag: consumerTag
            }
        );
        await channel.publish(EXCHANGE_NAME, service, Buffer.from(msg), {
            correlationId: correlationId,
            replyTo: REPLY_QUEUE,
        });
    })

};

module.exports.SubcribeMSG = async (channel, service) => {
    const q = await channel.assertQueue("", {
        exclusive: true
    });
    channel.bindQueue(q.queue, EXCHANGE_NAME, VIDEO_SERVICE)
    channel.consume(q.queue, (msg) => {
        if (msg.content) {
            if (msg.properties.replyTo) {
                console.log("the msg is :", msg.content.toString())
                 const response = JSON.stringify({
                     result: "Processed your message"
                 });
                channel.sendToQueue(msg.properties.replyTo, Buffer.from(response), {
                    correlationId: msg.properties.correlationId,
                });
                return;
            }
            service.SubcribeEvent(msg.content.toString())
        }
    }, {
        noAck: true
    });

};