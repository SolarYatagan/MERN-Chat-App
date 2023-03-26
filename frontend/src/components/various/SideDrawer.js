import React, { useState } from 'react'
import {Avatar, Box, Button,  Image,  Input,  Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast} from '@chakra-ui/react'
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import  SearchIcon  from '../../assets/loupe.png'
import { ChatState } from '../../Context/ChatProvider'
import Profile from './Profile'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import ChatLoading from '../ChatLoading'
import UserList from '../UserList'
import {getSender} from '../../config/chatLogic'
import NotificationBadge, { Effect } from 'react-notification-badge'


const SideDrawer = () => {
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState()
  
  const navigate = useNavigate()
  const {user, setSelectedChat, chats, setChats, notifications, setNotifications} = ChatState()

  const btnRef = React.useRef()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const userLogout = () => {
    localStorage.removeItem('userInfo')
    navigate('/')
  }

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user/users?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
      setSearch()
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true)
      const config = {
        headers: {
          "Content-type" : "application/json",
          Authorization : `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/chat', {userId}, config)
      console.log(chats)
      if(!chats.find((el) => el._id === data._id)){
        setChats([data, ...chats])
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose()
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

  const handleRemove = async (notif) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.put('/api/notifications/remove', {
        chatId: notif.chat._id,
      }, config)      
      setNotifications('')
      return
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return
    }
  }

  return (
    <>
    <Box
      display='flex'
      bg='wheat'
      width='100%'
      justifyContent='space-between'
      alignItems='center'
      border='1px solid black'
      p='15px 10px 15px 5px'
    >
      <Tooltip label="Search User" placement='bottom' hasArrow>
        <Button variant='solid'
        ml='10px'
        paddingInline='5'
        _hover={{ bg: 'coral' }} 
        onClick={onOpen}
         borderRight='2px solid black'  borderLeftRadius='0' borderRadius='0' outline='none'>
          <Image src={SearchIcon} width='25' height='25'/>
          <Text 
            display={{base: 'none', md: 'flex'}} 
            fontSize='18'
            ref={btnRef}
            px='3'
            >Search User
          </Text>
        </Button>
      </Tooltip>
      <Text fontSize='28px' fontFamily='monospace' fontWeight='bold' letterSpacing='2px'>Messenger</Text>
      <div>
        <Menu>
          <MenuButton marginRight={3}>
            <NotificationBadge 
              count={notifications.length}
              effect={Effect.SCALE}
            />
            <BellIcon fontSize='2xl' mr={{lg: '20px', md: '15px', sm: '10px'}}/>
          </MenuButton>
          <MenuList padding={3}>
          {!notifications.length && "No New Messages"} 
              {notifications && notifications.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    handleRemove(notif)
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${notif.senderName}`}
                </MenuItem>
              ))}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar size='sm' cursor='pointer' name={user.name} src={user.picture} mr='0.2rem'/>
          </MenuButton>
          <MenuList>
          <Profile user={user}>
            <MenuItem>My Profile</MenuItem>
          </Profile>
          <MenuDivider/>
            <MenuItem onClick={userLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>

    <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottom='3px solid black'>Search Users</DrawerHeader>

          <DrawerBody>
          <Box display='flex' mb='1rem'>
            <Input placeholder='Search user by name or email...' 
            mr='0.5rem'
            value={search}
            onChange={(e)=>setSearch(e.target.value)}  
            />
            <Button onClick={handleSearch} backgroundColor='#faf3dd'>Search</Button>
          </Box>
          {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserList
                  key={user._id}
                  user={user}
                  handle={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml='auto' display='flex' />}
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
          
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer