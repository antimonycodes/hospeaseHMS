import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

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

export interface InventoryStats {
  total_inventories: number;
  total_categories: number;
  total_expired_items: number;
}

interface InventoryStore {
  isLoading: boolean;
  stats: InventoryStats | null;
  getInventoryStats: () => Promise<void>;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  stats: null,
  isLoading: false,

  getInventoryStats: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/inventory/stats");
      console.log("Raw API Response:", response.data); // Debug raw response
      const statsData = response.data || {
        total_inventories: 0,
        total_categories: 0,
        total_expired_items: 0,
      };
      set({ stats: statsData });
      console.log("Inventory Stats fetched:", statsData);
      toast.success("Inventory stats fetched successfully!");
    } catch (error: any) {
      console.error("Stats fetch error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch stats");
      set({ stats: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
