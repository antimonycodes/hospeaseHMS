import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {
  handleErrorToast,
  isSuccessfulResponse,
} from "../../utils/responseHandler";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach the bearer token
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

export interface CreateItem {
  name: string;
  price: number;
}
export interface AllItems {}

interface CombinedStore {
  isLoading: boolean;
  items: any[];
  createItem: (data: CreateItem) => Promise<any>;
  getAllItems: (endpoint?: string) => Promise<any>;
}

export const useCombinedStore = create<CombinedStore>((set, get) => ({
  isLoading: false,
  items: [],

  createItem: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/admin/purpose/create", data);

      if (isSuccessfulResponse(response)) {
        toast.success(response.data?.msg || "Asset created successfully!");
        get().getAllItems();
        return true;
      }
      return null;
    } catch (error) {
      handleErrorToast(error, "Failed.");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  getAllItems: async (endpoint = "admin/purpose/all") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);

      if (isSuccessfulResponse(response)) {
        // toast.success(response.data?.msg);
        set({ items: response.data.data });
        return true;
      }
      return null;
    } catch (error) {
      //   handleErrorToast(error, "Failed.");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
}));
