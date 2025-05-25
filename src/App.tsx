import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Archive from "./pages/Archive";
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
