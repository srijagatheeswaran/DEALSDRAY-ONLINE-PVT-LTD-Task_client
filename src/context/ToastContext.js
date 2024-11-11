// ToastContext.js
import React, { createContext, useContext } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create a context
const ToastContext = createContext();

// Custom provider component
export const ToastProvider = ({ children }) => {
    // Function to show an error toast with custom settings
    const showErrorToast = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    
    };
    const showSuccessToast=(message)=>{
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
            });
    }

    return (
        <ToastContext.Provider value={{ showErrorToast ,showSuccessToast}}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
