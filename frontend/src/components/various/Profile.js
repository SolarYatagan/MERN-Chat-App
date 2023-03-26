import React from 'react'
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
    IconButton,
    Image,
    Text,
  } from '@chakra-ui/react'

import { EditIcon } from '@chakra-ui/icons'



const Profile = ({user, children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
     <>
       {
        children? <span onClick={onOpen}>{children}</span>
       :  
       <IconButton 
        display={{base: 'flex'}}
        icon={<EditIcon/>}
        onClick={onOpen}
        /> 
       }
       <Modal isOpen={isOpen} onClose={onClose} size='2xl' isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign='center' fontFamily='Work sans' fontSize='38'>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' justifyContent='center' paddingInlineStart='10px'>
          <Image src={user.picture} boxSize='250px' borderRadius='360px' border='2px solid black' mr='2rem'/>
         
          <Text
          textAlign='center'
          fontSize='24px'

          >
            Email: {user.email}
          </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            {children && <Button colorScheme='teal'>Edit Profile</Button>}
          </ModalFooter>
        </ModalContent>
      </Modal>
     </>
    )
}

export default Profile