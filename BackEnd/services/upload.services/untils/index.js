const axios = require("axios");
const amqlib = require("amqplib")
const { RABBITMQ_URL,EXCHANGE_NAME,UPLOAD_SERVICE,REPLY_QUEUE } =require("../config");
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
    msg=JSON.stringify(msg);
    channel.publish(EXCHANGE_NAME, service, Buffer.from(msg), {});
};
module.exports.PushlishMSGWithReply = (channel, msg, service) => {
    return new Promise(async (resolve, reject) => {
        const correlationId = uuidv4();
        console.log(correlationId);

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

module.exports.SubcribeMSG = async (channel, service) => {
    const q = await channel.assertQueue("", {
        exclusive: true
    });
    channel.bindQueue(q.queue, EXCHANGE_NAME, UPLOAD_SERVICE)
    channel.consume(q.queue, async (msg) => {
        if (msg.content) {
            if (msg.properties.replyTo) {
                console.log("the msg is :", msg.content.toString())
                const response = await service.SubcribeEvent(msg.content.toString())
                console.log("I will send back:", response);
                channel.sendToQueue(msg.properties.replyTo, Buffer.from(response), {
                    correlationId: msg.properties.correlationId,
                });
                return;
            }
           
        }
    }, {
        noAck: true
    });

};