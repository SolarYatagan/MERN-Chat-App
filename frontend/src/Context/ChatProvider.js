import {createContext, useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'

//{Provider, Consumer}
//<UserContext.Provider value={user}>
//children and grandchildren can use user props inside user.provider
//</UserContext.Provider>
const ChatContext = createContext()

const ChatProvider = ({children}) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])
    const navigate = useNavigate();
    const [reload, setReload] = useState(false)
    const [notifications, setNotifications] = useState([])


    useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setUser(userInfo);
      
      if (!userInfo) navigate("/");
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    return(
    <ChatContext.Provider value={
    {user, setUser, selectedChat, setSelectedChat, 
    chats, setChats, reload, setReload, 
    notifications, setNotifications}}>
    {children}
    </ChatContext.Provider>
    )
}
export const ChatState = () => { //all of our state is inside this variable
    return useContext(ChatContext)
}

export default ChatProvider