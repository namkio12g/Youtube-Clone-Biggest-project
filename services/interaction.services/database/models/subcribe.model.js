const mongoose = require("mongoose")
const Schema = mongoose.Schema
const subcribeSchema = new Schema({
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    subcriberId: mongoose.Schema.Types.ObjectId,
    createdAt: {
        type: date,
        default: date.now
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
module.exports = mongoose.model("subcribe", subcribeSchema, "subcribes")