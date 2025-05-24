import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const updateAuth = () => {
      setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
    };
    window.addEventListener("storage", updateAuth);
    window.addEventListener("authChange", updateAuth);
    return () => {
      window.removeEventListener("storage", updateAuth);
      window.removeEventListener("authChange", updateAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  return (
    <nav className="bg-blue-900 p-4 flex justify-between items-center">
      <ul className="flex space-x-4 items-center">
        <li><Link to="/" className="text-white">Upload</Link></li>
        <li><Link to="/dashboard" className="text-white">Dashboard</Link></li>
        <li><Link to="/services" className="text-white">Archive</Link></li>
      </ul>

      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </nav>
  );
}
