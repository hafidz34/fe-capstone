import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Visualisation from "./pages/Visualisation";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import Archieve from "./pages/Archieve";

function AuthHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("authChange"));
      // Remove token from URL and redirect to dashboard
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  return null;
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Responsive: close sidebar on small screens when route changes
  const location = useLocation();
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, [location]);

  return (
    <>
      <AuthHandler />
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className={`transition-all duration-300 pt-16 ${
          sidebarOpen ? "ml-56" : "ml-16"
        }`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/archive"
            element={
              <PrivateRoute>
                <Archieve />
              </PrivateRoute>
            }
          />
          <Route
            path="/visualisation"
            element={
              <PrivateRoute>
                <Visualisation />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}
