const mongoose =require("mongoose");
const Schema = mongoose.Schema
const categorySchema=new Schema({
    title:String,
    description:String,
    delete:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        default:"active"
    }
})
module.exports=mongoose.model("category",categorySchema,"categories")