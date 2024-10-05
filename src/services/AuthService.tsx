import axios from "axios";
import { LoginData, RegisterData } from "../types/GlobalTypes";

const API_URL = "http://167.88.33.108/api/v1/auth";

export const AuthService = {
  async login(data: LoginData): Promise<string> {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  },

  async loginCpf(data: { cpf: string; password: string }): Promise<string> {
    const response = await axios.post(`${API_URL}/login-cpf`, data);
    return response.data;
  },

  async loginCnpj(data: { cnpj: string; password: string }): Promise<string> {
    const response = await axios.post(`${API_URL}/login-cnpj`, data);
    return response.data;
  },

  async register(data: RegisterData): Promise<string> {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  },

  async generateCode(email: string): Promise<void> {
    await axios.post(`${API_URL}/generate-code`, { email });
  },

  async verifyCode(email: string, code: string): Promise<string> {
    const response = await axios.post(`${API_URL}/verify-code`, {
      email,
      code,
    });
    return response.data.token;
  },

  async updateDataToken(token: string): Promise<string> {
    const response = await axios.post(`${API_URL}/update-data-token`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.token;
  },

  async changePassword(
    token: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    await axios.post(
      `${API_URL}/change-password`,
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  async resetPassword(
    email: string,
    token: string,
    password: string
  ): Promise<void> {
    await axios.post(`${API_URL}/reset-password`, {
      email,
      token,
      password,
    });
  },
};
