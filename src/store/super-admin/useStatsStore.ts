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
    const token = Cookies.get("hhmstxt");
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
    hospital_appointment_management_graphical_reps?: Record<string, number>;
  } | null;
  clinicalStats: any[] | null;
  doctorStats: {
    total_patient: number;
    total_doctor: number;
    total_appointment: number;
    total_consultant: number;
    graph_appointment_representation?: Record<string, number>;
  } | null;
  incomeStats: {
    monthly_earnings: string[]; // Adjust this to match your actual data format
  };
  expenseStats: {
    monthly_earnings: string[]; // Adjust this to match your actual data format
  };
  getStats: (endpoint?: string) => Promise<void>;
  getClinicalStats: () => Promise<void>;
  getIncomeStats: () => Promise<any>;
  getExpenseStats: () => Promise<any>;
}

// Zustand store
export const useStatsStore = create<StatsStore>((set) => ({
  isLoading: false,
  stats: null,
  clinicalStats: null,
  doctorStats: null,
  incomeStats: { monthly_earnings: [] },
  expenseStats: { monthly_earnings: [] },

  getStats: async (endpoint = "/admin/stats") => {
    set({ isLoading: true });
    try {
      const response: AxiosResponse = await api.get(endpoint);
      set({ stats: response.data.data });
      set({ doctorStats: response.data });
    } catch (error: any) {
      // toast.error(error.response.message);
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
      // toast.error("Error fetching stats");
    } finally {
      set({ isLoading: false });
    }
  },
  getIncomeStats: async () => {
    set({ isLoading: true });
    try {
      const response: AxiosResponse = await api.get(
        "/admin/finances/income-graphical-representation"
      );
      if (response.status === 201) {
        set({ incomeStats: response.data.data });
        console.log(response.data.data.monthly_earnings, "fghjk");
        return true;
      }
      return null;
    } catch (error: any) {
      console.error(error);
      // toast.error(error.response.message);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  getExpenseStats: async () => {
    set({ isLoading: true });
    try {
      const response: AxiosResponse = await api.get(
        "/admin/finances/expenses-graphical-representation"
      );
      if (response.status === 201) {
        set({ expenseStats: response.data.data });
        console.log(response.data.data);
        return true;
      }
      return null;
    } catch (error: any) {
      console.error(error);
      // toast.error(error.response.message);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
}));
