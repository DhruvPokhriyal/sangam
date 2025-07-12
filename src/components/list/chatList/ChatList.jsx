import { useState, useEffect } from "react";
import "./chatList.css";
import AddUser from "../../addUser/AddUser";
import { useAuth } from "../../../hooks/useAuth";
import { onSnapshot, doc, getDoc, updateDoc  } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../hooks/useChatStore";

export default function ChatList() {
    const [addMode, setAddMode] = useState(false);
    const [chats, setChats] = useState([]);
    const { user } = useAuth();
    const { changeChat, chatId, receiver } = useChatStore();
    useEffect(() => {
        const unSub = onSnapshot(doc(db, "userChats", user.id), async (res) => {
            const items = res.data().chats;
            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);
                const user = userDocSnap.data();
                return {
                    ...item,
                    user
                }
            })
            const chats = await Promise.all(promises);
            setChats(chats.sort((a, b) => b.updatedAt - a.updatedAt));
         });
        return () => unSub();
    }, [user.id]);

    const handleSelect = async (chat) => {

        const userChats = chats.map(c => {
            const {user, ...rest} = c;
            return rest;
        })
        const chatIndex = userChats.findIndex(c => c.chatId === chat.chatId);
        userChats[chatIndex].isSeen = true;
        const userChatsRef = doc(db, "userChats", user.id);
        try {
            await updateDoc(userChatsRef, {
                chats: userChats
            })
            changeChat(chat.chatId, chat.user);
        } catch (error) {
            console.log(error);
        }

        
    }

    console.log(chatId, receiver);
    return (
        <div className="chatList">
            <div className="search">
                <div className="searchBar">
                    <img src="/search.png"></img>
                    <input type="text" placeholder="Search"></input>
                </div>
                <img
                    src={addMode ? "./minus.png" : "./plus.png"}
                    className="add"
                    onClick={() => setAddMode((prev) => !prev)}
                ></img>
            </div>
      
        {
            chats && chats.map((chat) => (
                <div className="item" key={chat.chatId} onClick={() => handleSelect(chat)} style={{
                    backgroundColor: chat  && chat.isSeen ? "transparent" : "#5183f5"
                }}>
                    <img src={chat.user.avatar || "./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{chat.user.username}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))
        }
            {addMode && <AddUser></AddUser>}
        </div>
    );
}
