import { Document, DocumentMetaData } from "@/types/GlobalTypes";
import axios, { AxiosResponse } from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/v1/document";

export const DocumentService = {
  async uploadFile(
    token: string,
    userId: number,
    formData: FormData
  ): Promise<DocumentMetaData> {
    return (
      await axios.post(`${API_URL}/upload-file/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
    ).data as DocumentMetaData;
  },

  async getFilesByUser(token: string): Promise<Document[]> {
    const response = await axios.get(`${API_URL}/get-files-by-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async downloadFile(
    token: string,
    documentId: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<AxiosResponse<any, any>> {
    const response = await axios.get(`${API_URL}/download-file/${documentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });

    return response;
  },

  async getFilesByUserDepartment(token: string): Promise<Document[]> {
    const response = await axios.get(
      `${API_URL}/get-files-by-user-department`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  async deleteFile(token: string, documentId: number): Promise<void> {
    await axios.delete(`${API_URL}/delete-file/${documentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
