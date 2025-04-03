import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useDoctorStore } from "./useDoctorStore";

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

interface Togglestatus {
  is_active: boolean;
  user_id: number;
}

interface Hospital {
  id: number;
  name: string;
  logo: string;
}

interface BranchAttributes {
  name: string;
  hospital: Hospital;
  created_at: string;
  total_patient: number;
}

interface Branch {
  type: string;
  id: number;
  attributes: BranchAttributes;
}

interface ClinicaldeptAttributes {
  name: string;
  total_patient: number;
}

interface Clinicaldept {
  type: string;
  id: number;
  attributes: ClinicaldeptAttributes;
}

interface CreateBranchData {
  name: string;
}

interface CreateClinicaldeptData {
  name: string;
}
export interface CreateStaff {
  email: string;
  department_id?: number;
  role?: string;
  name: string;
}

interface Globalstore {
  isLoading: boolean;
  branches: Branch[];
  clinicaldepts: Clinicaldept[];
  togglestatus: (data: Togglestatus) => Promise<any>;
  getBranches: () => Promise<any>;
  createBranch: (data: CreateBranchData) => Promise<any>;
  getClinicaldept: () => Promise<any>;
  createClinicaldept: (data: CreateClinicaldeptData) => Promise<any>;
  createStaff: (data: CreateStaff) => Promise<any>;
}

export const useGlobalStore = create<Globalstore>((set, get) => ({
  isLoading: false,
  branches: [],
  clinicaldepts: [],

  togglestatus: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/admin/profile/account-status", data);
      if (response.status === 200) {
        // Return the new status to confirm it was updated on server
        toast.success(response.data.message);

        return response.data.data?.attributes.is_active ?? data.is_active;
      }
      console.log(response.data.data?.attributes.is_active);
      toast.success(response.data.message);
      return null; // Indicate failure
    } catch (error: any) {
      console.error(
        "Error changing status:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to update status");
      return null; // Indicate failure
    } finally {
      set({ isLoading: false });
    }
  },

  getBranches: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/admin/branches/fetch");
      if (response.status === 200) {
        // Return the new status to confirm it was updated on server
        // toast.success(response.data.message);
        set({ branches: response.data.data });
        console.log(response.data.data);
        return true;
      }
      console.log(response.data.data?.data);
      toast.success(response.data.message);
      return null;
    } catch (error: any) {
      console.error(
        "Error changing status:",
        error.response?.data || error.message
      );
      //   toast.error(error.response?.data?.message || "Failed");
      return null; // Indicate failure
    } finally {
      set({ isLoading: false });
    }
  },
  createBranch: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/admin/branches/create", data);
      if (response.status === 201) {
        // Return the new status to confirm it was updated on server
        toast.success(response.data.message);
        await get().getBranches();
        return true;
      }
      console.log(response.data.data?.data);
      toast.success(response.data.message);
      return null;
    } catch (error: any) {
      console.error(
        "Error changing status:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed");
      return null; // Indicate failure
    } finally {
      set({ isLoading: false });
    }
  },

  getClinicaldept: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get(
        "/admin/department/clinical-department-fetch"
      );
      if (response.status === 200) {
        // Return the new status to confirm it was updated on server
        // toast.success(response.data.message);
        set({ clinicaldepts: response.data.data });
        return true;
      }
      console.log(response.data.data?.data);
      toast.success(response.data.message);
      return null;
    } catch (error: any) {
      console.error(
        "Error changing status:",
        error.response?.data || error.message
      );
      //   toast.error(error.response?.data?.message || "Failed");
      return null; // Indicate failure
    } finally {
      set({ isLoading: false });
    }
  },
  createClinicaldept: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post(
        "/admin/department/clinical-department",
        data
      );
      if (response.status === 201) {
        // Return the new status to confirm it was updated on server
        toast.success(response.data.message);
        await get().getClinicaldept();
        return true;
      }
      console.log(response.data.data?.data);
      toast.success(response.data.message);
      return null;
    } catch (error: any) {
      console.error(
        "Error changing status:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed");
      return null; // Indicate failure
    } finally {
      set({ isLoading: false });
    }
  },
  createStaff: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/admin/department/head-dept", data);
      if (response.status === 201) {
        toast.success(response.data.message);
        return true;
      }
      console.log(response.data.message);
      return null;
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response.data.message);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
}));
