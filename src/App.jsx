import { useState, useEffect } from "react";
import List from "./components/list/List";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import MobileNavigation from "./components/navigation/MobileNavigation";
import { useAuth } from "./hooks/useAuth";
import { useChatStore } from "./hooks/useChatStore";

function App() {
    const { user, loading } = useAuth();
    const { chatId, receiver } = useChatStore();
    const [mobileView, setMobileView] = useState('list');
    
    // Reset mobile view when chat changes
    useEffect(() => {
        if (chatId && receiver) {
            setMobileView('chat');
        }
    }, [chatId, receiver]);
    
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
            <div className="w-full h-full md:w-[85vw] md:h-[92vh] md:rounded-xl bg-slate-900/75 backdrop-blur-lg backdrop-saturate-180 border border-white/[0.125] flex flex-col md:flex-row overflow-hidden">
                {user ? (
                    <>
                        {/* Mobile Navigation */}
                        <MobileNavigation 
                            currentView={mobileView}
                            onViewChange={setMobileView}
                        />
                        
                        {/* Responsive Layout */}
                        <div className="flex flex-1 overflow-hidden">
                            <List 
                                className={`${mobileView === 'list' ? 'flex' : 'hidden'} md:flex md:flex-1 flex-col h-full`}
                                onChatSelect={() => setMobileView('chat')}
                            />
                            {chatId && receiver && (
                                <>
                                    <Chat 
                                        className={`${mobileView === 'chat' ? 'flex' : 'hidden'} md:flex md:flex-[2] flex-col h-full`}
                                        onDetailToggle={() => setMobileView('detail')}
                                    />
                                    <Detail 
                                        className={`${mobileView === 'detail' ? 'flex' : 'hidden'} lg:flex lg:flex-1 flex-col h-full`}
                                        onClose={() => setMobileView('chat')}
                                    />
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <Login />
                )}
                <Notification />
            </div>
        </div>
    );
}

export default App;
