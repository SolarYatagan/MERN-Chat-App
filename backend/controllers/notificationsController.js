const asyncHandler = require('express-async-handler');
const Notification = require('../models/notificationModel');

const sendNotification = asyncHandler(async (req, res) => {
    const {chatId, length, content, senderName} = req.body;
    let notif = {
        chat: chatId,
        numberOfNotif: length,
        content: content,
        senderName: senderName,
    }
    try {
        let notification = await Notification.create(notif)
        notification = await notification.populate('chat')
        res.json(notification)
    } catch (error) {
        console.log(error)
        res.status(400)
        throw new Error(error.notification)
    }
})

const fetchNotification = asyncHandler(async (req, res) => {
    try {
        const notifications = await Notification.find({})
        .populate("chat")
        res.json(notifications)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const removeNotification = asyncHandler(async (req, res) => {
    const {chatId} = req.body;
    const findAndRemove = await Notification.find({chat: chatId}).remove()
    if(!findAndRemove){
        res.status(404)
        return new Error("Chat not found")
    }
    else{
        res.status(200).send(findAndRemove)
    }
})

module.exports = {sendNotification, fetchNotification, removeNotification}