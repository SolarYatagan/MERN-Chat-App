import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const UserList = ({ user, handle }) => {

  return (
    <Box
    onClick={handle}
    cursor="pointer"
    bg="#ffba08"
    _hover={{background: 'green'}}
    w='100%'
    display='flex'
    alignItems='center'
    color='black'
    border='2px solid black'
    borderRadius='lg'
    mt='0.7rem'
    p='0.3rem'
    >
    <Avatar 
    size='sm'
    cursor='pointer'
    name={user.name}
    src={user.picture}
    />
    <Box
    ml='0.7rem'
    >
        <Text>{user.name}</Text>
        <Text fontSize='xs'><b>Email:</b> {user.email}</Text>
    </Box>
    </Box>
  )
}

export default UserList