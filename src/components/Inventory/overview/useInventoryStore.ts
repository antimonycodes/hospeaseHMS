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
    expiry_date: string;
    cost: number;
    image?: string;
  };
}

export interface Category {
  id: number;
  attributes: {
    name: string;
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

export interface Request {
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
  categorys: any[];
  pagination: Pagination | null;
  stocks: Stock[];
  requests: Request[];
  getInventoryStats: () => Promise<void>;
  getAllStocks: (endpoint?: string) => Promise<void>;
  createStock: (formData: any) => Promise<boolean>;
  searchStaff: (query: string) => Promise<Staff[]>;
  getAllRequest: (endpoint?: string) => Promise<void>;
  getAllCategorys: () => Promise<void>;
  createRequest: (
    data: any,
    endpoint?: string,
    refreshEndpoint?: string
  ) => Promise<boolean>;
  createCategory: (
    data: { name: string },
    endpoint?: string
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
  categorys: [],

  searchStaff: async (query: string) => {
    try {
      const response = await api.get(`/staff/all?search=${query}`); // Replace with correct staff endpoint
      console.log("Staff search response:", response.data);
      const staffData = response.data.data?.data || response.data.data || [];
      return staffData;
    } catch (error: any) {
      console.error("Staff search error:", error.response?.data);
      toast.error(error.response?.data?.message || "Staff search failed");
      return [];
    }
  },

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

  getAllCategorys: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/inventory/category/all-records");
      const fetchedCategorys = response.data.data;
      set({ categorys: fetchedCategorys });
      console.log(response.data.message);
      toast.success("Categories fetched successfully");
    } catch (error: any) {
      console.error("getCategories error:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  getAllStocks: async (endpoint = "/inventory/all-inventory-items") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      set({ stocks: response.data.data?.data || [] });
      toast.success(response.data.message || "Stocks fetched successfully");
    } catch (error: any) {
      console.error("getAllStocks error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch stocks");
    } finally {
      set({ isLoading: false });
    }
  },

  createStock: async ({
    item,
    quantity,
    category_id,
    expiry_date,
    cost,
    image,
  }) => {
    set({ isLoading: true });
    try {
      const form = new FormData();
      form.append("item", item);
      form.append("quantity", quantity);
      form.append("category_id", category_id);
      form.append("expiry_date", expiry_date);
      form.append("cost", cost.toString());
      if (image) {
        form.append("image", image);
      }

      const response = await api.post("/inventory/upload-item", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success(response.data.message || "Stock added successfully");
        await get().getAllStocks();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("createStock error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to add stock");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  createCategory: async (
    data: { name: string },
    endpoint = "/inventory/category/create"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.post(endpoint, data);
      console.log("createCategory response:", response.data);
      if (response.status === 201) {
        await get().getAllCategorys();
        toast.success(response.data.message || "Category created successfully");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("createCategory error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to create Category");
      return false;
    } finally {
      set({ isLoading: false });
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
}));
