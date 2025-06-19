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
    const token = Cookies.get("hhmstxt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface InventoryStore {
  isLoading: boolean;
  requests: any[];
  getAllRequest: (endpoint?: string) => Promise<void>;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  isLoading: false,
  requests: [],

  getAllRequest: async (
    endpoint = "/inventory/requests/all-records",
    page = "1",
    perPage = "1000"
  ) => {
    set({ isLoading: true });
    try {
      const separator = endpoint.includes("?") ? "&" : "?";
      const fullEndpoint = endpoint.includes("page=")
        ? endpoint
        : `${endpoint}${separator}page=${page}&per_page=${perPage}`;

      const response = await api.get(fullEndpoint);

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
