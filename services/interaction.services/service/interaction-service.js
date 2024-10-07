const express=require("express")
const {commentRepository} = require("../database")
class interactionService{
    constructor(){
        this.commentRepository = new commentRepository()
    }
    async createNewChannel({email,password}){
        return this.commentRepository.createNewChannel({
            email,
            password
        })
    }
    async getChannels(){
        return this.commentRepository.getChannels()
    }

    async SubcribeEvent(payload){
        const {event,data}=payload;

        switch(event){
          
        }
    }
}
module.exports=channelService;