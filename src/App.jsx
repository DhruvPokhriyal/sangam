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
    const [isDesktopDetailsOpen, setIsDesktopDetailsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    // Detect mobile vs desktop
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    
    // Reset mobile view when chat changes
    useEffect(() => {
        if (chatId && receiver) {
            setMobileView('chat');
        }
    }, [chatId, receiver]);

    // Handle desktop details toggle
    const handleDesktopDetailsToggle = () => {
        setIsDesktopDetailsOpen(prev => !prev);
    };

    // Handle mobile detail navigation
    const handleMobileDetailToggle = () => {
        setMobileView('detail');
    };

    // Handle detail close (mobile)
    const handleDetailClose = () => {
        setMobileView('chat');
    };

    // Reset desktop details when switching to mobile
    useEffect(() => {
        if (isMobile) {
            setIsDesktopDetailsOpen(false);
        }
    }, [isMobile]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                if (isMobile && mobileView === 'detail') {
                    handleDetailClose();
                } else if (!isMobile && isDesktopDetailsOpen) {
                    setIsDesktopDetailsOpen(false);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMobile, mobileView, isDesktopDetailsOpen]);
    
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
                                        className={`${mobileView === 'chat' ? 'flex' : 'hidden'} md:flex md:flex-1 flex-col transition-all duration-300 ease-in-out ${
                                            !isMobile && isDesktopDetailsOpen ? 'lg:mr-80' : 'lg:mr-0'
                                        }`}
                                        onDetailToggle={isMobile ? handleMobileDetailToggle : handleDesktopDetailsToggle}
                                        isDesktopDetailsOpen={isDesktopDetailsOpen}
                                        isMobile={isMobile}
                                    />
                                    
                                    {/* Mobile Detail Modal */}
                                    {isMobile && (
                                        <div className={`
                                            fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-lg backdrop-saturate-180 
                                            transition-transform duration-300 ease-in-out lg:hidden
                                            ${mobileView === 'detail' ? 'translate-x-0' : 'translate-x-full'}
                                        `}>
                                            <Detail 
                                                className="flex flex-col w-full h-full"
                                                onClose={handleDetailClose}
                                                isMobile={true}
                                            />
                                        </div>
                                    )}
                                    
                                    {/* Desktop Detail Sidebar */}
                                    {!isMobile && (
                                        <aside 
                                            className={`
                                                fixed top-0 right-0 h-full w-80 z-40 bg-slate-900/75 backdrop-blur-lg backdrop-saturate-180 
                                                border-l border-white/[0.125] transition-transform duration-300 ease-in-out
                                                ${isDesktopDetailsOpen ? 'translate-x-0' : 'translate-x-full'}
                                            `}
                                            aria-hidden={!isDesktopDetailsOpen}
                                            role="complementary"
                                        >
                                            <Detail 
                                                className="flex flex-col w-full h-full"
                                                onClose={() => setIsDesktopDetailsOpen(false)}
                                                isMobile={false}
                                            />
                                        </aside>
                                    )}
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
