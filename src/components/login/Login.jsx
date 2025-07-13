import { useCallback, useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
// import { db, storage } from "../../lib/firebase";
import { useAuth } from "../../hooks/useAuth";
// import { doc, setDoc } from "firebase/firestore";
import uploadAvatar from "../../utils/upload";

export default function Login() {
    const { signup, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState({
        file: null,
        url: "",
    });
    const [language, setLanguage] = useState("en");

    const handleAvatar = useCallback(function handleAvatar(e) {
        if (e.target.files[0])
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
    }, []);

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const { email, password } = Object.fromEntries(formData);
        try {
            await login(email, password);
        } catch (error) {
            console.log(error.code);
            if (error.code === "auth/invalid-credential") {
                toast.error("Invalid Credentials. Please try again.");
            } else {
                toast.error("Something went wrong. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const { username, email, password, language } = Object.fromEntries(formData);
        try {
            const imgUrl = avatar.file ? await uploadAvatar(avatar.file) : "./avatar.png";
            await signup(email, password, { username, avatar: imgUrl, language });
        } catch (err) {
            toast.error(err.message);
            console.log(err);
            console.log(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24 xl:gap-32 px-4 sm:px-6 lg:px-8 py-8 lg:py-0">
                <div className="flex-1 w-full max-w-md lg:max-w-none flex flex-col items-center gap-6 lg:gap-8">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-white text-center">Welcome back,</h2>
                    <form onSubmit={handleLogin} className="w-full flex flex-col items-center justify-center gap-4 lg:gap-6">
                        <input
                            type="email"
                            name="email"
                            id=""
                            placeholder="Email"
                            className="w-full px-5 py-4 border-none outline-none bg-slate-800/60 text-white placeholder-gray-400 rounded-md focus:bg-slate-800/80 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                        <input
                            type="password"
                            name="password"
                            id=""
                            placeholder="Password"
                            className="w-full px-5 py-4 border-none outline-none bg-slate-800/60 text-white placeholder-gray-400 rounded-md focus:bg-slate-800/80 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                        <button 
                            disabled={loading}
                            className="w-full px-5 py-4 border-none bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:opacity-60"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>
                </div>
                
                <div className="w-full lg:w-0.5 h-0.5 lg:h-4/5 bg-gray-600/20 hidden lg:block"></div>
                
                <div className="flex-1 w-full max-w-md lg:max-w-none flex flex-col items-center gap-6 lg:gap-8">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-white text-center">Create an account</h2>
                    <form onSubmit={handleRegister} className="w-full flex flex-col items-center justify-center gap-4 lg:gap-6">
                        <label 
                            htmlFor="avatar"
                            className="w-full flex items-center justify-between cursor-pointer text-white hover:text-gray-300 transition-colors duration-200 group"
                        >
                            <img 
                                src={avatar.url || "./avatar.png"} 
                                alt="Avatar preview" 
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-200 ring-2 ring-gray-600/30 group-hover:ring-blue-500/50"
                            />
                            <span className="underline underline-offset-2">Upload an image</span>
                        </label>
                        <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            style={{ display: "none" }}
                            onChange={handleAvatar}
                        />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="w-full px-5 py-4 border-none outline-none bg-slate-800/60 text-white placeholder-gray-400 rounded-md focus:bg-slate-800/80 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                        <input
                            type="email"
                            name="email"
                            id=""
                            placeholder="Email"
                            className="w-full px-5 py-4 border-none outline-none bg-slate-800/60 text-white placeholder-gray-400 rounded-md focus:bg-slate-800/80 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                        <input
                            type="password"
                            name="password"
                            id=""
                            placeholder="Password"
                            className="w-full px-5 py-4 border-none outline-none bg-slate-800/60 text-white placeholder-gray-400 rounded-md focus:bg-slate-800/80 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                        <div className="w-full flex flex-col gap-2">
                            <label htmlFor="language" className="text-white text-sm font-medium">Language:</label>
                            <select 
                                id="language" 
                                name="language" 
                                className="w-full px-5 py-4 border-none outline-none bg-slate-800/60 text-white rounded-md focus:bg-slate-800/80 focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer" 
                                value={language} 
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <option value="English" className="bg-slate-800 text-white">English (Default)</option>
                                <option value="Hindi" className="bg-slate-800 text-white">Hindi</option>
                                <option value="Telugu" className="bg-slate-800 text-white">Telugu</option>
                                <option value="Tamil" className="bg-slate-800 text-white">Tamil</option>
                                <option value="Marathi" className="bg-slate-800 text-white">Marathi</option>
                                <option value="Garhwali" className="bg-slate-800 text-white">Garhwali</option>
                                <option value="Gujarati" className="bg-slate-800 text-white">Gujarati</option>
                                <option value="Kannada" className="bg-slate-800 text-white">Kannada</option>
                                <option value="Malayalam" className="bg-slate-800 text-white">Malayalam</option>
                                <option value="Odia" className="bg-slate-800 text-white">Odia</option>
                                <option value="Punjabi" className="bg-slate-800 text-white">Punjabi</option>
                                <option value="Urdu" className="bg-slate-800 text-white">Urdu</option>
                                <option value="Bengali" className="bg-slate-800 text-white">Bengali</option>
                            </select>
                        </div>
                        <button 
                            disabled={loading}
                            className="w-full px-5 py-4 border-none bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:opacity-60"
                        >
                            {loading ? "Creating Account..." : "Sign Up"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
