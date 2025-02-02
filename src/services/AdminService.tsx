import { AdminUpdate } from "@/types/GlobalTypes";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/admins";

export const AdminService = {
  async updateAdmin(token: string, admin: AdminUpdate): Promise<void> {
    await axios.put(`${API_URL}/${admin.id}`, admin, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
