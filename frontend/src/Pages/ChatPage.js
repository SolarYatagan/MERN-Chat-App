import React, { useState } from 'react'
import {Box} from '@chakra-ui/react'
import { ChatState } from '../Context/ChatProvider'
import { MyChats, ChatBox, SideDrawer } from '../components/various'

const ChatPage = () => {
  const {user} = ChatState();
  return (
    <div style={{width: "100%"}}>
      {user && <SideDrawer />}
      <Box 
      display='flex'
      flexDirection='row'
      justifyContent='space-between'
      w='100%'
      h='80vh'
      p='5'
      >
        {user && <MyChats/>}
        {user && <ChatBox/>}
      </Box>
    </div>
  )
}

export default ChatPage