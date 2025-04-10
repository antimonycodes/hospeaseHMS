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

// Interface for Hospital
export interface Hospital {
  id: number;
  name: string;
  logo: string;
}

// Interface for Nurse Attributes
export interface NurseAttributes {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  nurse_id: string;
  hospital: Hospital;
  shift_status: string;
  details: string | null;
  created_at: string;
  id: number;
  is_active: boolean;
  user_id: number;
}

// Interface for Nurse Data
export interface Nurse {
  type: string;
  id: number;
  attributes: NurseAttributes;
}

// Interface for Pagination
export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface CreateNurseData {
  first_name: string;
  last_name: string;
  dob: string;
  email: string;
  nurse_id: string | null; // Allow null if that's the intended behavior
  religion: string;
  phone: string;
  address: string;
}

export interface NurseStats {
  total_patient: number;
  clinic_total_appointment: number;
  nurse_assigned_appointment: number;
  children_count: number;
  male_count: number;
  female_count: number;
  matron_assigned_appointment: number;

  graph_appointment_representation: Record<string, number>;
}

// Zustand Store for Nurses
interface NurseStore {
  isLoading: boolean;
  nurses: Nurse[];
  frontdesks: any[];
  selectedNurse: any | null;
  getNurses: () => Promise<any>;
  getFrontdesk: () => Promise<any>;
  getNurseById: (id: string) => Promise<any>;
  createNurse: (data: CreateNurseData) => Promise<any>;
  createFrontdesk: (data: any) => Promise<any>;
  getNurseStats: () => Promise<void>;
  stats: NurseStats | null;
}

export const useNurseStore = create<NurseStore>((set, get) => ({
  isLoading: false,
  nurses: [],
  stats: null,
  frontdesks: [],
  selectedNurse: null,
  getNurses: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/admin/nurse/fetch");
      if (response.status === 200 || response.status === 201) {
        console.log(response.data.data);
        set({ nurses: response.data.data.data });
        return true;
      }
      return false;
    } catch (error: any) {
      // toast.error(error.response?.data?.message || "Failed to fetch nurses");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  getFrontdesk: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/admin/front-desk/all-records");
      if (response.status === 200 || response.status === 201) {
        console.log(response.data.data);
        set({ frontdesks: response.data.data.data });
        return true;
      }
      return false;
    } catch (error: any) {
      // toast.error(error.response?.data?.message || "Failed to fetch nurses");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  getNurseById: async (id) => {
    set({ isLoading: false });
    try {
      const response = await api.get(`/admin/nurse/fetch/${id}`);
      console.log(response.data.data);
      set({ selectedNurse: response.data.data }); // Store fetched doctor in state
      // toast.success(response.data.message);
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(error.message || "Failed to fetch doctor details");
    } finally {
      set({ isLoading: false });
    }
  },
  createNurse: async (data: CreateNurseData) => {
    set({ isLoading: true }); // Should be true when starting
    try {
      const response = await api.post("/admin/nurse/create", data);
      if (response.status === 201) {
        await get().getNurses();
        toast.success(response.data.message);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response.data.message || "Failed to add nurse");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  createFrontdesk: async (data: any) => {
    set({ isLoading: true }); // Should be true when starting
    try {
      const response = await api.post("/admin/front-desk/create", data);
      if (response.status === 201) {
        await get().getNurses();
        toast.success(response.data.message);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response.data.message || "Failed to add nurse");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  getNurseStats: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/nurses/stats");
      const statsData = response.data || {
        total_patient: 0,
        clinic_total_appointment: 0,
        nurse_assigned_appointment: 0,
        children_count: 0,
        male_count: 0,
        female_count: 0,
        matron_assigned_appointment: 0,
      };
      set({ stats: statsData });
      console.log("Nurses Stats fetched:", statsData);
    } catch (error: any) {
      console.error("Stats fetch error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch stats");
      set({ stats: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
