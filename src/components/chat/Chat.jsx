import { useCallback, useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { db } from "../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useChatStore } from "../../hooks/useChatStore";
import { useAuth } from "../../hooks/useAuth";
import { updateDoc, getDoc, arrayUnion } from "firebase/firestore";

export default function Chat() {
    const [chat, setChat] = useState(null);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const endRef = useRef(null);
    const { user } = useAuth();
    const { chatId, receiver } = useChatStore();
    console.log(chatId, receiver);
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

    // function handleEmoji(e) {}

    console.log(text);

    async function handleSend() {
        if (!text.trim()) return;
        try {
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: user.id,
                    text,
                    createdAt: new Date(),
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
          
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="chat">
                <div className="top">
                    <div className="user">
                        <img src="./avatar.png" alt="" />
                        <div className="texts">
                            <span>John Doe</span>
                            <p>Lorem ipsum dolor sit amet.</p>
                        </div>
                    </div>
                    <div className="icons">
                        <img src="./phone.png" alt="" />
                        <img src="./video.png" alt="" />
                        <img src="./info.png" alt="" />
                    </div>
                </div>
                <div className="center">
                    {chat &&
                        chat.messages.map((message) => (
                            <div
                                className={`message own`}
                                key={message.createdAt}
                            >
                                <div className="texts">
                                    {message.img && (
                                        <img src={message.img} alt="" />
                                    )}
                                    <p>{message.text}</p>
                                </div>
                            </div>
                        ))}

                    {/* <div className="message own">
                        <div className="texts">
                            <img
                                src="https://images.unsplash.com/photo-1504194104404-433180773017?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt=""
                            />
                            <p>
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Iure id beatae laborum minima
                                quaerat ratione doloremque recusandae voluptates
                                velit explicabo blanditiis eos dolorem, suscipit
                                sit amet molestias optio dignissimos saepe.
                            </p>
                            <span>1 min ago</span>
                        </div>
                    </div> */}
                    <div ref={endRef}></div>
                </div>
                <div className="bottom">
                    <div className="icons">
                        <img src="./img.png" alt="" />
                        <img src="./camera.png" alt="" />
                        <img src="./mic.png" alt="" />
                    </div>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <div className="emoji">
                        <img
                            src="./emoji.png"
                            alt=""
                            onClick={() => setOpen((prev) => !prev)}
                        />
                        <div className="picker">
                            <EmojiPicker
                                open={open}
                                onEmojiClick={handleEmoji}
                            ></EmojiPicker>
                        </div>
                    </div>
                    <button className="sendButton" onClick={handleSend}>
                        Send
                    </button>
                </div>
            </div>
        </>
    );
}
