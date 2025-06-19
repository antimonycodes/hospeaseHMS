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
    const token = Cookies.get("hhmstxt");
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
  isPaymentModalOpen: boolean;
  isDeleting: boolean;
  items: any[];
  categories: any[];
  pagination: Pagination | null;
  paymentData: any[];
  bills: any[];
  stats: any[];

  createItem: (data: CreateItem) => Promise<any>;
  getAllItems: (
    page?: string,
    perPage?: string,
    endpoint?: string
  ) => Promise<any>;
  deleteUser: (id: any) => Promise<any>;
  updateItem: (id: number, data: CreateItem, endpoint?: string) => Promise<any>;
  deleteItem: (id: number) => Promise<any>;
  updateHmoPercentage: (id: any, data: any) => Promise<any>;
  hmoPercentage: () => Promise<any>;
  resetApp: (data: any) => Promise<any>;
  createPatientCategory: (data: any) => Promise<any>;
  getAllCategory: () => Promise<any>;
  updatePatientsCategory: (id: any, name: any) => Promise<any>;
  deletePatientsCategory: (id: any) => Promise<any>;
  openPaymentModal: (data?: any) => void;
  getAllBills: () => Promise<any>;
  updateBill: (id: any, data: any) => Promise<any>;
  monthlyStats: (data?: any) => Promise<any>;
}

export const useCombinedStore = create<CombinedStore>((set, get) => ({
  isLoading: false,
  isPaymentModalOpen: false,
  isDeleting: false,
  items: [],
  pagination: null,
  categories: [],
  paymentData: [],
  bills: [],
  stats: [],

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
  getAllItems: async (
    page = "1",
    perPage = "1000",
    baseEndpoint = "/medical-report/service-charge/all"
  ) => {
    set({ isLoading: true });
    try {
      const endpoint = `${baseEndpoint}?page=${page}&per_page=${perPage}`;
      const response = await api.get(endpoint);

      if (isSuccessfulResponse(response)) {
        // toast.success(response.data?.msg);
        set({ items: response.data.data.data });
        set({ pagination: response.data.data.pagination });

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
  updateHmoPercentage: async (id, data) => {
    set({ isDeleting: true });
    try {
      const response = await api.put(`/admin/update-hmo-settings/${id}`, data);

      if (isSuccessfulResponse(response)) {
        // toast.success(response.data?.message);
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
  hmoPercentage: async () => {
    set({ isDeleting: true });
    try {
      const response = await api.get(`/admin/hmo-settings`);

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
  resetApp: async (data) => {
    set({ isDeleting: true });
    try {
      const response = await api.post(`/admin/reset-application`, data);

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
  createPatientCategory: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post(
        "/medical-report/patient-category/create",
        data
      );

      if (isSuccessfulResponse(response)) {
        toast.success(response.data?.message);
        get().getAllCategory();
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
  getAllCategory: async (
    page = "1",
    perPage = "1000",
    baseEndpoint = "medical-report/patient-category/all-records"
  ) => {
    set({ isLoading: true });
    try {
      const endpoint = `${baseEndpoint}?page=${page}&per_page=${perPage}`;
      const response = await api.get(endpoint);

      if (isSuccessfulResponse(response)) {
        // toast.success(response.data?.msg);
        set({ categories: response.data.data });
        console.log(response.data.data);

        set({ pagination: response.data.data.pagination });

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
  updatePatientsCategory: async (
    id,
    name

    // endpoint = `/medical-report/service-charge/update/${id}`
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.put(
        `/medical-report/patient-category/update/${id}`,
        {
          name: name.trim(),
        }
      );

      if (isSuccessfulResponse(response)) {
        // toast.success(response.data?.msg);
        // set({ items: response.data.data.data });
        get().getAllCategory();
        console.log(response);
        return true;
      }
      return null;
    } catch (error) {
      //   handleErrorToast(error, "Failed.");
      console.log(error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  deletePatientsCategory: async (id) => {
    set({ isDeleting: true });
    try {
      const response = await api.delete(
        `/medical-report/patient-category/delete/${id}`
      );

      if (isSuccessfulResponse(response)) {
        get().getAllCategory();
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
  openPaymentModal: (data?: any[]) =>
    set((state) => ({
      isPaymentModalOpen: !state.isPaymentModalOpen,
      paymentData: data || [],
    })),
  getAllBills: async (page = "1", perPage = "1000") => {
    set({ isLoading: true });
    try {
      const endpoint = `/medical-report/doctor-bill/all-records?page=${page}&per_page=${perPage}`;
      const response = await api.get(endpoint);
      if (isSuccessfulResponse(response)) {
        set({ bills: response.data.data.data });
        set({ pagination: response.data.data.pagination });
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
  updateBill: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await api.put(
        `/medical-report/doctor-bill/update/${id}`,

        data
      );

      if (isSuccessfulResponse(response)) {
        // toast.success(response.data?.msg);
        // set({ items: response.data.data.data });
        get().getAllBills();
        console.log(response.data.data);
        return response.data.data;
        // return true;
      }
      return null;
    } catch (error) {
      //   handleErrorToast(error, "Failed.");
      console.log(error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  monthlyStats: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post(`/admin/generate-monthly-report`, data);

      if (isSuccessfulResponse(response)) {
        set({ stats: response.data.data });
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
}));
