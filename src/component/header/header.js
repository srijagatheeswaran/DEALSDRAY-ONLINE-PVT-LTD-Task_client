import { useContext } from "react"
import "./header.css"
import { MenuContext } from "../../context/menuContext"



export default function Header() {

    const {toggleNav }=useContext(MenuContext)

    return <>
        <div className="header">
            <h1>logo</h1>
            <i className="bi bi-list" onClick={toggleNav}></i>
        </div>
    </>
}