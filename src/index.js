import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MenuProvider } from "./context/menuContext";
import { AuthProvider } from './context/AuthContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <MenuProvider>
      <App />
      </MenuProvider>
    </AuthProvider>


  </React.StrictMode>
);

reportWebVitals();
