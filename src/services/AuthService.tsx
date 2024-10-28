import axios from "axios";
import {
  DepartmentCreate,
  EmailLogin,
  InfoCommum,
  LoginData,
  RegisterData,
} from "../types/GlobalTypes";
// http://167.88.33.108/api/
const API_URL = "http://localhost:3000/api/v1/auth";

export const AuthService = {
  login: {
    async user(data: LoginData): Promise<string> {
      const response = await axios.post(`${API_URL}/user/login`, data);
      return response.data;
    },
    async admin(data: EmailLogin): Promise<string> {
      const response = await axios.post(`${API_URL}/admin/login`, data);
      return response.data;
    },
    async department(data: EmailLogin): Promise<string> {
      const response = await axios.post(`${API_URL}/department/login`, data);
      return response.data;
    },
  },

  register: {
    async user(data: RegisterData): Promise<string> {
      const response = await axios.post(`${API_URL}/user/register`, data);
      return response.data;
    },
    async admin(data: EmailLogin, token: string): Promise<string> {
      const response = await axios.post(`${API_URL}/admin/register`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    async department(data: DepartmentCreate, token: string): Promise<string> {
      const response = await axios.post(
        `${API_URL}/department/register`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
  },

  async findUserInfo(token: string): Promise<InfoCommum> {
    const response = await axios.get(`${API_URL}/user-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
