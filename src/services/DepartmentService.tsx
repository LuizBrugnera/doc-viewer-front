import {
  Department,
  DepartmentCreate,
  DepartmentUpdate,
} from "@/types/GlobalTypes";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/departments";

export const DepartmentService = {
  async createDepartment(
    token: string,
    department: DepartmentCreate
  ): Promise<void> {
    await axios.post(`${API_URL}`, department, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

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
  async updateDepartment(
    token: string,
    department: DepartmentUpdate
  ): Promise<void> {
    await axios.put(`${API_URL}/${department.id}`, department, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async deleteDepartment(token: string, id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
