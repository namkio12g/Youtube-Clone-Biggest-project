const mongoose = require("mongoose")
const {DATABASE_URL} =require("../config")
module.exports.databaseConnection=async()=>{
    try {
        console.log(DATABASE_URL)
        await mongoose.connect(DATABASE_URL)
        console.log("database connection success!")
    } catch (error) {
        console.log(error)
    }
}