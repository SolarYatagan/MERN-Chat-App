import { Box, Divider, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import React, { useEffect, useMemo, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import {ArrowBackIcon} from '@chakra-ui/icons'
import Profile from './various/Profile'
import { getSender, getChattingUser } from '../config/chatLogic'
import GroupChatUpdate from './various/GroupChatUpdate'
import axios from 'axios'
import animationLoading from '../assets/typing.json'
import './styles.css'
import Lottie from 'react-lottie'
import ScrollChat from './various/ScrollChat'
import io from 'socket.io-client'


const port = "http://localhost:5000"; 
let socket, selectedChatCompare;


const ChatPlace = () => {
  const {reload, setReload, user, selectedChat, setSelectedChat, notifications, setNotifications} = ChatState()
  
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [state, setState] = useState([])

  const toast = useToast()


  useEffect(() => {
    socket = io(port)
    socket.emit('setup', user)
    socket.on('connected', () => setSocketConnected(true))
    socket.on('typing', () => setIsTyping(true))
    socket.on('stop_typing', () => setIsTyping(false))
  }, [])


  const sendMessage = async (e) => {
    if(e.key === 'Enter' && newMessage){
      socket.emit('stop_typing', selectedChat._id)
      try {
        setNewMessage("")
        const config = {
          headers: {
            "Content-Type" : "application/json",
            Authorization: `Bearer ${user.token}`
          }
        }
        const {data} = await axios.post('/api/message', {
          content: newMessage,
          chatId: selectedChat._id
        }, config)
        socket.emit('send_message', data)
        setMessages([...messages, data])
        
    
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Fail to sendig a message",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }
  
  useEffect(() => {
    fetchMessages() 
    selectedChatCompare = selectedChat; //???
  }, [selectedChat])

  useEffect(() => {
    socket.on('message_received', (receivedMessage) => {
      //for notifications
      if(!selectedChatCompare || selectedChatCompare._id !== receivedMessage.chat._id){
         if(!notifications.includes(receivedMessage)){
          sendNotifications(receivedMessage)
          setReload(!reload)
        }
      }
      else{
        setMessages([...messages, receivedMessage])
      }
    })

  }, [])
  

  const sendNotifications = async (receivedMessage) => {
    try {
      const config = {
        headers: {
          "Content-type" : "application/json",
          Authorization : `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.post('/api/notifications', {
        chatId: receivedMessage.chat._id,
        length: notifications.length,
        content: receivedMessage.content,
        senderName: receivedMessage.sender.name
      }, config)
      setNotifications([...notifications, data])
      setState(data)
      } catch (error) {
      toast({
        title: "Error Occured!",
        description: "",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [state]);

 const fetchNotifications = async () => {

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get('/api/notifications', config)
      setNotifications([...data])
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  } 
  



  const fetchMessages = async () => {
    if(!selectedChat) return
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      setLoading(true)
      const {data} = await axios.get(`/api/message/${selectedChat._id}`, config)
      setMessages(data)
      setLoading(false)

      socket.emit('join_chat', selectedChat._id)
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Fail to load the messages",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  const typeMessage = (e) => {
    setNewMessage(e.target.value)
    if(!socketConnected) return;

    if(!typing){
      setTyping(true)
      socket.emit('typing', selectedChat._id)
    }
    let stopTyping = new Date().getTime()
    setTimeout(() => {
      let timeNow = new Date().getTime()
      let timeDifference = timeNow - stopTyping;
      if(timeDifference >= 2000 && typing){
        socket.emit('stop_typing', selectedChat._id)
        setTyping(false)

      }
    }, 2000);
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationLoading,
    renderSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    }
  }

  return (
    <>
        {
            selectedChat? (
                <>
                 <Text
                fontSize={{md: '32px', base: '28' }}
                fontFamily='Merriweather Sans, sans-serif'
                pb='1'
                px='3'
                display='flex'
                width='100%'
                justifyContent={{base: 'space-between'}}
                alignItems='center'
                 >
                 <IconButton 
                    display={{base: 'flex', md: "none"}}
                    icon={<ArrowBackIcon />}
                    onClick={()=>setSelectedChat()}
                 />
                    {
                      selectedChat.isGroupChat ? (
                        <>
                        {selectedChat.chatName.toUpperCase()}
                        <GroupChatUpdate fetchMessages={fetchMessages}/>
                        </>
                      ) : (
                        <>
                        
                          {getSender(user, selectedChat.users)}
                          <Profile user={getChattingUser(user, selectedChat.users)}>
                          </Profile>
                        </>
                      )
                    }
                 </Text> 

                 <Divider border='5px solid' borderColor='green.300' />
                  <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent='flex-end'
                    p={3}
                    mt='2'
                    bg='gray.200'
                    width='100%'
                    height='100%'
                    borderRadius='lg'
                    overflowY='hidden' 
                  >
                  {loading ? (
                    <Spinner 
                      size='xl'
                      w='20'
                      h='20'
                      alignSelf='center'
                      margin='auto'
                    />
                  ):(
                    <div className='messages_field'>
                       <ScrollChat messages={messages}/> 
                    </div>
                  )
                  }
                  <FormControl onKeyDown={sendMessage} isRequired mt='4'>
                    {isTyping? <div>
                      <Lottie 
                      width={50}
                      style={{marginLeft: 0, marginBottom: 10}}
                      options={defaultOptions}
                      />
                    </div> : <></>}
                    <Input   
                      bg='gray.300'
                      borderColor='blackAlpha.600'
                      placeholder='Type a message...'
                      onChange={typeMessage}
                      value={newMessage}
                    />
                  </FormControl>
                  </Box>
                </>
                
            ) : (
               <Box 
               display='flex' 
               alignItems='center' 
               justifyContent='center'
               h='100%'
               >
                <Text fontSize='32px' fontFamily='Merriweather Sans, sans-serif' >
                    Click on chat to starting.
                </Text>
               </Box> 
            )
        }
    </>
  )
}

export default ChatPlace