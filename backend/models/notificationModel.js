const mongoose = require('mongoose')

const notificationModel = mongoose.Schema({
    senderName:{
        type: String,
        trim: true
    },
    numberOfNotif: {
        type: Number,
    },
    content:{
        type: String,
        trim: true
    },
    chat:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Chat"
    }
}, {
    timestamps: true,
   }
);


const Notification = mongoose.model("Notification", notificationModel)

module.exports = Notification;