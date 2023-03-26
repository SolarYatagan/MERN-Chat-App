import React, { useState } from 'react'
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react' 
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profileImage, setProfileImage] = useState()
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const toast = useToast();


  const history = useNavigate()

  const postImage = (picture) => {
    setLoading(true);
    if(picture === undefined){
      toast({
        title: 'Please select an image.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      return;
    }
    //console.log(picture);
    if(picture.type === "image/jpeg" || picture.type === "image/png"){
      const data = new FormData();
      data.append("file", picture);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dnnrsx00x");
      fetch(process.env.REACT_APP_UPLOAD_URL, {  //https://api.cloudinary.com/v1_1/<CLOUD_NAME>/image/upload
        method: 'post',
        body: data
      })
      .then((res)=>res.json())
      .then((data)=>{
        setProfileImage(data.url.toString());
        setLoading(false);
      })
      .catch((error)=>{
        console.log(error)
        setLoading(false)
      })
    }
    else{
      toast({
        title: 'Please select an image.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: "top"
      })
      setLoading(false);
      return;
    }
  
  
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true);
    if(!name || !email || !password || !confirmPassword){
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
  if (confirmPassword !== password){
    toast({
      title: 'Password do not match.',
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
    const {data} = await axios.post("/api/user/register", 
    {name, email, password, profileImage}, 
    config
    )
    toast({
      title: 'Successful registration',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: "bottom"
    });

    localStorage.setItem('userInfo', JSON.stringify(data))
    
    setLoading(false)
    history('/chats')
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
  };
 
  return (
    <div>
      <VStack
        spacing={5}
        align="stretch"
        color='black'
      >
      <form onSubmit={submitHandler}>
       <FormControl id='first-name' isRequired>
          <FormLabel>Name:</FormLabel>
          <Input
          
            placeholder='Enter Your Name'
            onChange={(e)=>setName(e.target.value)}
          />
       </FormControl>
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

       <FormControl id='password' isRequired>
          <FormLabel>Confirm Password:</FormLabel>
          <InputGroup>
          <Input
            type={show? 'text' : 'password'}
            placeholder='Confirm Password'
            onChange={(e)=>setConfirmPassword(e.target.value)}
            pr='5rem'
          />
          <InputRightElement pr='2rem'>
            <Button h='1.5rem' bg='blue.200' size='sm' padding='1rem 2rem 1rem 2rem' mr='0.5rem' onClick={()=>setShow(prev=>!prev)}>
                {show? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
          </InputGroup>
       </FormControl>

       <FormControl id='profileImage'>
          <FormLabel>Upload your image</FormLabel>
          <Input
            type='file'
            p='1'
            accept='image/*'
            onChange={(e)=>postImage(e.target.files[0])}
          />
       </FormControl>

       <Button
        colorScheme='orange'
        marginTop='2rem'
        onClick={submitHandler}
        isLoading={loading}
        type='submit'
       >
        Sign Up
       </Button>
       </form>
      </VStack>
    </div>
  );
}

export default Signup