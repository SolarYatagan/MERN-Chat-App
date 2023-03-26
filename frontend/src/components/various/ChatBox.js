import { Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import ChatPlace from '../ChatPlace'

const ChatBox = () => {

  const{selectedChat, reload, setReload} = ChatState()
  return (
    <Box 
    display={{base: selectedChat? "flex" : "none", md: "flex"}}
    alignItems='center'
    flexDirection='column'
    p='3'
    bg='white'
    width={{base: '100%', md: '70%'}}
    borderRadius='lg'
    >
      <ChatPlace/>
    </Box>
  )
}

export default ChatBox