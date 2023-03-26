const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = asyncHandler(async(req, res) => {
    const { userId } = req.body;
    let chatData;
    if(!userId){
        console.log('UserId parameter not sent with request')
        return res.sendStatus(400) //short form of res.status(400).send('Bad Request')
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            //if you log a user out, req.user will no longer be available.
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}}
        ]
        //populate array except password
    }).populate("users", "-password")
    .populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: "name picture email"
    })
    if(isChat.length > 0){ //if chat is already exists
        res.send(isChat[0])
    }
    else{
        chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id, userId]
        }
    }

    try {
        const createdChat = await Chat.create(chatData)

        const fullChat = await Chat.findOne({_id: createdChat._id})
        .populate("users", "-password")
        res.status(200).send(fullChat)
    } catch (error) {
        res.status(400)
        return new Error(error.message)
    }
})

const fetchChats = asyncHandler(async (req, res) => {
    try{
        Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updatedAt: -1})     //-1 goes for descending order, it will sort from early to latest.
        .then(async (results)=>{
            results = await User.populate(results, {
                path: 'latestMessage.sender',
                select: "name picture email"
            })
            res.status(200).send(results)
        
        })
    }catch(error){
        res.status(400)
        return new Error(error.message)
    }
})


const createGroup = asyncHandler(async (req, res) => {
    if(!req.body.users || !req.body.name){  //if there is no name of groupchat and no participants of it, send a error message.
        return res.status(400).send({message: "Please fill all the fields"})
    }

    let users = JSON.parse(req.body.users);

    if(users.length < 2){
        return res.status(400).send("More than 2 users are required for group chat")
    }
    
    users.push(req.user)
    
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })

        const fillGroupChat = await Chat.findOne({_id: groupChat._id})    
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        res.status(200).send(fillGroupChat)

    } catch (error) {
        res.status(400)
        return new Error(error.message)
        
    }
});

const renameGroup = asyncHandler(async(req, res) => {
    const {chatId, chatName} = req.body

    if(!chatName){  //if there is no name of groupchat and no participants of it, send a error message.
        return res.status(400).send({message: "Please write the name of group"})
    }
    const findAndUpdate = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new: true,
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!findAndUpdate){
        res.status(404)
        return new Error("Chat not found")
    }
    else{
        res.status(200).send(findAndUpdate)
    }
  
});


const addToGroup = asyncHandler( async (req, res) => {
    const {chatId, userId} = req.body;
    const findAndAdd = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: {users: userId},
          
        },
        { 
             new: true
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    if(!findAndAdd){
        res.status(404)
        return new Error("Chat not found")
    }
    else{
        res.status(200).send(findAndAdd)
    }
})


const removeFromGroup = asyncHandler( async(req, res) => {
    const {chatId, userId} = req.body;
    const findAndRemove = await Chat.findByIdAndUpdate( 
        //Chat.findAndRemove removes a document from the collection.
        chatId,
        {
            $pull: {users: userId} //removes an element from an array. 
          
        },
        { 
             new: true
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    if(!findAndRemove){
        res.status(404)
        return new Error("Chat not found")
    }
    else{
        res.status(200).send(findAndRemove)
    }
})
module.exports = {accessChat, fetchChats, createGroup, renameGroup, addToGroup, removeFromGroup};