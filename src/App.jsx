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
            <div className="h-screen w-screen flex items-center justify-center bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat">
                <div className="p-8 sm:p-12 text-2xl sm:text-3xl lg:text-4xl rounded-lg bg-slate-900/90 text-white backdrop-blur-sm">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat text-white">
            <div className="flex-1 bg-slate-900/75 backdrop-blur-lg backdrop-saturate-180 border border-white/[0.125] flex flex-col overflow-hidden">
                {user ? (
                    <>
                        {/* Mobile Navigation */}
                        <MobileNavigation 
                            currentView={mobileView}
                            onViewChange={setMobileView}
                        />
                        
                        {/* Main Content Area - Full Height */}
                        <main className="flex-1 flex overflow-hidden">
                            <List 
                                className={`${mobileView === 'list' ? 'flex' : 'hidden'} md:flex md:w-80 md:flex-shrink-0 flex-col`}
                                onChatSelect={() => setMobileView('chat')}
                            />
                            {chatId && receiver && (
                                <>
                                    <Chat 
                                        className={`${mobileView === 'chat' ? 'flex' : 'hidden'} md:flex md:flex-1 flex-col`}
                                        onDetailToggle={() => setMobileView('detail')}
                                    />
                                    <Detail 
                                        className={`${mobileView === 'detail' ? 'flex' : 'hidden'} lg:flex lg:w-80 lg:flex-shrink-0 flex-col`}
                                        onClose={() => setMobileView('chat')}
                                    />
                                </>
                            )}
                        </main>
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
