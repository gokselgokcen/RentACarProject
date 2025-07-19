// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [userRole, setUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role =
          decoded.role ||
          decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        setUserRole(role);
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
        setUserRole("");
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserRole("");
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleRegisterSuccess = () => {
    setIsLoggedIn(true);
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-3"></div>
          <h3 className="text-gradient fw-bold">Rent a Car</h3>
          <p className="text-muted">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate
                  to={userRole === "Admin" ? "/admin" : "/"}
                  replace
                />
              ) : (
                <LoginForm 
                  onLoginSuccess={handleLoginSuccess}
                  switchToRegister={() => window.location.href = '/register'}
                />
              )
            }
          />

          <Route
            path="/register"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <RegisterForm 
                  onRegisterSuccess={handleRegisterSuccess}
                  switchToLogin={() => window.location.href = '/login'}
                />
              )
            }
          />

          <Route
            path="/admin"
            element={
              isLoggedIn && userRole === "Admin" ? (
                <AdminPanel onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/"
            element={
              isLoggedIn ? (
                userRole === "Admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Dashboard onLogout={handleLogout} />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="*"
            element={
              isLoggedIn ? (
                <Navigate
                  to={userRole === "Admin" ? "/admin" : "/"}
                  replace
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
