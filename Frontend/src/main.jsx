import './index.css'
import React  from 'react';
import App from './App.jsx'
import { AuthProvider } from "./contexts/AuthContext";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
