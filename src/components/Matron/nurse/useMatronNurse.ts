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
export interface NextOfKin {
  name: string;
  last_name: string;
  gender: string;
  phone: string;
  occupation: string;
  address: string;
  relationship: string;
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
  age: number;
  religion: string;
  address: string;
}

// Patient interfaces
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

// Interface for Matron Stats
export interface MatronStats {
  total_patient: number;
  clinic_total_appointment: number;
  matron_assigned_appointment: number;
  children_count: number;
}

export interface CreateNurseData {
  first_name: string;
  last_name: string;
  dob: string;
  email: string;
  nurse_id: string;
  religion: string;
  phone: string;
  address: string;
  age: any;
}

// Zustand Store for Matron
interface MatronStore {
  patients: PatientAttributes[];
  selectedPatient: any | null;
  isLoading: boolean;
  nurses: Nurse[];
  selectedNurse: any | null;
  stats: MatronStats | null; // Add stats state
  getNurses: () => Promise<any>;
  getNurseById: (id: string) => Promise<any>;
  createNurse: (data: CreateNurseData) => Promise<any>;
  getMatronStats: () => Promise<void>; // Add stats fetch function
  getAllPatients: () => Promise<void>;
  getPatientById: (id: number) => Promise<void>;
  getMedPatientById: (id: number) => Promise<void>;
}

export const useMatronNurse = create<MatronStore>((set, get) => ({
  isLoading: false,
  nurses: [],
  selectedNurse: null,
  patients: [],
  selectedPatient: null,
  stats: null, // Initialize stats as null

  getNurses: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/matron/nurse/fetch");
      if (response.status === 200 || response.status === 201) {
        console.log(response.data.data);
        set({ nurses: response.data.data.data });
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch nurses");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  getAllPatients: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/matron/all-patients");
      console.log("All Patients Response:", response.data);
      const fetchedPatients = response.data.data || [];
      set({ patients: fetchedPatients });
      toast.success("Patients fetched successfully!");
    } catch (error: any) {
      console.error("Error fetching patients:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch patients");
      set({ patients: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  getPatientById: async (id: number) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/matron/all-patients/${id}`);
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
  getMedPatientById: async (id: number) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/medical-director/patient/${id}`);
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

  getNurseById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/matron/nurse/fetch/${id}`);
      console.log(response.data.data, "genursedata");
      set({ selectedNurse: response.data.data });
      toast.success(response.data.message);
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to fetch nurse details"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  createNurse: async (data: CreateNurseData) => {
    set({ isLoading: true });
    try {
      // Transform empty string to null if needed by the API
      const payload = {
        ...data,
        nurse_id: data.nurse_id === "" ? null : data.nurse_id,
        age: data.age, // Include age
        religion: data.religion, // Include religion
        address: data.address, // Include address
      };
      const response = await api.post("/matron/nurse/create", payload);
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
  // New function to fetch matron stats
  getMatronStats: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/matron/stats");
      const statsData = response.data || {
        total_patient: 0,
        clinic_total_appointment: 0,
        matron_assigned_appointment: 0,
        children_count: 0,
      };
      set({ stats: statsData });
      console.log("Matron Stats fetched:", statsData);
    } catch (error: any) {
      console.error("Stats fetch error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch stats");
      set({ stats: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
