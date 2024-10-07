const express=require("express")
const {userRepository} = require("../database")
class userService{
    constructor(){
        this.repository=new userRepository()
    }
    async createNewChannel({email,password}){
        return this.repository.createNewChannel({email,password})
    }
    async getChannels(){
        return this.repository.getChannels()
    }

    async SubcribeEvent(payload){
        const {event,data}=payload;

        switch(event){
          
        }
    }
}
module.exports=channelService;