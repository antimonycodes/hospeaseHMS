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
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface AppointmentStore {
  isLoading: boolean;
  appointments: any[];
  selectedAppointment: any | null;
  getAllAppointments: (endpoint?: string) => Promise<void>;
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

  getAllAppointments: async (endpoint: string = "/doctor/my-appointments") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      set({ appointments: response.data.data.data });
      console.log(response.data.data, "dfgh");
      console.log(response.data.message);
    } catch (error: any) {
      toast.error(error.response.message);
    } finally {
      set({ isLoading: false });
    }
  },

  getAppointmentById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/appointments/${id}`);
      set({ selectedAppointment: response.data.data });
    } catch (error: any) {
      toast.error(error.response.message);
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
