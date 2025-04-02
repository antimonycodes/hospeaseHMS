import { create } from "zustand";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authorization token to requests
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

// Define store interface
interface StatsStore {
  isLoading: boolean;
  stats: Record<string, Record<string, number>>; // Supports multiple categories
  getStats: (category: string, endpoint: string) => Promise<void>;
}

// Zustand store
export const useStatsStore = create<StatsStore>((set) => ({
  isLoading: false,
  stats: {},

  getStats: async (category, endpoint) => {
    set({ isLoading: true });

    try {
      const response: AxiosResponse = await api.get(endpoint);
      set((state) => ({
        stats: { ...state.stats, [category]: response.data.data },
      }));
    } catch (error: any) {
      console.error(`Error fetching ${category} stats:`, error);
      const message =
        error.response?.data?.message || `Error fetching ${category} stats`;
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },
}));
