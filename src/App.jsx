import List from "./components/list/List";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { useAuth } from "./hooks/useAuth";

function App() {
    const { user } = useAuth();

    return (
        <>
            <div className="container">
                {user ? (
                    <>
                        <List></List>
                        <Chat></Chat>
                        <Detail></Detail>
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
