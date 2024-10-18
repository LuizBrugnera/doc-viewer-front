import React, { useState, ReactNode, useEffect } from "react";
import { InfoCommum, User } from "../types/GlobalTypes";
import AuthContext from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import LoadingSpinner from "@/components/LoadingSpinner";
import { AuthService } from "@/services/AuthService";

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<InfoCommum | null>(null);
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
    const getUserInfo = async (token: string) => {
      const userInfo = await AuthService.findUserInfo(token);
      setUserInfo(userInfo);
    };

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
          getUserInfo(storagedToken);
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

    AuthService.findUserInfo(token).then((userInfo) => {
      setUserInfo(userInfo);
    });

    localStorage.setItem("@AppName:token", token);
    localStorage.setItem("@AppName:user", JSON.stringify(userData));
  };

  const updateDataToken = (token: string) => {
    const userData = jwtDecode<User>(token);
    setUser(userData);
    setToken(token);
    setIsAuthenticated(true);

    AuthService.findUserInfo(token).then((userInfo) => {
      setUserInfo(userInfo);
    });

    localStorage.setItem("@AppName:token", token);
    localStorage.setItem("@AppName:user", JSON.stringify(userData));
  };

  const signOut = () => {
    setUser(null);
    setUserInfo(null);
    setToken(null);
    setIsAuthenticated(false);

    localStorage.removeItem("@AppName:token");
    localStorage.removeItem("@AppName:user");
  };

  if (isLoading) {
    return <LoadingSpinner size={64} />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signIn,
        signOut,
        isAuthenticated,
        isLoading,
        updateDataToken,
        userInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
