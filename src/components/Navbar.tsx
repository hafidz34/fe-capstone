import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaBars,
  FaHome,
  FaUserCircle,
  FaArchive,
  FaEnvelope,
} from "react-icons/fa";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Navbar({ sidebarOpen, setSidebarOpen }: NavbarProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateAuth = () => {
      setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
      setUserEmail(localStorage.getItem("userEmail"));
    };
    window.addEventListener("storage", updateAuth);
    window.addEventListener("authChange", updateAuth);
    updateAuth();
    return () => {
      window.removeEventListener("storage", updateAuth);
      window.removeEventListener("authChange", updateAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setUserEmail(null);
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-gray-800 flex items-center justify-between px-4 z-30 shadow">
        <button
          className="text-white text-lg focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Open sidebar">
          <FaBars />
        </button>
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-white text-lg" />
              <span className="text-white text-sm font-medium">
                {userEmail || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="ml-2 text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-800 shadow-lg z-20 transition-all duration-300 ${
          sidebarOpen ? "w-56" : "w-16"
        } flex flex-col pt-16`}>
        <nav className="flex-1">
          <ul className="flex flex-col items-start mt-4 space-y-2">
            {/* Home */}
            <li className="w-full">
              <Link
                to="/"
                className="flex items-center gap-2 text-white hover:text-blue-400 px-4 py-2"
                onClick={() => setSidebarOpen(false)}>
                <FaHome className="text-xl" />
                {sidebarOpen && <span className="text-md">Home</span>}
              </Link>
            </li>
            {/* Archive */}
            <li className="w-full">
              <Link
                to="/archive"
                className="flex items-center gap-2 text-white hover:text-blue-400 px-4 py-2"
                onClick={() => setSidebarOpen(false)}>
                <FaArchive className="text-xl" />
                {sidebarOpen && (
                  <span className="text-md">Archive</span>
                )}
              </Link>
            </li>
            {/* Contact */}
            <li className="w-full">
              <Link
                to="/visualisation"
                className="flex items-center gap-2 text-white hover:text-blue-400 px-4 py-2"
                onClick={() => setSidebarOpen(false)}>
                <FaEnvelope className="text-xl" />
                {sidebarOpen && (
                  <span className="text-md">Visualisasi</span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
