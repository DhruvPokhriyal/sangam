import { useAuth } from "../../hooks/useAuth";
import "./detail.css";
import { useChatStore } from "../../hooks/useChatStore";
import { useUserStore } from "../../hooks/useUserStore";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function Detail({ className = "", onClose, isMobile = false }) {
    const { user, logout } = useAuth();
    const { updateUserData } = useUserStore();
    const {receiver, isCurrentUserBlocked, isReceiverBlocked, refreshBlockingStates} = useChatStore();

    function handleLogout() {
        logout();
    }

    async function handleLanguageChange(e) {
        try {
        const updatedLanguage = e.target.value;
        const userDocRef = doc(db, "users", user.id);
        await updateDoc(userDocRef, {
            language: updatedLanguage
        });
        await updateUserData();
    } catch(err){
        console.log(err);
    }
    }

    async function handleBlock() {
        if (!receiver) return;

        const userDocRef = doc(db, "users", user.id);
        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(receiver.id) : arrayUnion(receiver.id)
            });
            
            // Update user data in the store to reflect the new blocked array
            await updateUserData();
            
            // Refresh blocking states in chat store
            refreshBlockingStates();

        } catch(err){
            console.log(err);
        }
    }

    return (
        <>
            <div 
                id="chat-details-panel"
                className={`${className} bg-slate-800/30 h-full flex flex-col overflow-hidden`}
            >
                {/* Header - Fixed */}
                <div className="flex-shrink-0 py-6 sm:py-8 px-4 sm:px-5 lg:px-6 flex flex-col items-center gap-3 sm:gap-4 border-b border-gray-300/10 relative">
                    {/* Close button - Mobile and Desktop */}
                    <button 
                        onClick={onClose}
                        className={`
                            absolute top-4 right-4 p-2 rounded-lg transition-colors
                            ${isMobile 
                                ? 'bg-slate-700/50 hover:bg-slate-700' 
                                : 'bg-slate-700/50 hover:bg-slate-700 hover:text-white'
                            }
                        `}
                        aria-label={isMobile ? "Close Profile" : "Close Details Panel"}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                    </button>
                    
                    {/* Header content with staggered animation */}
                    <div className="flex flex-col items-center gap-3 sm:gap-4 transition-all duration-500 ease-out">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden transition-all duration-300 delay-100">
                            <img 
                                src={isCurrentUserBlocked || isReceiverBlocked ? "./avatar.png" : receiver?.avatar || "./avatar.png"} 
                                alt="User Avatar" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="text-center transition-all duration-300 delay-200">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                                {isCurrentUserBlocked || isReceiverBlocked ? "Unknown User" : receiver?.username || "Unknown User"}
                            </h2>
                            <p className="text-sm sm:text-base text-gray-400 mt-1">
                                {isCurrentUserBlocked || isReceiverBlocked ? "Bio not available" : receiver?.bio || "Lorem ipsum dolor sit amet."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
                    {/* Options with staggered animation */}
                    <div className="space-y-3 sm:space-y-4">
                        {/* Language Selection */}
                        <div className="p-3 sm:p-4 rounded-lg bg-slate-700/50 border border-gray-300/10 transition-all duration-300 delay-300">
                            <div className="flex items-center justify-between">
                                <span className="text-sm sm:text-base text-white">Language</span>
                                <select 
                                    className="bg-slate-800/50 text-white text-sm sm:text-base px-3 py-1 rounded-md border border-gray-300/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={user.language}
                                    onChange={handleLanguageChange}
                                >
                                    <option value="en">English</option>
                                    <option value="hi">Hindi</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                    <option value="it">Italian</option>
                                    <option value="pt">Portuguese</option>
                                    <option value="ru">Russian</option>
                                    <option value="ja">Japanese</option>
                                    <option value="ko">Korean</option>
                                    <option value="zh">Chinese</option>
                                    <option value="ar">Arabic</option>
                                    <option value="tr">Turkish</option>
                                    <option value="pl">Polish</option>
                                    <option value="nl">Dutch</option>
                                    <option value="sv">Swedish</option>
                                    <option value="da">Danish</option>
                                    <option value="no">Norwegian</option>
                                    <option value="fi">Finnish</option>
                                    <option value="cs">Czech</option>
                                    <option value="hu">Hungarian</option>
                                    <option value="ro">Romanian</option>
                                    <option value="bg">Bulgarian</option>
                                    <option value="hr">Croatian</option>
                                    <option value="sk">Slovak</option>
                                    <option value="sl">Slovenian</option>
                                    <option value="et">Estonian</option>
                                    <option value="lv">Latvian</option>
                                    <option value="lt">Lithuanian</option>
                                    <option value="mt">Maltese</option>
                                    <option value="ga">Irish</option>
                                    <option value="cy">Welsh</option>
                                    <option value="eu">Basque</option>
                                    <option value="ca">Catalan</option>
                                    <option value="gl">Galician</option>
                                    <option value="is">Icelandic</option>
                                    <option value="mk">Macedonian</option>
                                    <option value="sq">Albanian</option>
                                    <option value="sr">Serbian</option>
                                    <option value="bs">Bosnian</option>
                                    <option value="me">Montenegrin</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons with staggered animation */}
                    <div className="space-y-3 sm:space-y-4">
                        <div className="transition-all duration-300 delay-400">
                            <button 
                                onClick={handleBlock}
                                className="w-full px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base font-medium text-white bg-orange-600/80 hover:bg-orange-600 active:bg-orange-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                            >
                                {isReceiverBlocked ? "Unblock User" : "Block User"}
                            </button>
                        </div>
                        
                        <div className="transition-all duration-300 delay-500">
                            <button 
                                onClick={handleLogout}
                                className="w-full px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base font-medium text-white bg-red-600/80 hover:bg-red-600 active:bg-red-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
