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
export interface Stock {
  id: number;
  attributes: {
    item_name: string;
    category: string;
    quantity: string;
    Card_id: string;
    first_name: string;
    last_name: string;
  };
}

export interface Staff {
  id: number;
  attributes: {
    first_name: string;
    last_name: string;
    card_id: string;
  };
}

interface Request {
  id: number;
  requested_by: string;
  inventory_id: string;
  quantity: string;
  status: string;
  first_name: string;
  last_name: string;
  user_id: string;
  item_category: string;
  item_name: string;
  created_at: string;
}
export interface InventoryStats {
  total_inventories: number;
  total_categories: number;
  total_expired_items: number;
}

interface InventoryStore {
  isLoading: boolean;
  stats: InventoryStats;

  pagination: Pagination | null;
  getInventoryStats: () => Promise<void>;
  stocks: Stock[];
  getAllStocks: (endpoint?: string) => Promise<void>;
  createStock: (
    data: any,
    endpoint?: string,
    refreshEndpoint?: string
  ) => Promise<boolean>;
  searchStaff: (query: string) => Promise<Staff[]>;
  requests: Request[];
  getAllRequest: (endpoint?: string) => Promise<void>;
  createRequest: (
    data: any,
    endpoint?: string,
    refreshEndpoint?: string
  ) => Promise<boolean>;
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
  requests: [],

  getAllRequest: async (
    endpoint = "/inventory/requests/all-records?status=pending"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      console.log("getAllRequest response:", response.data);
      set({ requests: response.data.data?.data || [] });
      toast.success(response.data.message || "Requests fetched successfully");
    } catch (error: any) {
      console.error("getAllRequest error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch requests");
    } finally {
      set({ isLoading: false });
    }
  },

  createRequest: async (
    data,
    endpoint = "/inventory/requests/create",
    refreshEndpoint = "/inventory/requests/all-records?status=pending"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.post(endpoint, data);
      console.log("createRequest response:", response.data);
      if (response.status === 201) {
        await get().getAllRequest(refreshEndpoint);
        toast.success(response.data.message || "Request created successfully");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("createRequest error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to create request");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  searchStaff: async (query: string) => {
    if (!query.trim()) {
      console.log("searchStaff: Empty query, returning empty array");
      return [];
    }
    try {
      const response = await api.get(
        `/medical-report/all-patient?search=${encodeURIComponent(query)}`
      );
      console.log("searchStaff response:", response.data);
      const results = response.data.data?.data || [];
      if (!results.length) {
        console.log("searchStaff: No results found for query:", query);
      }
      return results;
    } catch (error: any) {
      console.error(
        "searchStaff error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Staff search failed");
      return [];
    }
  },

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
      set({ stocks: response.data.data.data });
      toast.success(response.data.message || "Stocks fetched successfully");
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch stocks");
    } finally {
      set({ isLoading: false });
    }
  },
  createStock: async (
    data,
    endpoint = "/inventory/create-stock",
    refreshEndpoint = "/inventory/all-inventory-items"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.post(endpoint, data);
      if (response.status === 201) {
        await get().getAllStocks(refreshEndpoint);
        toast.success(response.data.message || "Stock added successfully");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to add stock");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // searchStaff: async (query: string) => {
  //   try {
  //     const response = await api.get(
  //       `/medical-report/all-patient?search=${query}`
  //     );
  //     return response.data.data.data;
  //   } catch (error: any) {
  //     toast.error(error.response?.data?.message || "Staff search failed");
  //     return [];
  //   }
  // },
}));
