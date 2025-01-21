import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "./UseAuth";
import AdminHomePage from "@/components/pages/AdminHomePage";
import ClientHomePage from "@/components/pages/ClientHomePage";
import DepartmentHomePage from "@/components/pages/DepartmentHomePage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ExamesPage } from "@/components/pages/ExamesPage";
import OsControllPage from "@/components/pages/OsControllPage";

const AutorizationMiddlewareRoute: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const component = () => {
    if (user?.role === "admin") {
      return <AdminHomePage />;
    } else if (user?.role === "user") {
      return <ClientHomePage />;
    } else if (user?.role === "department") {
      if (user?.department === "exames") {
        return <ExamesPage />;
      }
      if (user?.department === "os") {
        return <OsControllPage />;
      }
      return <DepartmentHomePage />;
    }
    return <ClientHomePage />;
  };

  if (isLoading) {
    return <LoadingSpinner size={64} />;
  }

  return isAuthenticated ? component() : <Navigate to="/login" />;
};

export default AutorizationMiddlewareRoute;
