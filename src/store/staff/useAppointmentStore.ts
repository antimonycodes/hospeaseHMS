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

// export interface NextOfKin {
//   name: string;
//   last_name: string;
//   gender: string;
//   phone: string;
//   occupation: string;
//   address: string;
//   relationship: string;
// }
export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

interface AppointmentStore {
  isLoading: boolean;
  appointments: any[];
  pagination: Pagination | null;
  selectedAppointment: any | null;
  getAllAppointments: (
    page?: string,
    perPage?: string,
    endpoint?: string
  ) => Promise<void>;
  getAppointmentById: (id: string) => Promise<void>;
  createAppointment: (data: any, endpoint?: string) => Promise<void>;
  updateAppointment: (
    id: string,
    data: any,
    endpoint?: string
  ) => Promise<void>;
  deleteAppointment: (id: string, endpoint?: string) => Promise<void>;
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  isLoading: false,
  appointments: [],
  selectedAppointment: null,
  pagination: null,
  getAllAppointments: async (
    page: string = "1",
    perPage: string = "10",
    baseEndpoint: string = "/medical-report/appointment/all-records"
  ) => {
    set({ isLoading: true });
    try {
      const endpoint = `${baseEndpoint}?page=${page}&per_page=${perPage}`;

      console.log("Fetching patients from:", endpoint);

      const response = await api.get(endpoint);
      set({ pagination: response.data.data.pagination });
      console.log(response.data.data.pagination, "pagination");
      set({ appointments: response.data.data.data });
      console.log(response.data.data, "dfgh");
      console.log(response.data.message);
    } catch (error: any) {
      // toast.error(error.response.message);
    } finally {
      set({ isLoading: false });
    }
  },

  getAppointmentById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(
        `/medical-report/appointment/all-records/${id}`
      );
      set({ selectedAppointment: response.data.data });
    } catch (error: any) {
      // toast.error(error.response.message);
    } finally {
      set({ isLoading: false });
    }
  },

  createAppointment: async (data, endpoint = "/appointments") => {
    set({ isLoading: true });
    try {
      const response = await api.post(endpoint, data);
      toast.success("Appointment created successfully!");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.message);
    } finally {
      set({ isLoading: false });
    }
  },

  updateAppointment: async (id, data, endpoint = `/appointments/${id}`) => {
    set({ isLoading: true });
    try {
      const response = await api.put(endpoint, data);
      toast.success("Appointment updated successfully!");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.message);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAppointment: async (id, endpoint = `/appointments/${id}`) => {
    set({ isLoading: true });
    try {
      await api.delete(endpoint);
      toast.success("Appointment deleted successfully!");
    } catch (error: any) {
      toast.error(error.response.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));
