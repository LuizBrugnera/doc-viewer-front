import { Log } from "@/types/GlobalTypes";
import axios from "axios";

const API_URL = "http://167.88.33.108/api/v1/log";

export const LogService = {
  async createLog(
    token: string,
    userId: number,
    action: string,
    description?: string
  ): Promise<void> {
    await axios.post(
      `${API_URL}/create-log`,
      {
        userId,
        action,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  async findByUser(token: string, userId: number): Promise<Log[]> {
    const response = await axios.get(`${API_URL}/find-by-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
  async deleteLog(token: string, logId: number): Promise<void> {
    await axios.delete(`${API_URL}/delete-log/${logId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
