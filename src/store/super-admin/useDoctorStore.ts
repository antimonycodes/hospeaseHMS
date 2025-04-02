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

export interface Doctor {
  id: number;
  type: string;
  attributes: DoctorAttributes;
}
export interface Consultant {
  id: number;
  type: string;
  attributes: ConsultantAttributes;
}

export interface DoctorAttributes {
  first_name: string;
  id: number;
  last_name: string;
  phone: string;
  email: string;
  doctor_id?: string;
  shift_status: "Available" | "Out-of-work";
  details: null | DoctorDetails;
  picture?: string | undefined;
  religion?: string;
  gender?: string;
  age?: number;
  houseAddress?: string;
  is_active: boolean;
  user_id: number;
}
export interface ConsultantAttributes {
  first_name: string;
  id: number;
  last_name: string;
  phone: string;
  email: string;
  consultant_id?: string;
  shift_status: "Available" | "Out-of-work";
  details: null | DoctorDetails;
  picture?: string | undefined;
  religion?: string;
  gender?: string;
  age?: number;
  houseAddress?: string;
  is_active: boolean;
  user_id: number;
}
export interface DoctorDetails {
  dob: string;
  age: number;
  specialization: null;
  license_number: null;
  religion: string;
  address: string;
  is_active: string;
}

export interface CreateDoctorData {
  first_name: string;
  last_name: string;
  dob: string;
  email: string;
  doctor_id: string;
  religion: string;
  phone: string;
  address: string;
}
export interface CreateConsultantData {
  first_name: string;
  last_name: string;
  dob: string;
  email: string;
  consultant_id: string;
  religion: string;
  phone: string;
  address: string;
}

interface DoctorStore {
  isLoading: boolean;
  doctors: Doctor[];
  consultants: any[];
  selectedDoctor: Doctor | null;
  selectedConsultant: Doctor | null;
  getAllDoctors: () => Promise<void>;
  getDoctorById: (id: string) => Promise<void>;
  createDoctor: (data: any) => Promise<void>;
  getAllConsultants: () => Promise<void>;
  getConsultantById: (id: string) => Promise<void>;
  createConsultant: (data: any) => Promise<void>;
}

export const useDoctorStore = create<DoctorStore>((set, get) => ({
  isLoading: false,
  doctors: [],
  selectedDoctor: null,
  consultants: [],
  selectedConsultant: null,

  // Fetch all doctors
  getAllDoctors: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/admin/doctor/fetch");
      const fetchedDoctors = response.data.data.data; // Extract doctor array
      set({ doctors: fetchedDoctors });
      // toast.success("Doctors retrieved successfully!");
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(error.response.message || "Failed to fetch doctors");
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch a single doctor by ID
  getDoctorById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/admin/doctor/fetch/${id}`);
      set({ selectedDoctor: response.data.data }); // Store fetched doctor in state
      // toast.success(response.data.message);
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(
      //   error.response.data.message || "Failed to fetch doctor details"
      // );
    } finally {
      set({ isLoading: false });
    }
  },

  // Create a new doctor
  createDoctor: async (data) => {
    set({ isLoading: true });
    try {
      const payload = {
        ...data,
        doctor_id: data.doctor_id ?? null,
      };
      const response = await api.post("/admin/doctor/create", payload);
      // Refresh the doctors list after creation
      await get().getAllDoctors();
      toast.success(response.data.message);
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch all doctors
  getAllConsultants: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/admin/consultant/fetch");
      const fetchedConsultants = response.data.data.data; // Extract doctor array
      set({ consultants: fetchedConsultants });
      // toast.success(response.data.message);
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch a single doctor by ID
  getConsultantById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/admin/consultant/fetch/${id}`);
      set({ selectedConsultant: response.data.data }); // Store fetched doctor in state
      // toast.success(response.data.message);
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },

  // Create a new doctor
  createConsultant: async (data) => {
    set({ isLoading: true });
    try {
      const payload = {
        ...data,
        consultant_id: data.consultant_id ?? null,
      };
      const response = await api.post("/admin/consultant/create", payload);
      // Refresh the doctors list after creation
      await get().getAllConsultants();
      toast.success(response.data.message);
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));
