import { collection, doc, getDocs, query, setDoc, where, serverTimestamp, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../lib/firebase";
import "./addUser.css";
import { useState } from "react";
import { useUserStore } from "../../hooks/useUserStore";

export default function AddUser() {
    const {user : receiver} = useUserStore();
    const [users, setUsers] = useState([]);
  

    async function handleSearch(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");
        console.log(username);
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setUsers(querySnapshot.docs.map((doc) => doc.data()));
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function handleAddUser(user) {

        const chatRef = collection(db, "chats");
        const userChatRef = collection(db, "userChats");

        console.log(user);
        try {
            const newChatRef = doc(chatRef);
            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [], 
            })
            await updateDoc(doc(userChatRef, user.id),{
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: receiver.id,
                    updatedAt: Date.now(),
                }),
            })
            await updateDoc(doc(userChatRef, receiver.id),{
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: user.id,
                    updatedAt: Date.now(),
                }),
            }) 
            console.log(newChatRef); 
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="addUser">
                <form onSubmit={handleSearch}>
                    <input type="text" placeholder="Username" name="username" />
                    <button>Search</button>
                </form>
                {users.length === 0 && <p>No users found</p>}
                {users.length > 0 && users.map((user) => (
                    <div className="user" key={user.id}>
                        <div className="detail">
                            <img src={user.avatar || "./avatar.png"} alt="" />
                            <span>{user.username}</span>
                        </div>
                        <button type="button" onClick={() => handleAddUser(user)}>Add User</button>
                    </div>
                ))}
            </div>
        </>
    );
}
