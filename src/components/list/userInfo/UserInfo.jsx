import "./userInfo.css";

export default function UserInfo() {
    return (
        <div className="user-info">
            <div className="user">
                <img src="./avatar.png" alt="User avatar" />
                <h2>John Doe</h2>
            </div>
            <div className="icons">
                <img src="./more.png" alt="More options" />
                <img src="./video.png" alt="Video call" />
                <img src="./edit.png" alt="Edit profile" />
            </div>
        </div>
    );
}