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
  isCreating: boolean;
  isResponding: boolean;
  isReportLoading: boolean;

  createReport: (formData: {
    patient_id: string | number | null;
    note: string;
    department_id: number | null;
    parent_id: number | null;
    file?: File | null;
    status: string | null;
    role: any;
  }) => Promise<any>;
  singleReport: any[];
  allReports: any[];
  allNotes: any[];
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

export const useReportStore = create<ReportStore>((set) => ({
  isLoading: false,
  isCreating: false,
  isResponding: false,
  isReportLoading: false,
  singleReport: [],
  allReports: [],
  allNotes: [],
  createReport: async ({
    patient_id,
    note,
    department_id,
    parent_id,
    file,
    status,
    role,
  }) => {
    set({ isCreating: true });
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

      if (role !== null) {
        form.append("role", role.toString());
      } else {
        throw new Error("role cannot be null");
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
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
      // set({ isCreating: false });
      throw error;
    } finally {
      set({ isCreating: false });
    }
  },
  getAllReport: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/medical-report/case-report/${id}`);
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
  getSingleReport: async (id) => {
    set({ isReportLoading: false });
    try {
      const response = await api.get(`/medical-report/case-report/${id}`);
      if (response.status === 200) {
        set({ singleReport: response.data.data.data });
        // toast.success(response.data.message);
        // return response.data;
      }
      return response.data;
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      // toast.error(errorMsg);
      // throw error;
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
        return true;
      }
      toast.success(response.data.message);

      // Handle success, e.g., set success state
    } catch (error: any) {
      console.error("Error submitting the report:", error);
      // toast.error(error.response.data.message);
      // Handle error state
      set({ isResponding: false });
    } finally {
      set({ isResponding: false });
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
