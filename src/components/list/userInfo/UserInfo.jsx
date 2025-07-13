import "./userInfo.css";
import { useAuth } from "../../../hooks/useAuth";


export default function UserInfo() {

    const { user, logout } = useAuth();

    function handleLogout() {
        logout(); 
    }

    return (
        <div className="p-4 sm:p-5 flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="flex items-center gap-3 sm:gap-5">
                <img 
                    src={user.avatar || "./avatar.png"} 
                    alt="User avatar" 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/20 shadow-lg"
                />
                <h2 className="text-sm sm:text-base font-medium text-white truncate max-w-[120px] sm:max-w-none">
                    {user.username}
                </h2>
            </div>
            <div className="logout">
                <button 
                    onClick={handleLogout}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-red-500/80 hover:bg-red-500 active:bg-red-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}