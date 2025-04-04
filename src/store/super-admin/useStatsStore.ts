import { create } from "zustand";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authorization token to requests
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

// Define store interface
interface StatsStore {
  isLoading: boolean;
  stats: {
    total_patient: number;
    total_doctor: number;
    total_appointment: number;
    total_consultant: number;
  } | null;
  clinicalStats: any[] | null;
  doctorStats: {
    total_patient: number;
    total_doctor: number;
    total_appointment: number;
    total_consultant: number;
  } | null;
  getStats: (endpoint?: string) => Promise<void>;
  getClinicalStats: () => Promise<void>;
}

// Zustand store
export const useStatsStore = create<StatsStore>((set) => ({
  isLoading: false,
  stats: null,
  clinicalStats: null,
  doctorStats: null,

  getStats: async (endpoint = "/admin/stats") => {
    set({ isLoading: true });
    try {
      const response: AxiosResponse = await api.get(endpoint);
      set({ stats: response.data.data });
      set({ doctorStats: response.data });
    } catch (error: any) {
      toast.error(error.response.message);
    } finally {
      set({ isLoading: false });
    }
  },
  getClinicalStats: async () => {
    set({ isLoading: true });
    try {
      const response: AxiosResponse = await api.get(
        "/admin/patient/patient_type_stats"
      );
      set({ clinicalStats: response.data.data });
      console.log(response.data.data);
    } catch (error: any) {
      console.error(error);
      toast.error("Error fetching stats");
    } finally {
      set({ isLoading: false });
    }
  },
}));
