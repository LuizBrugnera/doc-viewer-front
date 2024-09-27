import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "./UseAuth";
import AdminHomePage from "@/components/pages/AdminHomePage";
import ClientHomePage from "@/components/pages/ClientHomePage";
import DepartmentHomePage from "@/components/pages/DepartmentHomePage";

const AutorizationMiddlewareRoute: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const component = () => {
    if (user?.role === "admin") {
      return <AdminHomePage />;
    } else if (user?.role === "user") {
      return <ClientHomePage />;
    } else if (user?.role === "department") {
      return <DepartmentHomePage />;
    }
    return <ClientHomePage />;
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? component() : <Navigate to="/login" />;
};

export default AutorizationMiddlewareRoute;
