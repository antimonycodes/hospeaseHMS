// store.ts
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

// Interface for Medical Stats
export interface MedicalStatss {
  total_patient: number;
  men_total_count: number;
  ladies_total_count: number;
  children_count: number;
  male_count: number;
  female_count: number;
  doctorAppointmentCount: number;
  graph_appointment_representation: Record<string, number>;
}

interface MedicalStore {
  stats: MedicalStatss | null;
  isLoading: boolean;
  getMedStats: (endpoint?: string) => Promise<void>;
}

export const useMedicalStore = create<MedicalStore>((set) => ({
  stats: null,
  isLoading: false,

  getMedStats: async (endpoint = "/medical-director/stats") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      const statsData = response.data || {
        total_patient: 0,
        men_total_count: 0,
        ladies_total_count: 0,
        children_count: 0,
        male_count: 0,
        female_count: 0,
        doctorAppointmentCount: 0,
        graph_appointment_representation: {
          Jan: 0,
          Feb: 0,
          Mar: 0,
          Apr: 0,
          May: 0,
          Jun: 0,
          Jul: 0,
          Aug: 0,
          Sep: 0,
          Oct: 0,
          Nov: 0,
          Dec: 0,
        },
      };
      set({ stats: statsData });
      console.log("Medical Stats fetched:", statsData);
    } catch (error: any) {
      console.error("Stats fetch error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch stats");
      set({ stats: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
