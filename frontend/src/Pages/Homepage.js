import React, { useEffect } from 'react'
import {Container, Box, Text} from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'
import MessengerIcon from '../assets/messenger.png'
import { useNavigate} from 'react-router-dom'


const Homepage = () => {

  const history = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'))
    if(user){
      history('/chats')
    }
   
  }, [history])
  

  return (
    <Container  maxW='70%'
    centerContent  fontFamily='Merriweather Sans, sans-serif'>
    <Box 
    padding='6' color='black'
    display='flex' 
    justifyContent='space-between'
    w="70%"
    borderRadius="15"
    marginTop='7rem'
    bg='white'
    border="5px solid blue"
    fontSize='28'
    >
    <img src={MessengerIcon} alt="messenger" width='50px' height='50px' />
    <Text fontWeight="bold" display='flex' flex='2' justifyContent='center'>Messenger</Text>
    </Box>
    <Box
      padding='6' color='black'
      display='flex' 
      justifyContent="center"
      w="70%"
      marginTop={2}
      borderRadius="15"
      border="2px solid black"
      bg='white'>
    <Tabs variant='line' color='black' w='100%'>
        <TabList mb='1rem'>
          <Tab w="50%">Login</Tab>
          <Tab w="50%">Sign Up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
          <Login />
          </TabPanel>
          <TabPanel>
          <Signup />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
</Container>
  )
}

export default Homepage