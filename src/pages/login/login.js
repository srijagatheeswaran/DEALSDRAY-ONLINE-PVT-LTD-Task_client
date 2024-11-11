import { useState ,useEffect} from "react";
import "./login.css";
import Header from "../../component/header/header";
import { useNavigate } from "react-router-dom";
import Loader from "../../component/loader/loader"
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";


export default function Login() {
    const {showErrorToast,showSuccessToast}=useToast()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loader, setLoader] = useState(true)
    const navigate = useNavigate()
    const { isAuthenticated, checkAuth } = useAuth();
    // const username = localStorage.getItem("username")
    const token = localStorage.getItem("token")

    useEffect(()=>{
        const handleLogin = async () => {
            const isValid = await checkAuth(token);
            if (isValid) {
                navigate("/home")
                setLoader(false)
            } else{
                setLoader(false)

            }
        };
        handleLogin()
    },[])



    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoader(true)
        try {

            const response = await fetch('https://employee-data-admin.onrender.com/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // alert("Login successful");
                const userName =localStorage.setItem("username",data.username)
                const token =localStorage.setItem("token",data.token)
                navigate("/home")
                showSuccessToast("Login successful")
            } else {
                // alert(`Login failed: ${data.message}`);
                showErrorToast(data.message)
            }
        } catch (error) {
            console.error("Error during login:", error);
            // alert("An error occurred. Please try again later.");
            showErrorToast(error)

        } finally {
            setLoader(false)
        }
    };

    return (
        <>
            <div className="main">
                <Header />
                <div className="login-container">
                    <h2>Admin Login</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button className="button"type="submit">Login</button>
                        {loader ? <Loader /> : null}
                    </form>
                </div>
            </div>
        </>
    );
}
