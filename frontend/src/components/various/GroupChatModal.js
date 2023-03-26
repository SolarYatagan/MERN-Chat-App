import React, { useState } from "react";
import axios from "axios";
import UserList from "../UserList";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  Input,
  FormLabel,
  Box,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import UserSelected from "./UserSelected";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [chatName, setChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    if (!query) {
      setResults([]);
    }
    setSearch(query);
    if (!query) {
      return;
    }
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
      setResults(data);
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

  const handleClicked = (clicked) => {
    if (selectedUsers.includes(clicked)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, clicked]);
  };

  const handleSubmit = async () => {
    if (!chatName || !selectedUsers) {
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
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: chatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );
      setChats([data, ...chats]); //add data to the top of our chats
      onClose();
    } catch (error) {
      toast({
        title: "Failed to create group chat",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  const handleDelete = (toDelete) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== toDelete._id));
  };

  return (
    <>
      <div onClick={onOpen}>{children}</div>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="38px" display="flex" justifyContent="center">
            Create group chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            mb="2"
          >
            <FormControl>
              <FormLabel>Type Chat Name:</FormLabel>
              <Input
                placeholder="Chat Name..."
                mb="3"
                border="2px solid"
                borderColor="blackAlpha.600"
                onChange={(e) => setChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Add Users:</FormLabel>
              <Input
                placeholder="Add users by user's name"
                border="2px solid"
                borderColor="blackAlpha.600"
                onChange={(e) =>
                  setTimeout(() => handleSearch(e.target.value), 500)
                }
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap" mt={3}>
              {selectedUsers.map((user) => (
                <UserSelected
                  key={user._id}
                  user={user}
                  handle={() => handleDelete(user)}
                />
              ))}
            </Box>
            {loading ? (
              <div>loading...</div>
            ) : (
              results
                ?.slice(0, 4)
                .map((user) => (
                  <UserList
                    key={user._id}
                    user={user}
                    handle={() => handleClicked(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter display="flex" justifyContent="space-between">
            <Button
              colorScheme="blue"
              onClick={() => {
                setResults([]);
                onClose();
              }}
            >
              Close
            </Button>
            <Button colorScheme="green" onClick={() => handleSubmit()}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
