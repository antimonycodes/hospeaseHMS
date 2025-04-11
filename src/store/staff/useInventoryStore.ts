import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface InventoryStore {
  isLoading: boolean;
  requests: any[]; // Define the 'requests' property
  getAllRequest: (endpoint?: string) => Promise<void>;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  isLoading: false,
  requests: [],

  getAllRequest: async (
    endpoint = "/inventory/requests/all-records?status=pending"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      const fetchedRequests = response.data.data || [];
      set({ requests: fetchedRequests });
      console.log(response.data.message);
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(error.response?.data?.message || "Failed to fetch expenses");
      set({ requests: [] });
    } finally {
      set({ isLoading: false });
    }
  },
}));
