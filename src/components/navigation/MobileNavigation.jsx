import { useChatStore } from "../../hooks/useChatStore";

export default function MobileNavigation({ currentView, onViewChange }) {
    const { chatId, receiver } = useChatStore();
    
    return (
        <div className="flex-shrink-0 flex items-center justify-between p-4 bg-slate-800/50 border-b border-white/10 md:hidden">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onViewChange('list')}
                    className={`p-2 rounded-lg transition-colors ${
                        currentView === 'list' ? 'bg-blue-600' : 'bg-slate-700/50 hover:bg-slate-700'
                    }`}
                    aria-label="Chat List"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                    </svg>
                </button>
                
                {chatId && receiver && (
                    <button
                        onClick={() => onViewChange('chat')}
                        className={`p-2 rounded-lg transition-colors ${
                            currentView === 'chat' ? 'bg-blue-600' : 'bg-slate-700/50 hover:bg-slate-700'
                        }`}
                        aria-label="Chat"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
                        </svg>
                    </button>
                )}
                
                {chatId && receiver && (
                    <button
                        onClick={() => onViewChange('detail')}
                        className={`p-2 rounded-lg transition-colors ${
                            currentView === 'detail' ? 'bg-blue-600' : 'bg-slate-700/50 hover:bg-slate-700'
                        }`}
                        aria-label="Profile"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                        </svg>
                    </button>
                )}
            </div>
            
            <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-white">
                    {currentView === 'list' && "Messages"}
                    {currentView === 'chat' && (receiver?.username || "Chat")}
                    {currentView === 'detail' && "Profile"}
                </h1>
            </div>
        </div>
    );
} 