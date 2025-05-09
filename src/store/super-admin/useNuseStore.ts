import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
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
export interface PatientAttributes {
  id?: number;
  first_name: string;
  last_name: string;
  card_id: string;
  phone_number: string | null;
  occupation: string;
  gender: string;
  address: string;
  age: number;
  branch: string | null;
  patient_type?: string;
  hospital?: {
    id: number;
    name: string;
    logo: string;
  };
  clinical_department?: {
    id: number;
    name: string;
  };
  next_of_kin: NextOfKin[];
  created_at?: string;
}
export interface NextOfKin {
  name: string;
  last_name: string;
  gender: string;
  phone: string;
  occupation: string;
  address: string;
  relationship: string;
}

export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  card_id: string;
  phone_number: string;
  occupation: string;
  gender: string;
  address: string;
  patient_type: string;
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
  nurse_id: string | null;
  religion: string;
  phone: string;
  address: string;
  // department_id: number;
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
  isDeleting: boolean;
  isCreating: boolean;
  pagination: Pagination | null;

  nurses: Nurse[];
  frontdesks: any[];
  selectedNurse: any | null;
  selectedFrontdesk: any | null;
  selectedPatient: any | null; // Added selectedPatient property
  getNurses: (page?: string, perPage?: string) => Promise<any>;
  getFrontdesk: () => Promise<any>;
  getNurseById: (id: string) => Promise<any>;
  createNurse: (data: CreateNurseData) => Promise<any>;
  createFrontdesk: (data: any) => Promise<any>;
  getFrontdeskById: (id: string) => Promise<any>;
  updateFrontdek: (id: string, data: any) => Promise<any>;
  getNurseStats: () => Promise<void>;
  stats: NurseStats | null;
  getNurseShiftsById: (id: string) => Promise<any>;
  getPatientById: (id: number) => Promise<void>;
  deleteNurse: (id: string) => Promise<any>;
  updateNurse: (id: string, data: CreateNurseData) => Promise<any>;
}

export const useNurseStore = create<NurseStore>((set, get) => ({
  isLoading: false,
  isDeleting: false,
  isCreating: false,
  pagination: null,
  nurses: [],
  stats: null,
  frontdesks: [],
  selectedNurse: null,
  selectedFrontdesk: null,
  selectedPatient: null,
  getNurses: async (page = "1", perPage = "10") => {
    set({ isLoading: true });
    try {
      const response = await api.get(
        `/admin/nurse/fetch?page=${page}&per_page=${perPage}`
      );
      if (response.status === 200 || response.status === 201) {
        console.log(response.data.data);
        set({ nurses: response.data.data.data });
        set({ pagination: response.data.data.pagination });

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
  getFrontdeskById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/admin/front-desk/all-records/${id}`);

      if (isSuccessfulResponse(response)) {
        // toast.success(response.data?.msg);
        console.log(response.data.data.data);
        set({ selectedFrontdesk: response.data.data });
        return true;
      }
      return null;
    } catch (error) {
      //   handleErrorToast(error, "Failed.");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  updateFrontdek: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await api.put(
        `/admin/front-desk/update-record/${id}`,
        data
      );
      if (isSuccessfulResponse(response)) {
        const updatedFrontdesk = response.data.data.data;

        set((state) => ({
          ...state,
          selectedFrontdesk: updatedFrontdesk,
          frontdesks: state.frontdesks.map((frontdesk) =>
            frontdesk.id === id ? updatedFrontdesk.data : frontdesk
          ),
        }));
        toast.success(response.data?.message);
        return true;
      }
      return null;
    } catch (error) {
      // toast.error(error.response?.data?.message || "Failed to update frontdesk");
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
  getPatientById: async (id: number) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/nurses/all-patients/${id}`);
      console.log("API Response:", response.data); // Log full response
      set({ selectedPatient: response.data.data });
      console.log("Selected Patient Set:", response.data.data);
    } catch (error: any) {
      console.error(
        "Error fetching patient:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Failed to fetch patient details"
      );
    } finally {
      set({ isLoading: false });
    }
  },
  createNurse: async (data: CreateNurseData) => {
    set({ isCreating: true });
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
      set({ isCreating: false });
    }
  },
  updateNurse: async (id: string, data: CreateNurseData) => {
    set({ isCreating: true });
    try {
      const response = await api.put(`/admin/nurse/update/${id}`, data);
      if (response.status === 200) {
        await get().getNurses();
        toast.success(response.data.message);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response.data.message || "Failed to update nurse");
      return null;
    } finally {
      set({ isCreating: false });
    }
  },

  createFrontdesk: async (data: any) => {
    set({ isLoading: true });
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
      console.log("API Response:", response.data);
      // Handle nested data if necessary
      const statsData = response.data || response.data.data;
      set({ stats: statsData });
      // console.log("API Response:", statsData);
    } catch (error: any) {
      console.error("Stats fetch error:", error.response?.data);
      set({ stats: null });
    } finally {
      set({ isLoading: false });
    }
  },
  getNurseShiftsById: async (id) => {
    set({ isLoading: false });
    try {
      const response = await api.get(`/nurses/shift/user-records/${id}`);
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
  deleteNurse: async (id) => {
    set({ isDeleting: true });
    try {
      const response = await api.delete(`admin/nurse/delete/${id}`);

      if (isSuccessfulResponse(response)) {
        toast.success(response.data?.message);
        console.log(response.data.data);
        get().getNurses();
        return true;
      }
      return null;
    } catch (error) {
      handleErrorToast(error);
      return null;
    } finally {
      set({ isDeleting: false });
    }
  },
}));
