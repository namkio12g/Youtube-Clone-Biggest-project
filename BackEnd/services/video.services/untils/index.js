const axios = require("axios");
const {RABBITMQ_URL,EXCHANGE_NAME,VIDEO_SERVICE,REPLY_QUEUE,JWTSECRETKEY}=require("../config")
const amqlib =require("amqplib");
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require('uuid'); 
const CustomError = require("./customError");
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
        throw new CustomError("data not found",404)

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
                if (msg.properties.correlationId === correlationId) {
                    resolve(msg.content.toString());
                    channel.cancel(consumerTag);
                }
                else{
                    channel.cancel(consumerTag);
                    reject("no data");
                }
            }, {
                noAck:true,
                consumerTag: consumerTag
            }
        );
        try {
            
            await channel.publish(EXCHANGE_NAME, service, Buffer.from(msg), {
                correlationId: correlationId,
                replyTo: REPLY_QUEUE,
            });
        } catch (error) {
            channel.cancel(consumerTag);
            reject(error);
        }
    })

};

module.exports.SubscribeMSG = async (channel, service) => {
    const q = await channel.assertQueue("", {
        exclusive: true,
        durable:false
    });
    channel.bindQueue(q.queue, EXCHANGE_NAME, VIDEO_SERVICE)
    channel.consume(q.queue, async(msg) => {
        if (msg.content) {
            if (msg.properties.replyTo) {
                var response = await service.SubscribeEvent(msg.content.toString());
                response = JSON.stringify(response)
                channel.sendToQueue(msg.properties.replyTo, Buffer.from(response), {
                    correlationId: msg.properties.correlationId,
                });

                return;
            }
            service.SubscribeEvent(msg.content.toString())
        }
    }, {
        noAck: true
    });

};