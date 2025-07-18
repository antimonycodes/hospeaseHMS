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

export interface CreateExpenseData {
  item: string;
  amount: number;
  from: string;
  by: string;
  payment_method: string;
}

export interface CreatePaymentData {
  // patient_id: number;
  // amount: string;
  // purpose: string;
  // payment_method: string;
  // payment_type: string;
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
  total_monthly_expenses_balance: string;
  total_monthly_balance: string;
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
export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

interface FinanceStore {
  isLoading: boolean;
  isBillLoading: boolean;
  isSourceLoading: boolean;
  expenses: any[];
  payments: any[];
  paymentSources: any[];
  doctors: any[];
  isUpdating: boolean;
  selectedPayment: any | null;
  pagination: Pagination | null;
  stats: (FinanceStats & LabStats) | null;
  getAllExpenses: (
    page?: string,
    perPage?: string,
    endpoint?: string
  ) => Promise<void>;
  getAllPayments: (
    page?: string,
    perPage?: string,
    endpoint?: string
  ) => Promise<void>;
  getPaymentById: (id: string) => Promise<void>;
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
  updatePayment: (id: any, data: any) => Promise<any>;
  getFinanceStats: (endpoint?: string) => Promise<void>;
  getLabStats: (endpoint?: string) => Promise<void>;
  searchPatients: (query: string) => Promise<any[]>;
  getPaymentSource: () => Promise<any>;
  createPaymentSource: (data: any) => Promise<any>;
  updatePaymentSource: (id: any, data: any) => Promise<any>;
  deletePaymentSource: (id: any) => Promise<any>;
  getAllDoctors: () => Promise<any>;
  createDoctorBill: (data: any) => Promise<any>;
  refundPayment: (id: any, data: any) => Promise<any>;
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  isLoading: false,
  isUpdating: false,
  isSourceLoading: false,
  isBillLoading: false,
  expenses: [],
  payments: [],
  stats: null,
  pagination: null,
  selectedPayment: null,
  paymentSources: [],
  doctors: [],

  getAllExpenses: async (
    page = "1",
    perPage = "10",
    baseEndpoint = "/finance/all-expenses"
  ) => {
    set({ isLoading: true });
    try {
      const endpoint = `${baseEndpoint}?page=${page}&per_page=${perPage}`;

      console.log("Fetching Payment from:", endpoint);

      const response = await api.get(endpoint);
      set({ pagination: response.data.data.pagination });
      console.log(response.data.data.pagination, "pagination");
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
      console.log(response.data.data, "123");
      return response.data.data;
    } catch (error: any) {
      // toast.error(error.response?.data?.message || "Search failed");
      return [];
    }
  },

  // getAllPayments: async (
  //   page = "1",
  //   perPage = "50",
  //   baseEndpoint = "/medical-report/patient-payment-history"
  // ) => {
  //   set({ isLoading: true });
  //   try {
  //     const endpoint = `${baseEndpoint}?page=${page}&per_page=${perPage}`;

  //     console.log("Fetching Payment from:", endpoint);

  //     const response = await api.get(endpoint);
  //     set({ pagination: response.data.data.pagination });
  //     console.log(response.data.data.pagination, "pagination");
  //     const fetchedPayments = response.data.data.data || [];
  //     console.log("Fetched Payments:", fetchedPayments);
  //     set({ payments: fetchedPayments });
  //   } catch (error: any) {
  //     console.error("Fetch error:", error.response?.data || error.message);
  //     // toast.error(error.response?.data?.message || "Failed to fetch payments");
  //     set({ payments: [] });
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },
  getAllPayments: async (
    page = "1",
    perPage = "50",
    baseEndpoint = "/medical-report/patient-payment-history"
  ) => {
    set({ isLoading: true });
    try {
      // Check if the endpoint already contains query parameters
      const hasQueryParams = baseEndpoint.includes("?");
      const separator = hasQueryParams ? "&" : "?";

      // Only append page and per_page if they're not already in the endpoint
      const pageParamExists = baseEndpoint.includes("page=");
      const perPageParamExists = baseEndpoint.includes("per_page=");

      let endpoint = baseEndpoint;

      if (!pageParamExists) {
        endpoint += `${separator}page=${page}`;
      }

      if (!perPageParamExists) {
        endpoint += `${endpoint.includes("?") ? "&" : "?"}per_page=${perPage}`;
      }

      console.log("Fetching Payment from:", endpoint);
      const response = await api.get(endpoint);

      set({ pagination: response.data.data.pagination });
      console.log(response.data.data.pagination, "pagination");

      const fetchedPayments = response.data.data.data || [];
      console.log("Fetched Payments:", fetchedPayments);

      set({ payments: fetchedPayments });
    } catch (error: any) {
      console.error("Fetch error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch payments");
      set({ payments: [] });
    } finally {
      set({ isLoading: false });
    }
  },
  getPaymentById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/finance/patient-payment-history/${id}`);
      set({ selectedPayment: response.data.data });
    } catch (error: any) {
      toast.error(error.response.message);
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
    endpoint = "frontdesk/save-patient-payment",
    refreshEndpoint = "/finance/all-revenues"
  ) => {
    set({ isLoading: true });

    try {
      const response = await api.post("/finance/save-patient-payment", data);

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
      toast.error(errorMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  updatePayment: async (id, data) => {
    set({ isUpdating: true });
    try {
      const response = await api.put(
        `/medical-report/change-payment-status/${id}`,
        data
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
      set({ isUpdating: false });
    }
  },

  getFinanceStats: async (endpoint = "/finance/stats") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      const statsData = response.data.data || {
        total_income_balance: "0",
        total_expenses_balance: "0",
        total_monthly_expenses_balance: "0",
        total_monthly_balance: "0",
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
  createPaymentSource: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post(
        "/medical-report/payment.source/create",
        data
      );

      if (isSuccessfulResponse(response)) {
        toast.success(response.data?.message);
        await get().getPaymentSource();
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
  // getPaymentSource: async () => {
  //   set({ isLoading: true });
  //   try {
  //     const response = await api.get(
  //       "/medical-report/payment.source/all-records"
  //     );

  //     if (isSuccessfulResponse(response)) {
  //       toast.success(response.data?.message);
  //       set({ paymentSources: response.data.data.data });
  //       console.log(response.data.data);
  //       return true;
  //     }
  //     return null;
  //   } catch (error) {
  //     handleErrorToast(error);
  //     return null;
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },
  getPaymentSource: async () =>
    // page = "1",
    // perPage = "100",
    // endpoint = "/medical-report/payment.source/all-records"
    {
      set({ isSourceLoading: true });
      try {
        // const queryParams = `?page=${page}&per_page=${perPage}`;
        const response = await api.get(
          `/medical-report/payment.source/all-records`
        );

        set({ paymentSources: response.data.data.data || [] });
      } catch (error: any) {
        console.error(
          "Fetch payment sources error:",
          error.response?.data || error.message
        );
        toast.error(
          error.response?.data?.message || "Failed to fetch payment sources"
        );
        set({ paymentSources: [] });
      } finally {
        set({ isSourceLoading: false });
      }
    },
  updatePaymentSource: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await api.put(
        `/medical-report/payment.source/update/${id}`,
        data
      );

      if (isSuccessfulResponse(response)) {
        toast.success(response.data?.message);
        await get().getPaymentSource();

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
  deletePaymentSource: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.delete(
        `/medical-report/payment.source/delete/${id}`
      );

      if (isSuccessfulResponse(response)) {
        toast.success(response.data?.message);
        get().getPaymentSource();
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
  createDoctorBill: async (data) => {
    set({ isBillLoading: true });
    try {
      const response = await api.post(
        "/medical-report/doctor-bill/create",
        data
      );
      if (isSuccessfulResponse(response)) {
        // toast.success(response.data?.message);
        console.log(response.data.data);
        return response.data.data;
      }
      return null;
    } catch (error) {
      handleErrorToast(error);
      return null;
    } finally {
      set({ isBillLoading: false });
    }
  },
  getAllDoctors: async (
    page = "1",
    perPage = "1000",
    endpoint = "/medical-report/doctor/fetch"
  ) => {
    set({ isLoading: true });
    try {
      // Check if endpoint already contains query parameters
      const separator = endpoint.includes("?") ? "&" : "?";
      const fullEndpoint = endpoint.includes("page=")
        ? endpoint
        : `${endpoint}${separator}page=${page}&per_page=${perPage}`;
      const response = await api.get(fullEndpoint);

      const fetchedDoctors = response.data.data.data; // Extract doctor array
      set({ doctors: fetchedDoctors });
      // set({ pagination: response.data.data.pagination });

      // toast.success("Doctors retrieved successfully!");
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(error.response.message || "Failed to fetch doctors");
    } finally {
      set({ isLoading: false });
    }
  },
  refundPayment: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await api.put(
        `medical-report/refund-patient/${id}`,
        data
      );
      if (isSuccessfulResponse(response)) {
        toast.success(response.data?.message);
        get().getAllPayments();
        return true;
      }
      return null;
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(error.response.message || "Failed to fetch doctors");
    } finally {
      set({ isLoading: false });
    }
  },
}));
