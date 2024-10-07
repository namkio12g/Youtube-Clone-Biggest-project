const mongoose =require("mongoose")
const Schema=mongoose.Schema
const userSchema=new Schema({
    email:{
        type: String,
        require:true
    },
    password:String,
    title:{type:String,unique:true},
    profilePicture: {
        type: String,
        default: ""
    },
    role: {
        type: Number,
        default: ""
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    delete: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            default: "active"
        }
})
module.exports=mongoose.model("user",userSchema,"users")