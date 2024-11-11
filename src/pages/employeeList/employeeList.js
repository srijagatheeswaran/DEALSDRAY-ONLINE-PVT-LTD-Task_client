import Header from "../../component/header/header";
import Navigation from "../../component/navigation/navigation";
import { MenuProvider } from "../../context/menuContext";
import "./employeeList.css"
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import Loader from "../../component/loader/loader"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";






export default function EmployeeList() {
    const [loader, setLoader] = useState(true)
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [reload, setReload] = useState(false)
    const [searchTerm, setSearchTerm] = useState("");
    const { isAuthenticated, checkAuth } = useAuth();
    const [sortConfig, setSortConfig] = useState({ field: "id", direction: "asc" });
    const token = localStorage.getItem("token")

    useEffect(() => {
        const handleLogin = async () => {
            setLoader(true)
            const isValid = await checkAuth(token);
            if (isValid) {
                setLoader(false)
            } else {
                setLoader(false)
                navigate("/login")
            }
        };
        handleLogin()
    }, [])


    const fetchEmployees = async () => {
        setLoader(true)
        try {
            const response = await fetch('http://localhost:4000/api/employee/employees');
            if (response.ok) {
                const data = await response.json();
                setEmployees(data);
            } else {
                console.error('Failed to fetch employees');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoader(false)
        }
    };

    useEffect(() => {

        fetchEmployees();
    }, [reload]);
    const handleEdit = (email) => {
        navigate(`/updateEmployee/${email}`);
    };
    const handleDelete = async (email, event) => {
        event.preventDefault();

        try {
            setLoader(true)
            const response = await fetch('http://localhost:4000/api/employee/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Delete successful");
                setReload(!reload)

            } else {
                alert(`Login failed: ${data.message}`);
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred. Please try again later.");
        } finally {
            setLoader(false)
        }

    }
    const searchEmployees = async (query) => {
        setLoader(true);
        try {
            const response = await fetch(`http://localhost:4000/api/employee/search?name=${query}`);
            if (response.ok) {
                const data = await response.json();
                setEmployees(data);
            } else {
                console.error('Failed to search employees');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoader(false);
        }
    };
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        if (query) {
            searchEmployees(query);
        } else {
            fetchEmployees();
        }
    };
    const handleSort = (field) => {
        let direction = "asc";
        if (sortConfig.field === field && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ field, direction });

        const sortedEmployees = [...employees].sort((a, b) => {
            if (a[field] < b[field]) return direction === "asc" ? -1 : 1;
            if (a[field] > b[field]) return direction === "asc" ? 1 : -1;
            return 0;
        });
        setEmployees(sortedEmployees);
    };


    return <>
        <MenuProvider>
            <Header />
            <div>
                {loader ? <Loader /> : null}
                <Navigation />
                <div className="pageTitle">
                    <p>Employee List</p>
                </div>
                <div className="CreateEmployee">
                    <p>Total Count:{employees.length}</p>
                    <Link to="/CreateEmployee">
                        <button>Create Employee</button>
                    </Link>
                </div>
                <div className="searchBox">
                    <label>Search</label>
                    <input placeholder="Enter Search Keyword" value={searchTerm}
                        onChange={handleSearchChange} />
                </div>
                <div className="employeePanel">
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort("_id")}>Unique Id {sortConfig.field === "_id" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}</th>
                                <th>Image</th>
                                <th onClick={() => handleSort("name")}>Name {sortConfig.field === "name" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}</th>
                                <th onClick={() => handleSort("email")}>Email {sortConfig.field === "email" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}</th>
                                <th>Mobile No</th>
                                <th>Designation</th>
                                <th>Gender</th>
                                <th>Course</th>
                                <th onClick={() => handleSort("createDate")}>Create Date {sortConfig.field === "createDate" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {employees.length === 0 ? (
                                <tr>
                                    <td colSpan="10" style={{ textAlign: 'center' }}>
                                        No employees found
                                    </td>
                                </tr>
                            ) : (
                                employees.map((employee, index) => (
                                    <tr key={employee._id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img
                                                src={employee.imgstore || "https://www.pngfind.com/pngs/b/110-1102775_download-empty-profile-hd-png-download.png"}
                                                alt={employee.name}

                                            />
                                        </td>
                                        <td>{employee.name}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.mobile_number}</td>
                                        <td>{employee.designation}</td>
                                        <td>{employee.gender}</td>
                                        <td>{employee.course}</td>
                                        <td>{employee.createDate}</td>
                                        <td>
                                            <i className="bi bi-pencil-square" onClick={() => handleEdit(employee.email)}></i>
                                            <i className="bi bi-trash" onClick={(e) => handleDelete(employee.email, e)} ></i>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MenuProvider>
    </>
}