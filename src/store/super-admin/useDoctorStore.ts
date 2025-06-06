import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import {
  handleErrorToast,
  isSuccessfulResponse,
} from "../../utils/responseHandler";
import { Pagination } from "./usePatientStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach the bearer token
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

export interface Doctor {
  id: number;
  type: string;
  attributes: DoctorAttributes;
}
export interface Department {
  id: number;
  type: string;
  attributes: DoctorAttributes;
}
export interface DepartmentAttributes {
  id: number;
  name: string;
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
  department_id: number;
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
  department_id: number;
}

interface DoctorStore {
  isLoading: boolean;
  pagination: Pagination | null;

  isDeleting: boolean;
  isUpdating: boolean;
  doctors: Doctor[];
  department: Department[];
  consultants: any[];
  selectedDoctor: Doctor | null;
  selectedConsultant: Doctor | null;
  getAllDoctors: (
    page?: string,
    perPage?: string,
    endpoint?: string
  ) => Promise<void>;
  getDoctorById: (id: string) => Promise<void>;
  createDoctor: (
    data: any,
    endpoint?: string,
    refreshEndpoint?: string
  ) => Promise<void>;
  getAllConsultants: (endpoint?: string) => Promise<void>;
  getConsultantById: (id: string, endpoint?: string) => Promise<void>;
  createConsultant: (
    data: any,
    endpoint?: string,
    refreshEndpoint?: string
  ) => Promise<void>;
  getMedDoctorById: (id: string) => Promise<void>;
  getAllDepartment: () => Promise<void>;
  deleteDoctor: (id: string) => Promise<any>;
  updateDoctor: (id: number | string, data: any) => Promise<any>;
  updateConsultant: (id: number | string, data: any) => Promise<any>;
}

export const useDoctorStore = create<DoctorStore>((set, get, endpoint) => ({
  isLoading: false,
  isDeleting: false,
  isUpdating: false,
  doctors: [],
  selectedDoctor: null,
  consultants: [],
  selectedConsultant: null,
  department: [],
  pagination: null,

  // Fetch all doctors
  getAllDoctors: async (
    page = "1",
    perPage = "10",
    baseEndpoint = "/admin/doctor/fetch"
  ) => {
    set({ isLoading: true });
    try {
      const endpoint = `${baseEndpoint}?page=${page}&per_page=${perPage}`;
      const response = await api.get(endpoint);
      const fetchedDoctors = response.data.data.data; // Extract doctor array
      set({ doctors: fetchedDoctors });
      set({ pagination: response.data.data.pagination });

      // toast.success("Doctors retrieved successfully!");
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(error.response.message || "Failed to fetch doctors");
    } finally {
      set({ isLoading: false });
    }
  },
  getAllDepartment: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get(
        "/front-desk/branches/clinical-department-fetch"
      );
      const fetchedDepartment = response.data.data;
      set({ department: fetchedDepartment });
    } catch (error: any) {
      console.error(error.response?.data);
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
  getMedDoctorById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/medical-director/all-doctors/${id}`);
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
  createDoctor: async (
    data,
    endpoint = "/admin/doctor/create",
    refreshEndpoint
  ) => {
    set({ isLoading: true });
    try {
      const payload = {
        ...data,
        doctor_id: data.doctor_id ?? null,
      };
      const response = await api.post(endpoint, payload);
      // Refresh the doctors list after creation
      await get().getAllDoctors(refreshEndpoint);
      toast.success(response.data.message);
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
  updateDoctor: async (id, data, endpoint = "/admin/doctor/update") => {
    set({ isUpdating: true });
    try {
      const response = await api.put(`${endpoint}/${id}`, data);

      toast.success(response.data.message);
    } catch (error) {
      console.error("Error updating doctor:", error);
    } finally {
      set({ isUpdating: false });
    }
  },
  updateConsultant: async (id, data, endpoint = "/admin/consultant/update") => {
    set({ isUpdating: true });
    try {
      const response = await api.put(`${endpoint}/${id}`, data);

      toast.success(response.data.message);
    } catch (error) {
      console.error("Error updating doctor:", error);
    } finally {
      set({ isUpdating: false });
    }
  },

  // Fetch all consultants
  getAllConsultants: async (endpoint = "/admin/consultant/fetch") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      const fetchedConsultants = response.data.data.data; // Extract consultant array
      set({ consultants: fetchedConsultants });
      console.log("Consultants fetched successfully:", fetchedConsultants);
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(
      //   error.response?.data?.message || "Failed to fetch consultants"
      // );
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
  createConsultant: async (
    data,
    endpoint = "/admin/consultant/create",
    refreshEndpoint
  ) => {
    set({ isLoading: true });
    try {
      const payload = {
        ...data,
        consultant_id: data.consultant_id ?? null,
      };
      const response = await api.post(endpoint, payload);
      // Refresh the doctors list after creation
      await get().getAllConsultants(refreshEndpoint);
      toast.success(response.data.message);
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteDoctor: async (id) => {
    set({ isDeleting: true });
    try {
      const response = await api.delete(`admin/doctor/delete/${id}`);

      if (isSuccessfulResponse(response)) {
        toast.success(response.data?.message);
        console.log(response.data.data);
        get().getAllDoctors();
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
