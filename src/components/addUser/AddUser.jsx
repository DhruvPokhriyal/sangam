import { collection, doc, getDoc , getDocs, query, setDoc, where, serverTimestamp, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../lib/firebase";
import "./addUser.css";
import { useState } from "react";
import { useUserStore } from "../../hooks/useUserStore";
import { toast } from "react-toastify";

export default function AddUser({setAddMode}) {
    const {user : receiver} = useUserStore();
    const [users, setUsers] = useState([]);
    let alreadyPresent = [];

    async function handleSearch(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");
        console.log(username);
        try {
            const userChatsRef = doc(db, "userChats", receiver.id);
            const userChatsDoc = await getDoc(userChatsRef);
            if (userChatsDoc.exists()) {
                const userChats = userChatsDoc.data();
                alreadyPresent = userChats.chats.map((chat) => chat.receiverId);
            }

            const usersRef = collection(db, "users");
            const q2 = query(usersRef, where("username", "==", username), where("username", "!=", receiver.username));
            const querySnapshot2 = await getDocs(q2);
            if (!querySnapshot2.empty) {
                setUsers(querySnapshot2.docs.map((doc) => doc.data()).filter((user) => !alreadyPresent.includes(user.id)));
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
            toast.success("User added successfully");
            setAddMode(false);
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="w-full max-w-md bg-slate-800 bg-opacity-95 rounded-xl p-6 sm:p-8 backdrop-blur-sm shadow-2xl">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-white mb-2">Add User</h2>
                        <p className="text-gray-300 text-sm">Search for users to start a new conversation</p>
                    </div>
                    
                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input 
                                type="text" 
                                placeholder="Username" 
                                name="username" 
                                className="flex-1 px-4 py-3 bg-slate-700 text-white placeholder-gray-400 rounded-lg border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                            />
                            <button 
                                type="submit"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    <div className="min-h-[100px]">
                        {users.length === 0 && (
                            <div className="text-center py-8">
                                <div className="text-gray-400 text-sm">No users found</div>
                            </div>
                        )}
                        
                        <div className="space-y-3">
                            {users.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-3 bg-slate-700 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={user.avatar || "./avatar.png"} 
                                            alt={`${user.username}'s avatar`}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-slate-600"
                                        />
                                        <div>
                                            <span className="text-white font-medium">{user.username}</span>
                                        </div>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => handleAddUser(user)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                                    >
                                        Add User
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-600">
                        <button 
                            type="button"
                            onClick={() => setAddMode(false)}
                            className="w-full px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
