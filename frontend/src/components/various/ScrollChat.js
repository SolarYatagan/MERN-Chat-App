import { Avatar, Tooltip } from '@chakra-ui/react'
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameUser, marginSender } from '../../config/chatLogic'
import { ChatState } from '../../Context/ChatProvider'

const ScrollChat = ({messages}) => {

  const {user} = ChatState()
  return (
    <ScrollableFeed>
    {messages && messages.map((mess, i) => (
        <div style={{display: "flex"}} key={mess._id}>
        {(isSameSender(messages, mess, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={mess.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={mess.sender.name}
                  src={mess.sender.picture}
                />
              </Tooltip>
            )}

            <span style={{backgroundColor: `${mess.sender._id === user._id ? "#BEE3F8" : "#B9F5D0" }`,
            borderRadius: "20px",
            padding: "5px 15px",
            maxWidth: "75%",
            marginLeft: marginSender(messages, mess, i, user._id),
            marginTop: isSameUser(messages, mess, i, user._id) ? 3:10, 
            }}>
            {mess.content}
            </span>
        </div>
    ))}
    </ScrollableFeed>
  )
}

export default ScrollChat