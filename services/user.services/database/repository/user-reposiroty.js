const mongoose = require("mongoose")
const userModel=require('../models/user.model.js');
class userRepository{
    async createChannel({email,password}){
        try {
            const newChannel=new channelModel({
                email:email,
                password:password,
                title:email,
            })
            const channelResult = await newChannel.save();
            return channelResult;
        } catch (error) {
            console.log(error);
            return null;
            
        }
    }
    async getChannels(){
        try {
            const channels=await channelModel.find({});
            return channels
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    
}