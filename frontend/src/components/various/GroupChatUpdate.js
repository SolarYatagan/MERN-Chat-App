import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import UserSelected from "./UserSelected";
import axios from "axios";
import UserList from "../UserList";

const GroupChatUpdate = ({fetchMessages}) => {
  const { reload, setReload, user, setSelectedChat, selectedChat } = ChatState();

  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAdd = async (userToAdd) => {
    if(selectedChat.users.find((user) => user._id === userToAdd._id
    )){
      toast({
        title: "User already in the group",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return
    }
    if(selectedChat.groupAdmin._id !== user._id){
      toast({
        title: "Only admins can add someone",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return
    }

    try {
      setLoading(true) 
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.put('/api/chat/add', {
        chatId: selectedChat._id,
        userId: userToAdd._id
      }, config)
      setSelectedChat(data)
      setReload(!reload)
      setLoading(false)
    } catch (error) {
      toast({
        title: "Error occured",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return
    }
  }

  const handleDelete = async (toDelete) => {
    if(selectedChat.groupAdmin._id !== user._id && user._id !== toDelete._id){
      toast({
        title: "Only admins can remove someone from chat",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return
    }
    
    try {
      setLoading(true) 
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.put('/api/chat/remove', {
        chatId: selectedChat._id,
        userId: toDelete._id
      }, config)

      user._id === toDelete._id ? setSelectedChat() : setSelectedChat(data)
      setReload(!reload)
      fetchMessages()
      setLoading(false)
    } catch (error) {
      toast({
        title: "Error occured",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return
    }

  };

  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        title: "Fill all the fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setReload(!reload);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Failed to rename group chat",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
      return;
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    if(!query){
      setSearchResult([])
    }

    if (!query) {
      return;
    }
    setSearch(query);
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/user/users?search=${search}`,
        config
      );
      //console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed with Search",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };


  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<EditIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="32px" textAlign="center">
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" mt={3}>
              {selectedChat.users.map((user) => (
                <UserSelected
                  key={user._id}
                  user={user}
                  handle={() => handleDelete(user)}
                />
              ))}
            </Box>
            <FormControl display="flex" mt={3}>
              <Input
                placeholder="ChatName"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                borderColor="black"
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                my={2}
                onChange={(e) => setTimeout(() => handleSearch(e.target.value), 500)}
                borderColor="black"
              />
            </FormControl>
                {loading? (<Spinner size='lg'/>)
                : (
                  searchResult?.slice(0, 4).map((user) => (
                  <UserList
                    key={user._id}
                    user={user}
                    handle={() => handleAdd(user)}
                  />
                ))
                )
                }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleDelete(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatUpdate;
