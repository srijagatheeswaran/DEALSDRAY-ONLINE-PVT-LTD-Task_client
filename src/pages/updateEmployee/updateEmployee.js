import { useState, useEffect ,useRef,useContext} from "react";
import Header from "../../component/header/header";
import Navigation from "../../component/navigation/navigation";
import "./updateEmployee.css"
import Loader from "../../component/loader/loader"
import { useParams } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";


export default function UpdateEmployee() {
    const {showErrorToast,showSuccessToast}=useToast()
    const { email } = useParams();
    const [loader, setLoader] = useState(true)
    const fileInputRef = useRef(null); 
    const [errors, setErrors] = useState({});
    const [reload,setReload] =useState(false)
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

    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile_number: '',
        designation: '',
        gender: '',
        course: '',
        imgstore: 'https://www.pngfind.com/pngs/b/110-1102775_download-empty-profile-hd-png-download.png'
    });
    

    useEffect(() => {
        const fetchEmployeeData = async () => {
            if (!email) return;  

            setLoader(true); 

            try {
                const response = await fetch(`http://localhost:4000/api/employee/employees/${email}`);
                if (response.ok) {
                    const data = await response.json();
                    
                    setFormData({
                        name: data.name,
                        email: data.email,
                        mobile_number: data.mobile_number,
                        designation: data.designation,
                        gender: data.gender,
                        course: data.course,
                        imgstore: data.imgstore,
                    });
                    
                } else {
                    console.error('Failed to fetch employee data');
                }
            } catch (error) {
                console.error('Error fetching employee data:', error);
            } finally {
                setLoader(false);  
            }
        };

        fetchEmployeeData();  
    }, [reload]);


    const validateField = (name, value) => {
        let errorMessage = '';
        switch (name) {
            case 'name':
                if (value.trim() === '') errorMessage = 'Name is required';
                break;
            case 'email':
                if (!/\S+@\S+\.\S+/.test(value)) errorMessage = 'Invalid email address';
                break;
            case 'mobile_number':
                if (!/^[0-9]{10}$/.test(value)) errorMessage = 'Mobile number must be 10 digits';
                break;
            case 'designation':
                if (value === '') errorMessage = 'Please select a designation';
                break;
            case 'gender':
                if (value === '') errorMessage = 'Please select gender';
                break;
            case 'course':
                if (value === '') errorMessage = 'Please select a course';
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMessage,
        }));

        return errorMessage === '';
    };

    const handleChange = (event) => {
        const { name, value, type, files } = event.target;
        if (type === 'file') {
            const file = files[0];
            if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData((prevData) => ({
                        ...prevData,
                        imgstore: reader.result
                    }));
                    validateField(name, reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    imgstore: 'Only JPG/PNG formats allowed',
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
            validateField(name, value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const isFormValid = Object.keys(formData).every((key) => validateField(key, formData[key]));
        if (isFormValid) {
            // console.log(formData)
            try {
                setLoader(true)
                const response = await fetch('http://localhost:4000/api/employee/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ formData }),
                });

                const data = await response.json();

                if (response.ok) {
                    // alert("Update successful");
                    showSuccessToast("Update successful")
                    setErrors({});
                    setReload(!reload)

                } else {
                    // alert(`Login failed: ${data.message}`);
                    showErrorToast(data.message)
                }
            } catch (error) {
                console.error("Error during login:", error);
                showErrorToast(error)
                // alert("An error occurred. Please try again later.");
            } finally {
                setLoader(false)
            }

        }
    };

    return (<>
        <Header />
        <div>
            <Navigation />
            <div className="pageTitle">
                <p>Update Employee</p>
            </div>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}

                    />
                    {errors.name && <span className="error">{errors.name}</span>}

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled

                    />
                    {errors.email && <span className="error">{errors.email}</span>}

                    <label htmlFor="mobile">Mobile No</label>
                    <input
                        type="tel"
                        id="mobile"
                        name="mobile_number"
                        value={formData.mobile_number}
                        onChange={handleChange}

                    />
                    {errors.mobile_number && <span className="error">{errors.mobile_number}</span>}

                    <label htmlFor="designation">Designation</label>
                    <select
                        id="designation"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}

                    >
                        <option value="">Select</option>
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="Sales">Sales</option>
                    </select>
                    {errors.designation && <span className="error">{errors.designation}</span>}

                    <label>Gender</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={formData.gender === 'Male'}
                                onChange={handleChange}
                            /> Male
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={formData.gender === 'Female'}
                                onChange={handleChange}
                            /> Female
                        </label>
                    </div>
                    {errors.gender && <span className="error">{errors.gender}</span>}

                    <label>Course</label>
                    <div className="checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="course"
                                value="MCA"
                                checked={formData.course === 'MCA'}
                                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                            /> MCA
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="course"
                                value="BCA"
                                checked={formData.course === 'BCA'}
                                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                            /> BCA
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="course"
                                value="BSC"
                                checked={formData.course === 'BSC'}
                                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                            /> BSC
                        </label>
                    </div>
                    {errors.course && <span className="error">{errors.course}</span>}

                    <img src={formData.imgstore} />
                    <label htmlFor="imgUpload">Upload Image</label>
                    <input
                        type="file"
                        id="imgUpload"
                        name="imgstore"
                        accept=".jpg, .png"
                        onChange={handleChange}
                        ref={fileInputRef}
                    />
                    {/* {errors.imgstore && <span className="error">{errors.imgstore}</span>} */}

                    <button type="submit">Submit</button>
                </form>
                {loader ? <Loader /> : null}
            </div>
        </div>
    </>
    );
}
