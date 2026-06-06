import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ secretPath }) => {
  const isAuthenticated =
    localStorage.getItem("isAdminAuthenticated") === "true";

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={`/${secretPath}/login`} replace />
  );
};

export default ProtectedRoute;
