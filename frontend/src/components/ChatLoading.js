import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const ChatLoading = () => {
  return (
    <Stack mt='1rem'>
    <Skeleton height='55px'/>
    <Skeleton height='55px'/>
    <Skeleton height='55px'/>
    <Skeleton height='55px'/>
    <Skeleton height='55px'/>
    <Skeleton height='55px'/>
    <Skeleton height='55px'/>
    <Skeleton height='55px'/>
    <Skeleton height='55px'/>
    <Skeleton height='55px'/>
    <Skeleton height='55px'/>
    <Skeleton height='55px'/>
    </Stack>
  )
}

export default ChatLoading