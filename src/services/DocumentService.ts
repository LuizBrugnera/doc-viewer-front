import { Category, Document, DocumentMetaData } from "@/types/GlobalTypes";
import axios, { AxiosResponse } from "axios";

const API_URL = "http://167.88.33.108/api/v1/documents";

export const DocumentService = {
  async uploadFile(
    token: string,
    userId: number,
    formData: FormData
  ): Promise<DocumentMetaData> {
    return (
      await axios.post(`${API_URL}/upload/file/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
    ).data as DocumentMetaData;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async uploadFileFast(token: string, formData: FormData): Promise<any> {
    return await axios.post(`${API_URL}/upload/auto-assign`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async getFilesByUser(token: string): Promise<Document[]> {
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async getAllDocuments(token: string): Promise<Document[]> {
    const response = await axios.get(`${API_URL}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async downloadFile(
    token: string,
    documentId: number,
    userId?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<AxiosResponse<any, any>> {
    const response = await axios.get(
      `${API_URL}/download/${documentId}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        responseType: "blob",
      }
    );

    return response;
  },

  async getFilesByUserDepartment(token: string): Promise<Document[]> {
    const response = await axios.get(`${API_URL}/department`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async deleteFile(token: string, documentId: number): Promise<void> {
    await axios.delete(`${API_URL}/${documentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getFilesByUserWithFolderFormat(token: string): Promise<Category[]> {
    const response = await axios.get(`${API_URL}/folder-format`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async discartDocument(
    token: string,
    documentId: number,
    logId: number
  ): Promise<void> {
    await axios.delete(`${API_URL}/discart/${documentId}/${logId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async holdDocument(
    token: string,
    documentId: number,
    logId: number
  ): Promise<void> {
    await axios.post(
      `${API_URL}/hold/${documentId}/${logId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};
