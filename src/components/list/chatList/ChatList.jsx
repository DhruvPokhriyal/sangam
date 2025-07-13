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
    const [input, setInput] = useState(""); 
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
            const { user: _, ...rest } = c;
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

   const filteredChats = chats.filter((chat) => {
    return chat.user.username.toLowerCase().includes(input.toLowerCase());
   })

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="flex items-center gap-3 sm:gap-5 p-4 sm:p-5">
                <div className="flex-1 bg-slate-800/50 backdrop-blur-sm flex items-center gap-3 sm:gap-5 rounded-lg p-2.5 transition-all duration-200 hover:bg-slate-800/60">
                    <img src="/search.png" alt="Search" className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" />
                    <input 
                        type="text" 
                        placeholder="Search" 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)}
                        className="bg-transparent border-none outline-none text-white flex-1 text-sm sm:text-base placeholder:text-gray-400"
                    />
                </div>
                <button
                    onClick={() => setAddMode((prev) => !prev)}
                    className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-800/50 backdrop-blur-sm p-2 sm:p-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-800/60 hover:scale-105 active:scale-95"
                >
                    <img 
                        src={addMode ? "./minus.png" : "./plus.png"}
                        alt={addMode ? "Close" : "Add"}
                        className="w-full h-full"
                    />
                </button>
            </div>
      
            <div className="space-y-1">
                {filteredChats && filteredChats.map((chat) => (
                    <div 
                        key={chat.chatId} 
                        onClick={() => handleSelect(chat)}
                        className={`flex items-center gap-3 sm:gap-5 p-4 sm:p-5 cursor-pointer border-b border-gray-300/10 transition-all duration-200 hover:bg-slate-800/30 ${
                            chat && chat.isSeen ? "bg-transparent" : "bg-blue-600/80 hover:bg-blue-600/90"
                        }`}
                    >
                        <div className="relative">
                            <img 
                                src={chat.user.blocked.includes(user.id) || user.blocked.includes(chat.user.id) ? "./avatar.png" : chat.user.avatar || "./avatar.png"} 
                                alt="User avatar" 
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-transparent transition-all duration-200 hover:ring-blue-400/50"
                            />
                            {!chat.isSeen && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-slate-900"></div>
                            )}
                        </div>
                        <div className="flex flex-col gap-1 sm:gap-2.5 flex-1 min-w-0">
                            <span className="font-medium text-sm sm:text-base text-white truncate">
                                {chat.user.blocked.includes(user.id) || user.blocked.includes(chat.user.id) ? "Unknown User" : chat.user.username}
                            </span>
                            <div className="text-xs sm:text-sm font-light text-gray-300 truncate">
                                {chat.user.blocked.includes(user.id) && (
                                    <p className="text-red-400">You are blocked by this user</p>
                                )}
                                {user.blocked.includes(chat.user.id) && (
                                    <p className="text-orange-400">You have blocked this user</p>
                                )}
                                {!chat.user.blocked.includes(user.id) && !user.blocked.includes(chat.user.id) && (
                                    <p className="text-gray-400">{chat.lastMessage}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {addMode && <AddUser setAddMode={setAddMode} />}
        </div>
    );
}
