const express=require("express")
const {videoRepository} = require("../database")
class channelService{
    constructor(){
        this.repository=new videoRepository()
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