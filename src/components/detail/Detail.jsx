import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./detail.css";
import { useChatStore } from "../../hooks/useChatStore";
import { useUserStore } from "../../hooks/useUserStore";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "../../lib/firebase";
export default function Detail() {
    // const [language, setLanguage] = useState("English");
    const { user, logout } = useAuth();
    const { updateUserData } = useUserStore();
    const {receiver, isCurrentUserBlocked, isReceiverBlocked, refreshBlockingStates} = useChatStore();

    function handleLogout() {
        logout();
    }

    async function handleLanguageChange(e) {
        try {
        const updatedLanguage = e.target.value;
        // setLanguage(updatedLanguage);
        const userDocRef = doc(db, "users", user.id);
        await updateDoc(userDocRef, {
            language: updatedLanguage
        });
        await updateUserData();
    } catch(err){
        console.log(err);
    }
    }

    async function handleBlock() {
        if (!receiver) return;

        const userDocRef = doc(db, "users", user.id);
        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(receiver.id) : arrayUnion(receiver.id)
            });
            
            // Update user data in the store to reflect the new blocked array
            await updateUserData();
            
            // Refresh blocking states in chat store
            refreshBlockingStates();

        } catch(err){
            console.log(err);
        }
    }

    return (
        <>
            <div className="detail">
                <div className="user">
                    <img src={isCurrentUserBlocked || isReceiverBlocked ? "./avatar.png" : receiver?.avatar || "./avatar.png"} alt="" />
                    <h2>{isCurrentUserBlocked || isReceiverBlocked ? "Unknown User" : receiver?.username || "Unknown User"}</h2>
                    <p>{isCurrentUserBlocked || isReceiverBlocked ? "Bio not available" : receiver?.bio || "Lorem ipsum dolor sit amet."}</p>
                </div>
                <div className="info">
                    {/* <div className="option">
                        <div className="title">
                            <span>Chat Settings</span>
                            <img src="./arrowUp.png" alt="" />
                        </div>
                    </div> */}
                    {/* <div className="option">
                        <div className="title">
                            <span>Privacy & help</span>
                            <img src="./arrowUp.png" alt="" />
                        </div>
                    </div> */}
                    {/* <div className="option">
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
                    </div> */}
                    {/* <div className="option">
                        <div className="title">
                            <span>Shared Files</span>
                            <img src="./arrowUp.png" alt="" />
                        </div>
                    </div> */}
                    <button className="" onClick={handleBlock}>{isReceiverBlocked ? "Unblock User" : "Block User"}</button>
                    <label htmlFor="language">Change Language:</label>
                        <select id="language" name="language" value={user.language} onChange={handleLanguageChange}>
                            <option value="English">English (Default)</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Telugu">Telugu</option>
                            <option value="Tamil">Tamil</option>
                            <option value="Marathi">Marathi</option>
                            <option value="Garhwali">Garhwali</option>
                            <option value="Gujarati">Gujarati</option>
                            <option value="Kannada">Kannada</option>
                            <option value="Malayalam">Malayalam</option>
                            <option value="Odia">Odia</option>
                            <option value="Punjabi">Punjabi</option>
                            <option value="Urdu">Urdu</option>
                            <option value="Bengali">Bengali</option>
                            
                        </select>
                    <button className="logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}
