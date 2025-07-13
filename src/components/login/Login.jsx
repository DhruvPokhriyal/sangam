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
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24 xl:gap-32 px-4 sm:px-6 lg:px-8 py-8 lg:py-0 overflow-y-auto">
            <div className="w-full max-w-md">
                <h2 className="text-2xl sm:text-3xl font-semibold text-white text-center mb-8">Welcome back,</h2>
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
            
            <div className="w-full max-w-md">
                <h2 className="text-2xl sm:text-3xl font-semibold text-white text-center mb-8">Create Account</h2>
                <form onSubmit={handleRegister} className="w-full flex flex-col items-center justify-center gap-4 lg:gap-6">
                    <label htmlFor="file" className="flex flex-col items-center gap-3 cursor-pointer">
                        <img 
                            src={avatar.url || "./avatar.png"} 
                            alt="Avatar" 
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-600 hover:border-blue-500 transition-colors"
                        />
                        <span className="text-sm text-gray-400">Upload an avatar</span>
                    </label>
                    <input 
                        type="file" 
                        id="file" 
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
                        placeholder="Email"
                        className="w-full px-5 py-4 border-none outline-none bg-slate-800/60 text-white placeholder-gray-400 rounded-md focus:bg-slate-800/80 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full px-5 py-4 border-none outline-none bg-slate-800/60 text-white placeholder-gray-400 rounded-md focus:bg-slate-800/80 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                    <select
                        name="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-5 py-4 border-none outline-none bg-slate-800/60 text-white rounded-md focus:bg-slate-800/80 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
                    <button 
                        disabled={loading}
                        className="w-full px-5 py-4 border-none bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:opacity-60"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
}
