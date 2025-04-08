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

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface InventoryStats {
  total_inventories: number;
  total_categories: number;
  total_expired_items: number;
}

interface InventoryStore {
  isLoading: boolean;
  stats: InventoryStats;
  stocks: any[];
  pagination: Pagination | null;
  getInventoryStats: () => Promise<void>;
  getAllStocks: (endpoint?: string) => Promise<void>;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  stats: {
    total_inventories: 0,
    total_categories: 0,
    total_expired_items: 0,
  },
  isLoading: false,
  pagination: null,
  stocks: [],

  getInventoryStats: async () => {
    set({ isLoading: true });
    const statsData = {
      total_inventories: 0,
      total_categories: 0,
      total_expired_items: 0,
    };
    try {
      const response = await api.get("/inventory/stats");
      if (!response.data) {
        console.error("No data returned from API");
        throw new Error("Empty response from server");
      }
      console.log("Raw API Response:", response.data);
      Object.assign(statsData, response.data);
      set({ stats: statsData as InventoryStats });
      toast.success("Inventory stats fetched successfully!");
    } catch (error: any) {
      console.error("Stats fetch error:", error);
      toast.error(error.message || "Failed to fetch stats");
      set({ stats: statsData });
    } finally {
      set({ isLoading: false });
    }
  },
  getAllStocks: async (endpoint = "/inventory/all-inventory-items") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      set({ pagination: response.data.data.pagination });
      console.log(response.data.data.pagination, "pagination");
      const fetchedStocks = response.data.data.data;
      set({ stocks: fetchedStocks });
      console.log(response.data.message);
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch patients");
    } finally {
      set({ isLoading: false });
    }
  },
}));
