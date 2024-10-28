import { Notification } from "@/types/GlobalTypes";
import axios from "axios";

const API_URL = "http://167.88.33.108/api/v1/notifications";

export const NotificationService = {
  async updateViewed(token: string, notficationId: number): Promise<void> {
    await axios.put(
      `${API_URL}/read/${notficationId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  async getNotificationByUser(token: string): Promise<Notification[]> {
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};
