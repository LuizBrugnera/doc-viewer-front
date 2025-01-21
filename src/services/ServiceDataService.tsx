import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/service-datas";

interface ServiceDataUpdate {
  id: number;
  cod: string;
  name: string;
  sellValue: string;
  description: string;
  duration: string | null;
}

interface ServiceData {
  id: number;
  cod: string;
  name: string;
  sellValue: string;
  description: string;
  duration: string | null;
}

export const ServiceDataService = {
  async findAllServiceData(token: string): Promise<ServiceData[]> {
    const response = await axios.get(`${API_URL}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async updateServiceData(
    token: string,
    serviceData: ServiceDataUpdate
  ): Promise<void> {
    await axios.put(`${API_URL}/${serviceData.id}`, serviceData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async deleteServiceData(token: string, id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
