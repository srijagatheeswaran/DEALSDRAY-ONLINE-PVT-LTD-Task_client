import { useContext } from "react"
import "./navigation.css"
import { MenuContext } from "../../context/menuContext"
import { Link, useNavigate } from "react-router-dom";


export default function Navigation(){
    const {isNavVisible}=useContext(MenuContext)
    const navigate =useNavigate()
    const username=localStorage.getItem("username");


    function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        navigate("/login")
    }


return<>
    <nav className={isNavVisible ? "show" : ""}>
        <ul>
            <Link to="/home">
            <li >Home</li>
            </Link>
            <Link to="/EmployeeList">
            <li >Employee List</li>
            </Link>
        </ul>
        <div>
            <p className="username">{username}</p>
            <button className="btn btn-danger" onClick={logout} >Logout</button>
        </div>
    </nav>
    </>
}