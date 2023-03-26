import { FormControl, FormLabel, VStack, Input, InputGroup, Button, InputRightElement} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react' 
import axios from 'axios'
import {Form, useNavigate} from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const toast = useToast();
  const history = useNavigate();
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false);


  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true);
    if(!email || !password){
    toast({
      title: 'Please fill all the fields.',
      status: 'warning',
      duration: 4000,
      isClosable: true,
      position: "top"
    })
    setLoading(false);
    return;
  }

  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const {data} = await axios.post("/api/user/login", 
    {email, password}, 
    config
    )
    toast({
      title: 'Successful login',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: "bottom"
    });

    localStorage.setItem('userInfo', JSON.stringify(data))
    
    setLoading(false)
    history('/chats')
    console.log(data)
  } catch (error) {
    toast({
      title: 'Error occured.',
      description: error.response.data,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: "top"
    });
  }
    setLoading(false)
  }
 
  return (
    <div>
      <VStack
        spacing={5}
        align="stretch"
        color='black'
      >
      <form onSubmit={submitHandler}>
       <FormControl id='email' isRequired>
          <FormLabel>Email:</FormLabel>
          <Input
            placeholder='Enter Your Email'
            onChange={(e)=>setEmail(e.target.value)}
          />
       </FormControl>
       <FormControl id='password' isRequired>
          <FormLabel>Password:</FormLabel>
          <InputGroup>
          <Input
            type={show? 'text' : 'password'}
            placeholder='Enter Your Password'
            onChange={(e)=>setPassword(e.target.value)}
            pr='5rem'
          />
          <InputRightElement pr='2rem'>
            <Button h='1.5rem' bg='blue.200' size='sm' padding='1rem 2rem 1rem 2rem' mr='0.5rem' onClick={()=>setShow(prev=>!prev)}>
                {show? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
          </InputGroup>
         
       </FormControl>

       <Button
        colorScheme='blue'
        marginTop='2rem'
        onClick={submitHandler}
        isLoading={loading}
        type='submit'
       >
        Login
       </Button>
      </form>  
      </VStack>
    </div>
    
  )
}

export default Login