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
  amount: number;
  department_id: number;
}

export interface UpdateItem {
  id: number;
  name?: string;
  amount?: number;
  department_id?: number;
}
export interface DeleteItem {
  id: number;
}

export interface GetItemById {
  id: number;
}
export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface AllItems {}

interface CombinedStore {
  isLoading: boolean;
  isDeleting: boolean;
  items: any[];
  createItem: (data: CreateItem) => Promise<any>;
  getAllItems: (endpoint?: string) => Promise<any>;
  deleteUser: (id: any) => Promise<any>;
  updateItem: (id: number, data: CreateItem, endpoint?: string) => Promise<any>;
  deleteItem: (id: number) => Promise<any>;
}

export const useCombinedStore = create<CombinedStore>((set, get) => ({
  isLoading: false,
  isDeleting: false,
  items: [],

  createItem: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post(
        "/medical-report/service-charge/create",
        data
      );

      if (isSuccessfulResponse(response)) {
        toast.success(response.data?.message);
        get().getAllItems();
        return true;
      }
      return null;
    } catch (error) {
      handleErrorToast(error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  getAllItems: async (endpoint = "/medical-report/service-charge/all") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);

      if (isSuccessfulResponse(response)) {
        // toast.success(response.data?.msg);
        set({ items: response.data.data.data });
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
  updateItem: async (
    id,
    data,
    endpoint = `/medical-report/service-charge/update/${id}`
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.put(endpoint, data);

      if (isSuccessfulResponse(response)) {
        // toast.success(response.data?.msg);
        // set({ items: response.data.data.data });
        get().getAllItems();
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
  deleteItem: async (id) => {
    set({ isDeleting: true });
    try {
      const response = await api.delete(
        `medical-report/service-charge/delete/${id}`
      );

      if (isSuccessfulResponse(response)) {
        toast.success(response.data?.message);
        return true;
      }
      return null;
    } catch (error) {
      handleErrorToast(error);
      return null;
    } finally {
      set({ isDeleting: false });
    }
  },
  deleteUser: async (id) => {
    set({ isDeleting: true });
    try {
      const response = await api.delete(`/admin/delete-user/${id}`);

      if (isSuccessfulResponse(response)) {
        toast.success(response.data?.message);
        return true;
      }
      return null;
    } catch (error) {
      handleErrorToast(error);
      return null;
    } finally {
      set({ isDeleting: false });
    }
  },
}));
