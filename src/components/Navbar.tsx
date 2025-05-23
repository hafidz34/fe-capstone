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
    window.addEventListener("authChange", updateAuth); // Listen for custom event
    return () => {
      window.removeEventListener("storage", updateAuth);
      window.removeEventListener("authChange", updateAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("authChange")); // Add this line
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4 items-center">
        <li>
          <Link to="/" className="text-white">
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className="text-white">
            About
          </Link>
        </li>
        <li>
          <Link to="/services" className="text-white">
            Services
          </Link>
        </li>
        <li>
          <Link to="/contact" className="text-white">
            Contact
          </Link>
        </li>
        {isAuthenticated && (
          <li>
            <button
              onClick={handleLogout}
              className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
