import { useAuth } from "../../hooks/useAuth";
import "./detail.css";
import { useChatStore } from "../../hooks/useChatStore";
import { useUserStore } from "../../hooks/useUserStore";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function Detail({ className = "", onClose }) {
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
            <div className={`${className} flex-1`}>
                <div className="py-6 sm:py-8 px-4 sm:px-5 lg:px-6 flex flex-col items-center gap-3 sm:gap-4 border-b border-gray-300/10 relative">
                    {/* Mobile close button */}
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 lg:hidden bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                        aria-label="Close Profile"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                    </button>
                    
                    <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden">
                        <img 
                            src={isCurrentUserBlocked || isReceiverBlocked ? "./avatar.png" : receiver?.avatar || "./avatar.png"} 
                            alt="User Avatar" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white truncate max-w-48 sm:max-w-64">
                            {isCurrentUserBlocked || isReceiverBlocked ? "Unknown User" : receiver?.username || "Unknown User"}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-400 max-w-64 sm:max-w-80 mx-auto leading-relaxed">
                            {isCurrentUserBlocked || isReceiverBlocked ? "Bio not available" : receiver?.bio || "Lorem ipsum dolor sit amet."}
                        </p>
                    </div>
                </div>
                
                <div className="p-4 sm:p-5 lg:p-6 flex flex-col gap-6 sm:gap-8">
                    <button 
                        onClick={handleBlock}
                        className="w-full py-3 sm:py-4 px-4 sm:px-5 bg-rose-500/55 hover:bg-rose-600/80 text-white text-sm sm:text-base font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                        {isReceiverBlocked ? "Unblock User" : "Block User"}
                    </button>
                    
                    <div className="space-y-3 sm:space-y-4">
                        <label 
                            htmlFor="language" 
                            className="block text-sm sm:text-base font-medium text-white"
                        >
                            Change Language:
                        </label>
                        <select 
                            id="language" 
                            name="language" 
                            value={user.language} 
                            onChange={handleLanguageChange}
                            className="w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-slate-800/60 border border-slate-600/50 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-slate-800/80 transition-all duration-200 ease-in-out hover:bg-slate-800/70"
                        >
                            <option value="English">English (Default)</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Telugu">Telugu</option>
                            <option value="Tamil">Tamil</option>
                            <option value="Marathi">Marathi</option>
                            <option value="Garhwali">Garhwali</option>
                            <option value="Gujarati">Gujarati</option>
                            <option value="Kannada">Kannada</option>
                            <option value="Malayalam">Malayalam</option>
                            <option value="Odia">Odia</option>
                            <option value="Punjabi">Punjabi</option>
                            <option value="Urdu">Urdu</option>
                            <option value="Bengali">Bengali</option>
                        </select>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="w-full py-3 sm:py-4 px-4 sm:px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}
