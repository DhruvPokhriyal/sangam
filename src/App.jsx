import List from "./components/list/List";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { useAuth } from "./hooks/useAuth";
import { useChatStore } from "./hooks/useChatStore";
function App() {
    const { user, loading } = useAuth();
    const { chatId, receiver } = useChatStore();
    console.log(chatId, receiver);
    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <>
            <div className="container">
                {user ? (
                    <>
                        <List></List>
                        {
                            chatId && receiver && (
                            <>
                               <Chat></Chat>
                               <Detail></Detail>
                            </>
                             
                            )
                        }
                       
                    </>
                ) : (
                    <Login></Login>
                )}
                <Notification></Notification>
            </div>
        </>
    );
}

export default App;
