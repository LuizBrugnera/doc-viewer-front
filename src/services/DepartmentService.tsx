import { Department } from "@/types/GlobalTypes";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/departments";

export const DepartmentService = {
  async findByDepartment(token: string): Promise<Department[]> {
    const response = await axios.get(`${API_URL}/by-department`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async findAllDepartaments(token: string): Promise<Department[]> {
    const response = await axios.get(`${API_URL}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};
