import { useContext } from "react";
import { AuthContextData } from "../types/GlobalTypes";
import AuthContext from "./AuthContext";

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default useAuth;
