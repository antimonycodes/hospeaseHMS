// // usePatientStore.ts
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

export interface CreateExpenseData {
  item: string;
  amount: string;
  from: string;
  by: string;
}

interface FinanceStore {
  isLoading: boolean;
  expenses: any[];
  getAllExpenses: (endpoint?: string) => Promise<void>;
  createExpense: (
    data: CreateExpenseData,
    endpoint?: string
  ) => Promise<boolean | null>;
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  isLoading: true,
  expenses: [],

  // Fetch all expenses
  getAllExpenses: async (endpoint = "/finance/all-expenses") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);

      const fetchedExpenses = response.data.data.data; // Extract doctor array
      set({ expenses: fetchedExpenses });
      console.log(response.data.message);
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch expenses");
    } finally {
      set({ isLoading: false });
    }
  },
  createExpense: async (data, endpoint = "/finance/expenses-record") => {
    set({ isLoading: true });
    try {
      const response = await api.post(endpoint, data);
      console.log(response.data.message);
      toast.success(response.data.message);
      return true; // Return true on success
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to create expense");
      return false; // Return false on failure
    } finally {
      set({ isLoading: false });
    }
  },
}));
