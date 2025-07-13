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
        return (
            <div className="flex items-center justify-center min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat">
                <div className="p-8 sm:p-12 text-2xl sm:text-3xl lg:text-4xl rounded-lg bg-slate-900/90 text-white backdrop-blur-sm">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat text-white">
            <div className="w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] 2xl:w-[70vw] h-[85vh] sm:h-[90vh] md:h-[92vh] rounded-xl bg-slate-900/75 backdrop-blur-lg backdrop-saturate-180 border border-white/[0.125] flex overflow-hidden">
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
        </div>
    );
}

export default App;
