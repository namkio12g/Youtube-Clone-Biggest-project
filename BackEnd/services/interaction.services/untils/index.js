const axios = require("axios");
const amqlib = require("amqplib")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require('uuid'); 
const {
    RABBITMQ_URL,
    EXCHANGE_NAME,
    INTERACTION_SERVICE,
    REPLY_QUEUE
} = require("../config");
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
module.exports.formatData = (data) => {
    if (data) {
        return {
            data
        };
    } else {
        throw new Error("Data not found!")
    }
}
module.exports.createRabbitConnection = async () => {
    try {
        const connection = await amqlib.connect(RABBITMQ_URL, {
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
    console.log("send", msg);
};
module.exports.PushlishMSGWithReply = (channel, msg, service) => {
    return new Promise(async (resolve, reject) => {
        const correlationId = uuidv4();
        msg = JSON.stringify(msg);
        const consumerTag = `consumer-${correlationId}`;

        channel.consume(
            REPLY_QUEUE,
            (msg) => {
                console.log("first:", correlationId)
                console.log("first2:", msg.properties.correlationId)

                if (msg.properties.correlationId === correlationId) {
                    resolve(msg.content.toString());
                    channel.cancel(consumerTag);
                }
            
            }, {
                noAck: true,
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

module.exports.SubcribeMSG = async (channel, service) => {
    const q = await channel.assertQueue("", {
        exclusive: true
    });
    channel.bindQueue(q.queue, EXCHANGE_NAME, INTERACTION_SERVICE)
    channel.consume(q.queue, async (msg) => {
        if (msg.content) {
            if (msg.properties.replyTo) {
                var response = await service.SubcribeEvent(msg.content.toString());
                response = JSON.stringify(response)
                channel.sendToQueue(msg.properties.replyTo, Buffer.from(response), {
                    correlationId: msg.properties.correlationId,
                });

                return;
            }
            console.log("im here");
            service.SubcribeEvent(msg.content.toString())

        }
    }, {
        noAck: true
    });

};