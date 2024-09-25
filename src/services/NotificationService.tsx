import { Notification } from "@/types/GlobalTypes";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/v1/notification";

export const NotificationService = {
  async updateViewed(token: string, notficationId: number): Promise<void> {
    await axios.put(`${API_URL}/update-viewed/${notficationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getNotificationByUser(token: string): Promise<Notification[]> {
    const response = await axios.get(`${API_URL}/find-by-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};
