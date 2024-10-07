import axios from "axios";
import amqplib from"amqplib";
import { RABBITMQ_URL,EXCHANGE_NAME,VIDEO_SERVICE } from "../config";
module.exports.formatData=(data)=>{
    if(data){
        return {data};
    }
    else{
        throw new Error("Data not found!")
    }
}
module.exports.createChannel= async()=>{
    try {
        const connection=await amqplib.connect(RABBITMQ_URL);
        const channel=await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME,"direct",{
            durable:true
        })
        return channel
        
    } catch (error) {
       throw error
    }
}
module.exports.PushlishPlayload=async(channel,service_name,msg)=>{
    const payload={
        data:data,
        event:event_data
    }
    await channel.pulish(EXCHANGE_NAME,service_name,Buffer.from(msg))
}
module.exports.SubcribersPlayload=async(channel,service)=>{
   const queue = await channel.assertQueue("",{exclusive:true})
   await channel.bindQueue(queue,EXCHANGE_NAME,VIDEO_SERVICE)
   channel.comsume(queue,(msg)=>{
    if(msg.content){

    }
    else{

    }
   },{noAck:true})
}