import { Category, Document, DocumentMetaData } from "@/types/GlobalTypes";
import axios, { AxiosResponse } from "axios";

const API_URL = "http://167.88.33.108/api/v1/document";

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

  async uploadFileFast(
    token: string,
    formData: FormData
  ): Promise<DocumentMetaData> {
    return (
      await axios.post(`${API_URL}/upload-file-fast`, formData, {
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
    documentId: number,
    userId?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<AxiosResponse<any, any>> {
    const response = await axios.get(
      `${API_URL}/download-file/${documentId}/${userId}`,
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

  async getFilesByUserWithFolderFormat(token: string): Promise<Category[]> {
    const response = await axios.get(
      `${API_URL}/get-files-by-user-with-folder-format`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  async uploadFiles(token: string, formData: FormData): Promise<void> {
    await axios.post(`${API_URL}/upload-files`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
