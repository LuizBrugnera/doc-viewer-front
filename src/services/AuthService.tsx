import axios from "axios";
import { LoginData, RegisterData } from "../types/GlobalTypes";

const API_URL = import.meta.env.VITE_API_URL + "/api/v1/auth";

export const AuthService = {
  async login(data: LoginData): Promise<string> {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  },

  async register(data: RegisterData): Promise<string> {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  },
};
