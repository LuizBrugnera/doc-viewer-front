import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "./UseAuth";
import AdminHomePage from "@/components/pages/AdminHomePage";
import ClientHomePage from "@/components/pages/ClientHomePage";

const AdminOrClientRoute: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const component =
    user?.role === "admin" ? <AdminHomePage /> : <ClientHomePage />;

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? component : <Navigate to="/login" />;
};

export default AdminOrClientRoute;
