import React, { useEffect, useState } from 'react'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { ChatState } from '../../Context/ChatProvider'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from '../ChatLoading'
import {getSender} from '../../config/chatLogic.js'
import GroupChatModal from './GroupChatModal'

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState()
  const {user, selectedChat, setSelectedChat, chats, setChats, reload, setReload} = ChatState()
  
  const toast = useToast()

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get('/api/chat', config)
      setChats(data)
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  useEffect(() => { 
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats()
  }, [reload])
  return (
    <Box
    display={{base: selectedChat? "none" : "flex", md: "flex"}}
    flexDir="column"
    alignItems="center"
    p='5'
    mr='5'
    bg='white'
    width={{base: '100%', md: '42%'}}
    borderRadius='lg'
    >
      <Box
        pb='3'
        px='3'
        fontSize={{base: '28px', md: '30px'}}
        display='flex'
        width='100%'
        justifyContent='space-between'
        alignItems='center'
      >
      <Text>
        My Chats
      </Text>
      
        <GroupChatModal>
        <Button
        px={{base: '2', md: '2'}}
        fontSize={{base: '15px', md: '15px', lg: '15px'}}
        rightIcon={<AddIcon />}
        >
        Create New Group Chat 
        </Button>
        </GroupChatModal>
      </Box>
      <Box
      display='flex'
      flexDir='column'
      p='3'
      bg='#94d2bd'
      w='100%'
      borderRadius='lg'
      overflowY='hidden'
      >
      {
        chats ? (
          <Stack overflowY='scroll'>
            {chats.map((chat) => (
            <Box
            onClick={() => setSelectedChat(chat)}
            cursor='pointer'
            bg={selectedChat === chat? '#38B2AC' : '#E8E8E8'}
            color={selectedChat === chat ? "white" : "black"}
            px='3'
            py='3'
            borderRadius='lg'
            key={chat._id}
            >
            {!chat.isGroupChat? 
            (
          
              getSender(loggedUser, chat.users)
            ) : (chat.chatName)}
            </Box>
        ))}
          </Stack>
        ) : (
          <ChatLoading />
        )
      }
      </Box>
    </Box>
  )
}

export default MyChats