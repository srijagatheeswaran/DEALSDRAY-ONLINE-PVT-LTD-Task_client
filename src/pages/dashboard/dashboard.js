import Header from "../../component/header/header";
import Loader from "../../component/loader/loader";
import Navigation from "../../component/navigation/navigation";
import { MenuProvider } from "../../context/menuContext";
import "./dashboard.css"
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";



export default function Dashboard() {
    const [loader, setLoader] = useState(true)
    const navigate = useNavigate()
    const { isAuthenticated, checkAuth } = useAuth();
    const token = localStorage.getItem("token")

    useEffect(()=>{
        const handleLogin = async () => {
            const isValid = await checkAuth(token);
            if (isValid) {
                setLoader(false)
            } else{
                setLoader(false)
                navigate("/login")
            }
        };
        handleLogin()
    },[])





    return <>
        <MenuProvider>
            <Header />
            <div>
                <Navigation/>
                <div className="pageTitle">
                    <p>Dashboard</p>
                </div>
                <div className="dashBoardPanel">
                    Welcome Admin Panel
                </div>
            </div>
            {loader?<Loader/>:null}
        </MenuProvider>
    </>
}