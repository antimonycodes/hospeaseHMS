import { create } from "zustand";
import axios, { AxiosResponse } from "axios";
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

interface StatsStore {
  isloading: boolean;
  stats: {
    total_patient: number;
    total_doctor: number;
    total_appointment: number;
    total_consultant: number;
  } | null;
  getStats: () => Promise<void>;
}

export const useStatsStore = create<StatsStore>((set) => ({
  isloading: false,
  stats: null,

  getStats: async () => {
    set({ isloading: true });
    try {
      const response: AxiosResponse = await api.get("/admin/stats");
      set({ stats: response.data.data });
    } catch (error: any) {
      console.error(error);
      toast.error("Error fetching stats");
    } finally {
      set({ isloading: false });
    }
  },
}));
