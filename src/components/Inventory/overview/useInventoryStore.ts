import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Cat } from "lucide-react";

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
export interface CreateStockData {
  item: string;
  quantity: string;
  category_id: string;
  expiry_date: string;
  cost: number;
  // image: File | null;
}

export interface InventoryStats {
  total_inventories: number;
  total_categories: number;
  total_expired_items: number;
}

interface InventoryStore {
  isLoading: boolean;
  stats: InventoryStats | null;
  categorys: any[];
  pagination: Pagination | null;
  stocks: any[];
  requests: any[];
  // requests: { data: any[]; pagination: Pagination }[];
  getInventoryStats: (endpoint?: string) => Promise<void>;
  getAllStocks: (endpoint?: string) => Promise<void>;
  createStock: (
    data: CreateStockData,
    endpoint?: string,
    refreshEndpoint?: string
  ) => Promise<boolean | null>;
  searchStaff: (query: string) => Promise<Staff[]>;
  getAllRequest: (endpoint?: string) => Promise<void>;
  getAllCategorys: (fetchEndpoint: string) => Promise<void>;
  createRequest: (
    data: any,
    endpoint?: string,
    refreshEndpoint?: string
  ) => Promise<boolean>;
  createCategory: (
    data: { name: string },
    Catendpoint?: string,
    createEndpoint?: string
  ) => Promise<boolean>;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  stats: null,
  isLoading: false,
  pagination: null,
  stocks: [],
  requests: [],
  categorys: [],

  searchStaff: async (query: string) => {
    try {
      const response = await api.get(
        `/medical-report/all-staffs?search=${query}`
      );
      console.log("Staff search response:", response.data);
      const staffData = response.data.data;
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

      // Store the entire response data structure
      // This includes both the data array and pagination object
      if (response.data && response.data.data) {
        set({ requests: response.data.data });
        toast.success(response.data.message || "Requests fetched successfully");
      } else {
        console.error("Unexpected API response structure:", response.data);
        set({
          requests: [
            {
              data: [],
              pagination: {
                total: 0,
                per_page: 0,
                current_page: 0,
                last_page: 0,
                from: 0,
                to: 0,
              },
            },
          ],
        });
      }
    } catch (error: any) {
      console.error("getAllRequest error:", error.response?.data);
      set({
        requests: [
          {
            data: [],
            pagination: {
              total: 0,
              per_page: 0,
              current_page: 0,
              last_page: 0,
              from: 0,
              to: 0,
            },
          },
        ],
      });
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

  getAllCategorys: async (
    fetchEndpoint = "/inventory/category/all-records"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.get(fetchEndpoint);
      const fetchedCategorys = response.data.data;
      set({ categorys: fetchedCategorys });
      console.log(response.data.message);
      // toast.success("Categories fetched successfully");
    } catch (error: any) {
      console.error("getCategories error:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    } finally {
      set({ isLoading: false });
    }
  },
  createCategory: async (
    data: { name: string },
    fetchEndpoint = "/inventory/category/all-records",
    createEndpoint = "/inventory/category/create"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.post(createEndpoint, data);
      console.log("createCategory response:", response.data);
      if (response.status === 201) {
        await get().getAllCategorys(fetchEndpoint);
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

  createStock: async (
    data: CreateStockData,
    endpoint = "/inventory/upload-item"
  ) => {
    set({ isLoading: true });
    try {
      const form = new FormData();
      form.append("item", data.item);
      form.append("quantity", data.quantity.toString());
      form.append("category_id", data.category_id.toString());
      form.append("expiry_date", data.expiry_date);
      form.append("cost", data.cost.toString());

      // form.append("image", data.image || "");

      const response = await api.post(endpoint, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        toast.success(response.data.message || "Stock added successfully");
        await get().getAllStocks();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("createStock error:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to add stock";
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorMessage);
      }
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  getInventoryStats: async (endpoint = "/inventory/stats") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      const statsData = response.data.data || {
        total_inventories: 0,
        total_categories: 0,
        total_expired_items: 0,
      };
      set({ stats: statsData });
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
