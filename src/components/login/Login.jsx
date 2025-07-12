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
        const { username, email, password } = Object.fromEntries(formData);
        try {
            const imgUrl = avatar.file ? await uploadAvatar(avatar.file) : "./avatar.png";
            await signup(email, password, { username, avatar: imgUrl });
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
            <div className="login">
                <div className="item">
                    <h2>Welcome back,</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            name="email"
                            id=""
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            name="password"
                            id=""
                            placeholder="Password"
                        />
                        <button disabled={loading}>Sign In</button>
                    </form>
                </div>
                <div className="separator"></div>
                <div className="item">
                    <h2>Create an account</h2>
                    <form onSubmit={handleRegister}>
                        <label htmlFor="avatar">
                            <img src={avatar.url || "./avatar.png"} alt="" />
                            Upload an image
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
                        />
                        <input
                            type="email"
                            name="email"
                            id=""
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            name="password"
                            id=""
                            placeholder="Password"
                        />
                        <button disabled={loading}>Sign Up</button>
                    </form>
                </div>
            </div>
        </>
    );
}
