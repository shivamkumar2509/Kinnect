import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) {
    return <Navigate to="/login" replace />;
    //replace->is to control browser history so users can’t go back to the previous (protected) page using the Back button.
  }
  return children;
};

export default ProtectedRoute;
