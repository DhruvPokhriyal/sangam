import { useCallback, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";

export default function Chat() {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");

    const handleEmoji = useCallback(function handleEmoji(e) {
        setText((prev) => prev + e.emoji);
    }, []);

    // function handleEmoji(e) {}

    console.log(text);

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
                    <div className="message">
                        <img src="./avatar.png" alt="" />
                        <div className="texts">
                            <p>
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Iure id beatae laborum minima
                                quaerat ratione doloremque recusandae voluptates
                                velit explicabo blanditiis eos dolorem, suscipit
                                sit amet molestias optio dignissimos saepe.
                            </p>
                            <span>1 min ago</span>
                        </div>
                    </div>
                    <div className="message own">
                        <div className="texts">
                            <p>
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Iure id beatae laborum minima
                                quaerat ratione doloremque recusandae voluptates
                                velit explicabo blanditiis eos dolorem, suscipit
                                sit amet molestias optio dignissimos saepe.
                            </p>
                            <span>1 min ago</span>
                        </div>
                    </div>{" "}
                    <div className="message">
                        <img src="./avatar.png" alt="" />

                        <div className="texts">
                            <p>
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Iure id beatae laborum minima
                                quaerat ratione doloremque recusandae voluptates
                                velit explicabo blanditiis eos dolorem, suscipit
                                sit amet molestias optio dignissimos saepe.
                            </p>
                            <span>1 min ago</span>
                        </div>
                    </div>{" "}
                    <div className="message own">
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
                    </div>
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
                    <button className="sendButton">Send</button>
                </div>
            </div>
        </>
    );
}
