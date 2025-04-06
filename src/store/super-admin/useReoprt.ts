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
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface ReportStore {
  isLoading: boolean;

  createReport: (formData: {
    patient_id: string | number | null;
    note: string;
    department_id: number | null;
    parent_id: number | null;
    file?: File | null;
    status: string | null;
  }) => Promise<any>;
  createNote: (data: any) => Promise<any>;
}

export const useReportStore = create<ReportStore>((set) => ({
  isLoading: false,
  createReport: async ({
    patient_id,
    note,
    department_id,
    parent_id,
    file,
    status,
  }) => {
    set({ isLoading: true });
    try {
      const form = new FormData();
      if (patient_id !== null) {
        form.append("patient_id", patient_id.toString());
      } else {
        throw new Error("patient_id cannot be null");
      }
      form.append("note", note);
      if (department_id !== null) {
        form.append("department_id", department_id.toString());
      } else {
        throw new Error("department_id cannot be null");
      }

      // Handle null values properly
      if (parent_id !== null) {
        form.append("parent_id", parent_id.toString());
      } else {
        form.append("parent_id", ""); // Empty string for null
      }

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
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
      set({ isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  createNote: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/medical-report/case-note", data);
      if (response.status === 201) {
        toast.success(response.data.message);
        return true;
      }
      return response.data;
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
      set({ isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
