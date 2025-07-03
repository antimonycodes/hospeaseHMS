import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

// Attach bearer token
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

export interface ReportStore {
  isLoading: boolean;
  isCreating: boolean;
  isResponding: boolean;
  isReportLoading: boolean;
  pharmacyStocks: any[];
  labItems: any[];

  getPharmacyStocks: () => Promise<any>;
  getLaboratoryItems: () => Promise<any>;
  createReport: (formData: {
    patient_id: string | number | null;
    note: string;
    department_id: number | null;
    parent_id: number | null;
    file?: File | null;
    status: string | null;
    role: any;
    pharmacy_stocks?: Array<{ id: number; quantity: number }> | null;
    laboratory_service_charge?: Array<{
      id: number;
      quantity: number | null;
    }> | null;
  }) => Promise<any>;
  singleReport: any[];
  allReports: any[];
  allNotes: any[];
  deptCreateReport: (formData: {
    patient_id: string | number | null;
    note: string;
    file?: File | null;
    status: string | null;
  }) => Promise<any>;
  createNote: (data: any) => Promise<any>;
  getAllReport: (id: any) => Promise<any>;
  getSingleReport: (id: any) => Promise<any>;
  respondToReport: (
    id: any,
    formData: {
      note: string;
      status: string;
      file?: File | null;
    }
  ) => Promise<any>;
  getMedicalNote: (id: any, type: any) => Promise<any>;
}

export const useReportStore = create<ReportStore>((set, get) => ({
  isLoading: false,
  isCreating: false,
  isResponding: false,
  isReportLoading: false,
  singleReport: [],
  allReports: [],
  allNotes: [],
  pharmacyStocks: [],
  labItems: [],
  getPharmacyStocks: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get(
        "/medical-report/request/get-pharmacy-requests"
      );

      set({ pharmacyStocks: response.data || [] });
      // toast.success(response.data.message || "Stocks fetched successfully");
    } catch (error: any) {
      console.error("getAllStocks error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch stocks");
    } finally {
      set({ isLoading: false });
    }
  },
  getLaboratoryItems: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get(
        "/medical-report/laboratory-service-charges"
      );

      set({ labItems: response.data || [] });
      // toast.success(response.data.message || "Stocks fetched successfully");
    } catch (error: any) {
      console.error("getAllStocks error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch stocks");
    } finally {
      set({ isLoading: false });
    }
  },
  createReport: async ({
    patient_id,
    note,
    department_id,
    parent_id,
    file,
    status,
    role,
    pharmacy_stocks = null, // Array of items with id and quantity
    laboratory_service_charge = null,
  }) => {
    set({ isCreating: true });
    try {
      const form = new FormData();
      // Required fields validation
      if (patient_id === null) {
        throw new Error("patient_id cannot be null");
      }
      if (department_id === null) {
        throw new Error("department_id cannot be null");
      }
      if (role === null) {
        throw new Error("role cannot be null");
      }
      // Append required fields
      form.append("patient_id", patient_id.toString());
      form.append("note", note);
      form.append("department_id", department_id.toString());
      form.append("role", role.toString());
      // Optional fields
      if (parent_id !== null) {
        form.append("parent_id", parent_id.toString());
      } else {
        form.append("parent_id", ""); // Empty string for null
      }
      if (file) {
        form.append("file", file);
      }
      form.append("status", status ?? "");

      // Add pharmacy_stocks array if present
      if (
        role === "pharmacist" &&
        pharmacy_stocks !== null &&
        pharmacy_stocks.length > 0
      ) {
        // For PHP-based backends that use the "[]" notation for arrays
        pharmacy_stocks.forEach((item: any, index: any) => {
          form.append(`pharmacy_stocks[${index}][id]`, item.id.toString());
          form.append(
            `pharmacy_stocks[${index}][quantity]`,
            item.quantity.toString()
          );
        });
      }
      // Add laboratory items if present
      if (
        role === "laboratory" &&
        laboratory_service_charge !== null &&
        laboratory_service_charge.length > 0
      ) {
        laboratory_service_charge.forEach((item: any, index: any) => {
          form.append(
            `laboratory_service_charge[${index}][id]`,
            item.id.toString()
          );
          form.append(
            `laboratory_service_charge[${index}][quantity]`,
            item.quantity.toString()
          );
        });
      }

      const response = await api.post("/medical-report/case-report", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        toast.success(response.data.message);
        return true;
      }
      return response.data;
    } catch (error) {
      // const errorMsg = error?.response.message || "Something went wrong";
      // toast.error(error?.response?.message || "Something went wrong");
      set({ isCreating: false });
      throw error;
    } finally {
      set({ isCreating: false });
    }
  },
  createNote: async (data) => {
    set({ isCreating: true });
    try {
      const response = await api.post("/medical-report/case-note", data);
      if (response.status === 201) {
        toast.success(response.data.message);
        return true;
      }
      return response.data;
    } catch (error: any) {
      const errorMsg = error?.response?.message || "Something went wrong";
      toast.error(errorMsg);
      // set({ isCreating: false });
      throw error;
    } finally {
      set({ isCreating: false });
    }
  },
  getAllReport: async (id, { perPage = 100, page = 1 } = {}) => {
    set({ isLoading: true });
    try {
      const response = await api.get(
        `/medical-report/case-report/${id}?perPage=${perPage}&page=${page}`
      );
      if (response.status === 200) {
        set({ allReports: response.data.data.data });
        console.log(response.data.data.data, "fghjk");
        return response.data;
      }
      return response.data;
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      // toast.error(errorMsg);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  getSingleReport: async (id: number, perPage = 100, page = 1) => {
    set({ isReportLoading: true });
    try {
      const response = await api.get(
        `/medical-report/case-report/${id}?perPage=${perPage}&page=${page}`
      );

      if (response.status === 200) {
        const reportList = response.data?.data?.data || [];
        const pagination = response.data?.data?.pagination || null;

        set({
          singleReport: reportList,
          // reportPagination: pagination, // optional: store pagination state
        });
      }

      return response.data;
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      console.error("Fetch error:", errorMsg);
    } finally {
      set({ isReportLoading: false });
    }
  },
  respondToReport: async (id, { note, status, file }) => {
    set({ isResponding: true });

    try {
      const form = new FormData();
      form.append("note", note);
      form.append("status", status);
      if (file) form.append("file", file);

      const response = await api.post(
        `/medical-report/case-reports/${id}/respond`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        get().getSingleReport(id);
        return true;
      }
      toast.success(response.data.message);
      return null;
    } catch (error: any) {
      console.error("Error submitting the report:", error);
      toast.error(error.response.data.message);

      // Handle error state
      set({ isResponding: false });
    } finally {
      set({ isResponding: false });
    }
  },
  deptCreateReport: async ({ patient_id, note, file, status }) => {
    set({ isCreating: true });
    try {
      const form = new FormData();
      if (patient_id !== null) {
        form.append("patient_id", patient_id.toString());
      } else {
        throw new Error("patient_id cannot be null");
      }
      form.append("note", note);

      // Handle null values properly

      if (file) {
        form.append("file", file);
      }

      // For status, don't append if null or use empty string based on backend requirements
      //   if (status !== null) {
      form.append("status", status ?? "");
      //   }
      // If backend requires a field even when null, use this:
      // else {
      //   form.append("status", "");
      // }

      const response = await api.post(
        "/medical-report/case-reports/respond",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success(response.data.message || "Report submitted successfully");
        // await get().getAllReport
        return true;
      }

      return response.data;
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
      set({ isCreating: false });
      throw error;
    } finally {
      set({ isCreating: false });
    }
  },
  getMedicalNote: async (id, type) => {
    set({ isLoading: true });
    try {
      const response = await api.get(
        `/medical-report/medical-report/${id}?type=${type}`
      );
      if (response.status === 200) {
        set({ allNotes: response.data.data.data });
        console.log(response.data.data.data);
        return true;
      }
      return null;
    } catch (error: any) {
      console.error("Error fetching medical note:", error);
      // toast.error(error.response?.data?.message || "Failed to fetch note");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
}));
