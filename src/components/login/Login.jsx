import { useCallback, useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
    const { user, signup, login } = useAuth();
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

    function handleLogin(e) {
        e.preventDefault();
        toast.success("Hello");
    }

    async function handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const { username, email, password } = Object.fromEntries(formData);
        try {
            await signup(email, password);
        } catch (err) {
            toast.error(err.message);
            console.log(err);
            console.log(err.message);
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
                        <button>Sign In</button>
                    </form>
                </div>
                <div className="separator"></div>
                <div className="item">
                    <h2>Create an account</h2>
                    <form onSubmit={handleRegister}>
                        <label htmlFor="file">
                            <img src={avatar.url || "./avatar.png"} alt="" />
                            Upload an image
                        </label>
                        <input
                            type="file"
                            name="file"
                            id="file"
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
                        <button>Sign Up</button>
                    </form>
                </div>
            </div>
        </>
    );
}
