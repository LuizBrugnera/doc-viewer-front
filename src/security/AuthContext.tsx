import { createContext } from "react";
import { AuthContextData } from "../types/GlobalTypes";

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export default AuthContext;
