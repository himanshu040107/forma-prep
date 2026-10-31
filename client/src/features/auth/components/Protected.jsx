import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from "react";
import AuthLoading from "./AuthLoading.jsx";

const Protected = ({ children }) => {
  const { authReady, user } = useAuth();
  if (!authReady) {
    return <AuthLoading />;
  }
  if (!user) {
    return <Navigate to="/login" />; 
  }
  return children;
};

export default Protected;
