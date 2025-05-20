import axios from 'axios';

// Replace with your actual backend URL when available
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://rag-vercel.onrender.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ChatResponse {
  status: string;
  question: string;
  answer: string;
}

export const api = {
  // Upload a CSV file
  uploadFile: async (file: File): Promise<{ status: string; message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  // Upload JSON data
  uploadJson: async (jsonData: any): Promise<{ status: string; message: string; rows?: number; columns?: number }> => {
    const response = await apiClient.post('/upload-json', jsonData);
    return response.data;
  },
  
  // Send a question to the chatbot
  query: async (question: string): Promise<ChatResponse> => {
    const response = await apiClient.post('/query', { question });
    return response.data;
  }
};