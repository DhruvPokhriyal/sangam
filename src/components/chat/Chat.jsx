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
                <div className="center"></div>
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
