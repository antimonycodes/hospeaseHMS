// store/useChartStore.ts
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

interface ChartData {
  monthly_earnings: string[];
  months: string[];
}

interface ChartState {
  isLoading: boolean;
  incomeData: ChartData | null;
  expensesData: ChartData | null;
  getIncomeData: (endpoint?: string) => Promise<void>;
  getExpensesData: (endpoint?: string) => Promise<void>;
}

export const useChartStore = create<ChartState>((set) => ({
  isLoading: false,
  incomeData: null,
  expensesData: null,

  getIncomeData: async (
    endpoint = "/finance/income-graphical-representation"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      const incomeData = response.data.data || {
        monthly_earnings: Array(12).fill("0.00"),
        months: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
      };
      set({ incomeData });
      console.log("Income Data fetched:", incomeData);
    } catch (error: any) {
      console.error(
        "Income fetch error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Failed to fetch income data"
      );
      set({ incomeData: null });
    } finally {
      set({ isLoading: false });
    }
  },

  getExpensesData: async (
    endpoint = "/finance/expenses-graphical-representation"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint.replace("income", "expenses")); // Adjust endpoint
      const expensesData = response.data.data || {
        monthly_earnings: Array(12).fill("0.00"),
        months: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
      };
      set({ expensesData });
      console.log("Expenses Data fetched:", expensesData);
    } catch (error: any) {
      console.error(
        "Expenses fetch error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Failed to fetch expenses data"
      );
      set({ expensesData: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
