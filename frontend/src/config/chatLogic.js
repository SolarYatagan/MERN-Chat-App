export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name
}
export const getChattingUser = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1]: users[0]
}

export const isSameSender = (messages, mess, i, userId) => {
    return(
        i<messages.length - 1 &&
        (messages[i+1].sender._id !== mess.sender._id || 
        messages[i+1].sender._id === undefined) && 
        messages[i].sender._id !== userId    
    )
}

export const isLastMessage = (messages, i, userId) => {
    return(
        i === messages.length - 1 && 
            messages[i].sender._id !== userId &&
            messages[i].sender._id 
    )
}

export const marginSender = (messages, mess, i, userId) => {
    if(i<messages.length - 1 && messages[i+1].sender._id === mess.sender._id &&
        messages[i].sender._id !== userId) return 30; //it's the size of margin
    
    else if(i<messages.length - 1 && messages[i+1].sender._id !== mess.sender._id &&
        messages[i].sender._id !== userId
        || (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
    return 0;
    else return "auto"
}

//it's for spacing between the messages in a row by the same user 
export const isSameUser = (messages, mess, i) => {
    return i > 0 && messages[i - 1].sender._id === mess.sender._id
}
