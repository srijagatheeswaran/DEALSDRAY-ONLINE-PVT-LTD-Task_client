import './App.css';
import { ToastProvider } from './context/ToastContext';
import CreateEmployee from './pages/createEmployee/createEmployee';
import Dashboard from './pages/dashboard/dashboard';
import EmployeeList from './pages/employeeList/employeeList';
import Login from './pages/login/login';
import UpdateEmployee from './pages/updateEmployee/updateEmployee';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/EmployeeList" element={<EmployeeList />} />
            <Route path="/CreateEmployee" element={<CreateEmployee />} />
            <Route path="/updateEmployee/:email" element={<UpdateEmployee />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>

    </>
  );
}

export default App;
