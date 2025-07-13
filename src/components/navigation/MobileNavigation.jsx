import { useChatStore } from "../../hooks/useChatStore";

export default function MobileNavigation({ currentView, onViewChange }) {
    const { chatId, receiver } = useChatStore();
    
    return (
        <div className="flex items-center justify-between p-4 bg-slate-800/50 border-b border-white/10 md:hidden">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onViewChange('list')}
                    className={`p-2 rounded-lg transition-colors ${
                        currentView === 'list' ? 'bg-blue-600' : 'bg-slate-700/50'
                    }`}
                    aria-label="Chat List"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                    </svg>
                </button>
                
                {chatId && receiver && (
                    <>
                        <button
                            onClick={() => onViewChange('chat')}
                            className={`p-2 rounded-lg transition-colors ${
                                currentView === 'chat' ? 'bg-blue-600' : 'bg-slate-700/50'
                            }`}
                            aria-label="Chat"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                            </svg>
                        </button>
                        
                        <button
                            onClick={() => onViewChange('detail')}
                            className={`p-2 rounded-lg transition-colors ${
                                currentView === 'detail' ? 'bg-blue-600' : 'bg-slate-700/50'
                            }`}
                            aria-label="Profile"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
                            </svg>
                        </button>
                    </>
                )}
            </div>
            
            <div className="text-white text-sm font-medium">
                {currentView === 'list' && 'Chats'}
                {currentView === 'chat' && (receiver?.username || 'Chat')}
                {currentView === 'detail' && 'Profile'}
            </div>
        </div>
    );
} 