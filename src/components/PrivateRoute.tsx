import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }: { children: React.ReactElement }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"; // Check authentication

  return isAuthenticated ? children : <Navigate to="/login" />;
}
