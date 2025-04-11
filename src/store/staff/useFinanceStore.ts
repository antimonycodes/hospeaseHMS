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

export interface CreateExpenseData {
  item: string;
  amount: number;
  from: string;
  by: string;
  payment_method: string;
}

export interface CreatePaymentData {
  patient_id: number;
  amount: string;
  purpose: string;
  payment_method: string;
  payment_type: string;
}

interface Payment {
  id: number;
  attributes: {
    patient: string;
    amount: string;
    purpose: string;
    payment_method: string;
    payment_type?: string;
    is_active?: boolean;
    user_id: string;
    created_at: string;
  };
}

interface FinanceStats {
  total_income_balance: string;
  total_expenses_balance: string;
}

export interface LabStats {
  dispersal_status: {
    pending: {
      count: number;
    };
    completed: {
      count: number;
    };
    ongoing: {
      count: number;
    };
  };
  total_dispersed: number;
}

interface FinanceStore {
  isLoading: boolean;
  expenses: any[];
  payments: Payment[];
  stats: (FinanceStats & LabStats) | null;
  getAllExpenses: (endpoint?: string) => Promise<void>;
  getAllPayments: (endpoint?: string) => Promise<void>;
  createExpense: (
    data: CreateExpenseData,
    endpoint?: string,
    refreshEndpoint?: string
  ) => Promise<boolean | null>;
  createPayment: (
    data: CreatePaymentData,
    endpoint?: string,
    refreshEndpoint?: string
  ) => Promise<boolean | null>;
  getFinanceStats: (endpoint?: string) => Promise<void>;
  getLabStats: (endpoint?: string) => Promise<void>;
  searchPatients: (query: string) => Promise<any[]>;
}

export const useFinanceStore = create<FinanceStore>((set) => ({
  isLoading: false,
  expenses: [],
  payments: [],
  stats: null,

  getAllExpenses: async (endpoint = "/finance/all-expenses") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      const fetchedExpenses = response.data.data.data || [];
      set({ expenses: fetchedExpenses });
      console.log(response.data.message);
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(error.response?.data?.message || "Failed to fetch expenses");
    } finally {
      set({ isLoading: false });
    }
  },
  searchPatients: async (query: string) => {
    try {
      const response = await api.get(
        `/medical-report/all-patient?search=${query}`
      );
      return response.data.data.data;
    } catch (error: any) {
      // toast.error(error.response?.data?.message || "Search failed");
      return [];
    }
  },

  getAllPayments: async (endpoint = "/finance/all-revenues") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      const fetchedPayments = response.data.data || [];
      console.log("Fetched Payments:", fetchedPayments);
      set({ payments: fetchedPayments });
    } catch (error: any) {
      console.error("Fetch error:", error.response?.data || error.message);
      // toast.error(error.response?.data?.message || "Failed to fetch payments");
      set({ payments: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  createExpense: async (
    data: CreateExpenseData,
    endpoint = "/finance/expenses-record",
    refreshEndpoint = "/finance/all-expenses"
  ) => {
    console.log("Payload:", data);
    set({ isLoading: true });
    try {
      const response = await api.post(endpoint, data);
      if (response.status === 201) {
        await useFinanceStore.getState().getAllExpenses(refreshEndpoint);
        toast.success(response.data.message);
        return true;
      }
      return null;
    } catch (error: any) {
      console.error("Error response:", error.response?.data);
      // const errorMessage =
      //   error.response?.data?.message?.[0] || "Failed to create expense";
      // toast.error(errorMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  createPayment: async (
    data: CreatePaymentData,
    endpoint = "/finance/save-revenue",
    refreshEndpoint = "/finance/all-revenues"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.post(endpoint, data);
      if (response.status === 201) {
        await useFinanceStore.getState().getAllPayments(refreshEndpoint);
        toast.success(response.data.message || "Payment added successfully");
        return true;
      }
      return null;
    } catch (error: any) {
      console.error("Error response:", error.response?.data);
      const errorMessage =
        error.response?.data?.message?.[0] || "Failed to create payment";
      // toast.error(errorMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  getFinanceStats: async (endpoint = "/finance/stats") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      const statsData = response.data.data || {
        total_income_balance: "0",
        total_expenses_balance: "0",
      };
      set({ stats: statsData });
      console.log("Stats fetched:", statsData);
    } catch (error: any) {
      console.error("Stats fetch error:", error.response?.data);
      // toast.error(error.response?.data?.message || "Failed to fetch stats");
      set({ stats: null });
    } finally {
      set({ isLoading: false });
    }
  },

  getLabStats: async (endpoint = "/laboratory/stats") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      const responseData = response.data.data || {
        dispersal_status: {
          pending: { count: 0 },
          completed: { count: 0 },
          ongoing: { count: 0 },
        },
        total_dispersed: 0,
      };

      // Create a new object with flattened properties
      const labStatsData = {
        ...responseData,
        total_tests: responseData.total_dispersed,
        pending: responseData.dispersal_status.pending.count,
        ongoing: responseData.dispersal_status.ongoing.count,
        completed: responseData.dispersal_status.completed.count,
      };

      set({ stats: labStatsData });
      console.log("Lab stats fetched:", labStatsData);
    } catch (error: any) {
      console.error("Lab stats fetch error:", error.response?.data);
      // toast.error(
      //   error.response?.data?.message || "Failed to fetch laboratory stats"
      // );
      set({ stats: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
