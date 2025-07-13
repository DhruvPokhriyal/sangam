import ChatList from "./chatList/ChatList";
import "./list.css";
import UserInfo from "./userInfo/UserInfo";

export default function List(){
    return <>
    <div className="flex-1 flex flex-col h-full">
        <UserInfo></UserInfo>
        <ChatList></ChatList>
    </div>
    </>
}