import React, { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";

function DashboardLayout({ onLogout }) {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <div className="app-shell">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        onLogout={onLogout}
      />

      <main className="main-content">
        <Dashboard
          showSummary={activeView === "dashboard"}
          detailedView={activeView === "orders"}
        />
      </main>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          loggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={() => setLoggedIn(true)} />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          loggedIn ? (
            <DashboardLayout onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>
      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />
    </Routes>
  );
}