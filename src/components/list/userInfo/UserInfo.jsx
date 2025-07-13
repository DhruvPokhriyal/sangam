import "./userInfo.css";
import { useAuth } from "../../../hooks/useAuth";

export default function UserInfo() {

    const { user } = useAuth();

    return (
        <div className="user-info">
            <div className="user">
                <img src={user.avatar || "./avatar.png"} alt="User avatar" />
                <h2>{user.username}</h2>
            </div>
            {/* <div className="icons">
                <img src="./more.png" alt="More options" />
                <img src="./video.png" alt="Video call" />
                <img src="./edit.png" alt="Edit profile" />
            </div> */}
        </div>
    );
}