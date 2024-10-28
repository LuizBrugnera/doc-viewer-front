import { User, UserInfo } from "@/types/GlobalTypes";
import axios from "axios";

const API_URL = "http://167.88.33.108/api/v1/users";

export const UserService = {
  async createUser(token: string, userData: UserInfo): Promise<void> {
    await axios.post(`${API_URL}/`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async findAllUsers(token: string): Promise<User[]> {
    const response = await axios.get(`${API_URL}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async deleteUser(token: string, userId: number): Promise<void> {
    await axios.delete(`${API_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async updateInfo(token: string, userData: UserInfo): Promise<void> {
    await axios.put(`${API_URL}/${userData.id}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async updateUserByAdmin(token: string, userData: UserInfo): Promise<void> {
    await axios.post(`${API_URL}/update-department`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async updateUserByAdminClient(
    token: string,
    userData: UserInfo
  ): Promise<void> {
    await axios.post(`${API_URL}/update-client`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
