import { useAuth } from "../../hooks/useAuth";
import "./detail.css";
import { useChatStore } from "../../hooks/useChatStore";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "../../lib/firebase";
export default function Detail() {
    const { user, logout } = useAuth();
    const {chatId, receiver, isCurrentUserBlocked, isReceiverBlocked, changeBlock} = useChatStore();

    function handleLogout() {
        logout();
    }

    async function handleBlock() {
        if (!receiver) return;

        const userDocRef = doc(db, "users", user.id);
        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(receiver.id) : arrayUnion(receiver.id)
            });
            changeBlock();

        } catch(err){
            console.log(err);
        }
    }

    return (
        <>
            <div className="detail">
                <div className="user">
                    <img src={receiver.avatar || "./avatar.png"} alt="" />
                    <h2>{receiver.username}</h2>
                    <p>{receiver.bio || "Lorem ipsum dolor sit amet."}</p>
                </div>
                <div className="info">
                    <div className="option">
                        <div className="title">
                            <span>Chat Settings</span>
                            <img src="./arrowUp.png" alt="" />
                        </div>
                    </div>
                    <div className="option">
                        <div className="title">
                            <span>Privacy & help</span>
                            <img src="./arrowUp.png" alt="" />
                        </div>
                    </div>
                    <div className="option">
                        <div className="title">
                            <span>Shared photos</span>
                            <img src="./arrowUp.png" alt="" />
                        </div>
                        <div className="photos">
                            <div className="photoItem">
                                <div className="photoDetail">
                                    <img
                                        src="https://images.unsplash.com/photo-1504194104404-433180773017?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt=""
                                    />
                                    <span>photo_2025_7.png</span>
                                </div>

                                <img
                                    src="./download.png"
                                    alt=""
                                    className="icon"
                                />
                            </div>
                            <div className="photoItem">
                                <div className="photoDetail">
                                    <img
                                        src="https://images.unsplash.com/photo-1504194104404-433180773017?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt=""
                                    />
                                    <span>photo_2025_7.png</span>
                                </div>

                                <img
                                    src="./download.png"
                                    alt=""
                                    className="icon"
                                />
                            </div>
                            <div className="photoItem">
                                <div className="photoDetail">
                                    <img
                                        src="https://images.unsplash.com/photo-1504194104404-433180773017?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt=""
                                    />
                                    <span>photo_2025_7.png</span>
                                </div>

                                <img
                                    src="./download.png"
                                    alt=""
                                    className="icon"
                                />
                            </div>
                            <div className="photoItem">
                                <div className="photoDetail">
                                    <img
                                        src="https://images.unsplash.com/photo-1504194104404-433180773017?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt=""
                                    />
                                    <span>photo_2025_7.png</span>
                                </div>

                                <img
                                    src="./download.png"
                                    alt=""
                                    className="icon"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="option">
                        <div className="title">
                            <span>Shared Files</span>
                            <img src="./arrowUp.png" alt="" />
                        </div>
                    </div>
                    <button className="" onClick={handleBlock}>{isReceiverBlocked ? "Unblock User" : "Block User"}</button>
                    <button className="logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}
