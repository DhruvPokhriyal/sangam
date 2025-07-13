import "./userInfo.css";
import { useAuth } from "../../../hooks/useAuth";


export default function UserInfo() {

    const { user, logout } = useAuth();

    function handleLogout() {
        logout(); 
    }

    return (
        <div className="user-info">
            <div className="user">
                <img src={user.avatar || "./avatar.png"} alt="User avatar" />
                <h2>{user.username}</h2>
            </div>
            <div className="logout">
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}