import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/" // ini seharusnya gk diganti karena abis login kan hal upload
          element={
            <PrivateRoute>
              <Upload /*ini disesuain */ /> 
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
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
              <Archive /*ini disesuain */ />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
