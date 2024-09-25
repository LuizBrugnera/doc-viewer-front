import React, { useState, ReactNode, useEffect } from "react";
import { User } from "../types/GlobalTypes";
import AuthContext from "./AuthContext";
import { jwtDecode } from "jwt-decode";

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const isTokenValid = (token: string): boolean => {
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      if (exp && Date.now() >= exp * 1000) {
        return false;
      }
      return true;
    } catch (error) {
      console.log("Erro ao validar o token:", error);
      return false;
    }
  };

  useEffect(() => {
    const storagedToken = localStorage.getItem("@AppName:token");
    const storagedUser = localStorage.getItem("@AppName:user");

    if (
      storagedToken === "undefined" ||
      storagedUser === "undefined" ||
      storagedToken === "null" ||
      storagedUser === "null"
    ) {
      signOut();
      return;
    }

    if (storagedToken && storagedUser) {
      try {
        if (isTokenValid(storagedToken)) {
          setToken(storagedToken);
          setUser(JSON.parse(storagedUser));
          setIsAuthenticated(true);
        } else {
          signOut();
        }
      } catch (error) {
        console.log("Erro ao processar o token ou usuário:", error);
        signOut();
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = (token: string) => {
    const userData = jwtDecode<User>(token);
    setUser(userData);
    setToken(token);
    setIsAuthenticated(true);

    localStorage.setItem("@AppName:token", token);
    localStorage.setItem("@AppName:user", JSON.stringify(userData));
  };

  const updateDataToken = (token: string) => {
    const userData = jwtDecode<User>(token);
    setUser(userData);
    setToken(token);
    setIsAuthenticated(true);

    localStorage.setItem("@AppName:token", token);
    localStorage.setItem("@AppName:user", JSON.stringify(userData));
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);

    localStorage.removeItem("@AppName:token");
    localStorage.removeItem("@AppName:user");
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ user, token, signIn, signOut, isAuthenticated, isLoading, updateDataToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
