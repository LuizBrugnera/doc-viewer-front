import { UserCustomer, UserInfo } from "@/types/GlobalTypes";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/v1/user";

export const UserService = {
  async updateInfo(token: string, userData: UserInfo): Promise<void> {
    await axios.put(`${API_URL}/update-info`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async findByDepartment(token: string): Promise<UserCustomer[]> {
    const response = await axios.get(`${API_URL}/find-by-department`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};
