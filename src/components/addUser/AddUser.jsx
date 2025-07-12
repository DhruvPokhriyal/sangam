import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import "./addUser.css";
import { useState } from "react";

export default function AddUser() {
    const [users, setUsers] = useState([]);
    const [empty, setEmpty] = useState(false);

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
                setEmpty(true);
            }
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
                {empty && <p>No users found</p>}
                {!empty && users.map((user) => (
                    <div className="user" key={user.id}>
                        <div className="detail">
                            <img src={user.avatar || "./avatar.png"} alt="" />
                            <span>{user.username}</span>
                        </div>
                        <button>Add User</button>
                    </div>
                ))}
            </div>
        </>
    );
}
