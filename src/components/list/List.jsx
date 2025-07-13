import ChatList from "./chatList/ChatList";
import "./list.css";
import UserInfo from "./userInfo/UserInfo";

export default function List({ className = "", onChatSelect }){
    return (
        <div className={`${className} border-r border-gray-600/20 bg-slate-800/30 h-full flex flex-col overflow-hidden`}>
            <UserInfo />
            <ChatList onChatSelect={onChatSelect} />
        </div>
    );
}