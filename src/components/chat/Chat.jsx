import { useCallback, useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { db } from "../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useChatStore } from "../../hooks/useChatStore";
import { useAuth } from "../../hooks/useAuth";
import { updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import uploadAvatar from "../../utils/upload";
 
export default function Chat({ className = "", onDetailToggle }) {
    const [chat, setChat] = useState(null);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [img, setImg] = useState({
        file: null,
        url: "",
    });
    const endRef = useRef(null);
    const { user } = useAuth();
    const { chatId, receiver, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" });
    });

    useEffect(() => {
        if (!chatId) return;
        const unsub = onSnapshot(doc(db, "chats", chatId), (doc) => {
            setChat(doc.data());
        });
        return () => unsub();
    }, [chatId]);

    const handleEmoji = useCallback(function handleEmoji(e) {
        setText((prev) => prev + e.emoji);
    }, []);

    const handleImage = (e) => {
        const file = e.target.files[0];
        setImg({
            file,
            url: URL.createObjectURL(file),
        })
    }

    async function handleSend() {
        if (!text.trim() || !receiver || isCurrentUserBlocked || isReceiverBlocked) return;
        let imgUrl = null;
        
        try {
            if (img.file) {
                imgUrl = await uploadAvatar(img.file);
            }
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: user.id,
                    receiverId: receiver.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && { img: imgUrl }),
                }),
            });

            const userIds = [user.id, receiver.id];
            userIds.map(async (id) => {
                const userChatsRef = doc(db, "userChats", id);
                const userChatsSnap = await getDoc(userChatsRef);
    
                if (userChatsSnap.exists()) {
                    const userChatsData = userChatsSnap.data();
                    const chatIndex = userChatsData.chats.findIndex(
                        (c) => c.chatId === chatId
                    );
                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen = id === user.id ? true : false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();
    
                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    });
                }
            })
            setText("");
            setImg({
                file: null,
                url: "",
            });
          
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className={`${className} flex-[2] border-l border-r border-gray-600/20 h-full flex flex-col`}>
                <div className="p-4 sm:p-5 lg:p-6 flex items-center justify-between border-b border-gray-600/20">
                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
                        <img 
                            src={isCurrentUserBlocked || isReceiverBlocked ? "./avatar.png" : receiver?.avatar || "./avatar.png"} 
                            alt="" 
                            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-15 lg:h-15 rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-1">
                            <span className="text-sm sm:text-base lg:text-lg font-bold text-white">
                                {isCurrentUserBlocked || isReceiverBlocked ? "Unknown User" : receiver?.username || "Unknown User"}
                            </span>
                            <p className="text-xs sm:text-sm font-light text-gray-400">
                                {isCurrentUserBlocked || isReceiverBlocked ? "Bio not available" : receiver?.bio || "Lorem ipsum dolor sit amet."}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 sm:gap-4 lg:gap-5">
                        {/* Mobile info button */}
                        <button 
                            onClick={onDetailToggle}
                            className="p-2 lg:hidden bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                            aria-label="User Profile"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                            </svg>
                        </button>
                        
                        {/* Desktop info icon */}
                        <img src="./info.png" alt="" className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:opacity-80 transition-opacity hidden lg:block" />
                    </div>
                </div>
                <div className="p-4 sm:p-5 lg:p-6 flex-1 overflow-y-auto flex flex-col gap-3 sm:gap-4 lg:gap-5">
                    {chat &&
                        chat.messages.map((message) => (
                            <div
                                className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] flex gap-3 sm:gap-4 lg:gap-5 ${
                                    message.senderId === user.id ? "self-end" : ""
                                }`}
                                key={message.createdAt}
                            >
                                <div className="flex-1 flex flex-col gap-1 sm:gap-2">
                                    {message.img && (
                                        <img 
                                            src={message.img} 
                                            alt="" 
                                            className="w-full h-48 sm:h-60 lg:h-72 rounded-lg object-cover"
                                        />
                                    )}
                                    {message.senderId === user.id ? (
                                        <p className="px-4 py-3 sm:px-5 sm:py-4 bg-blue-600 text-white rounded-lg text-sm sm:text-base">
                                            {message.text}
                                        </p>
                                    ) : (
                                        <p className="px-4 py-3 sm:px-5 sm:py-4 bg-gray-800/30 text-white rounded-lg text-sm sm:text-base">
                                            {message.translatedMessage || message.text}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    {img.url && (
                        <div className="max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] flex gap-3 sm:gap-4 lg:gap-5 self-end">
                            <div className="flex-1 flex flex-col gap-1 sm:gap-2">
                                <img 
                                    src={img.url} 
                                    alt="" 
                                    className="w-full h-48 sm:h-60 lg:h-72 rounded-lg object-cover"
                                />
                            </div>
                        </div>
                    )}
                    <div ref={endRef}></div>
                </div>
                <div className="p-4 sm:p-5 lg:p-6 flex items-center justify-between border-t border-gray-600/20 gap-3 sm:gap-4 lg:gap-5 mt-auto">
                    <div className="flex gap-3 sm:gap-4 lg:gap-5">
                        <label htmlFor="img" className="cursor-pointer hover:opacity-80 transition-opacity">
                            <img src="./img.png" alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                            <input type="file" id="img" onChange={handleImage} style={{ display: "none" }} />
                        </label>
                    </div>
                    <input
                        type="text"
                        placeholder={isCurrentUserBlocked || isReceiverBlocked ? "You cannot send messages to this user" : "Type a message..."}
                        disabled={isCurrentUserBlocked || isReceiverBlocked}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 bg-gray-800/50 border-none outline-none text-white px-4 py-3 sm:px-5 sm:py-4 rounded-lg text-sm sm:text-base placeholder:text-gray-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <div className="relative">
                        <img
                            src="./emoji.png"
                            alt=""
                            onClick={() => setOpen((prev) => !prev)}
                            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute bottom-12 left-0 z-10">
                            <EmojiPicker
                                open={open}
                                onEmojiClick={handleEmoji}
                            />
                        </div>
                    </div>
                    <button 
                        className="bg-blue-600 text-white px-4 py-2 sm:px-5 sm:py-3 border-none rounded-md cursor-pointer text-sm sm:text-base font-medium hover:bg-blue-700 disabled:bg-blue-600/70 disabled:cursor-not-allowed transition-colors"
                        onClick={handleSend} 
                        disabled={isCurrentUserBlocked || isReceiverBlocked}
                    >
                        Send
                    </button>
                </div>
            </div>
        </>
    );
}
