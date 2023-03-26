import { Box } from '@chakra-ui/react'
import {CloseIcon} from '@chakra-ui/icons'
import React from 'react'

const UserSelected = ({user, handle}) => {
  return (
    <Box
    display='flex'
    justifyContent='center'
    alignItems='center'
     px={2}
     py={1}
     borderRadius='lg'
     mx={1}
     mb={2}
     variant='solid'
     fontSize='12'
     fontFamily='Merriweather Sans, sans-serif'
     fontWeight='bold'
     bg='#219ebc'
     color='white'
     cursor='pointer'
     onClick={handle}
    >
    {user.name}
    <CloseIcon ml={2} color='black'/>
    </Box>
  )
}

export default UserSelected