import ChatList from "./chatList/ChatList";
import "./list.css";
import UserInfo from "./userInfo/UserInfo";

export default function List({ className = "", onChatSelect }){
    return (
        <div className={`${className} flex-1 flex flex-col h-full`}>
            <UserInfo />
            <ChatList onChatSelect={onChatSelect} />
        </div>
    );
}