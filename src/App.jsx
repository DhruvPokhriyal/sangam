import List from "./components/list/List";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import Login from "./components/login/Login";

function App() {
    const user = false;

    return (
        <>
            <div className="container">
                {user ? (
                    <>
                        {" "}
                        <List></List>
                        <Chat></Chat>
                        <Detail></Detail>
                    </>
                ) : (
                    <Login></Login>
                )}
            </div>
        </>
    );
}

export default App;
