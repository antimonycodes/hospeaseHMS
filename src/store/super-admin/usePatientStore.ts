import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useStatsStore } from "./useStatsStore";

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

interface NextOfKin {
  name: string;
  last_name: string;
  gender: string;
  phone: string;
  occupation: string;
  address: string;
  relationship: string;
}

export interface CreatePatientData {
  branch_id: string | null;
  first_name: string;
  last_name: string;
  card_id: string;
  gender: string;
  phone_number: string;
  occupation: string;
  religion: string;
  address: string;
  patient_type: string;
  next_of_kin: NextOfKin[];
  dob: string;
  clinical_patient_type: number;
}

// Appointment interfaces
interface AppointmentAttributes {
  doctor: string;
  status: "pending" | "approved" | "rejected" | "rescheduled";
  rescheduled_data: any | null;
  doctor_contact: string | null;
  gender: string;
  patient_contact: string;
  occupation: string;
  patient: string;
  date: string;
  reason_if_rejected_or_rescheduled: string | null;
  assigned_by: string;
  time: string;
  created_at: string;
}

interface AppointmentData {
  type: string;
  id: number;
  attributes: AppointmentAttributes;
}

export interface CreateAppointment {
  patient_id: string;
  user_id: string;
  date: string;
  time: string;
}

interface PatientStore {
  isLoading: boolean;
  patients: any[];
  selectedPatient: any | null;
  appointments: AppointmentData[];
  pagination: null;

  getAllPatients: (page?: number) => Promise<void>;
  getPatientById: (id: string) => Promise<void>;
  createPatient: (data: CreatePatientData) => Promise<any>;
  getAllAppointments: () => Promise<any>;
  createAppointment: (data: CreateAppointment) => Promise<any>;
}

export const usePatientStore = create<PatientStore>((set, get) => ({
  isLoading: true,
  patients: [],
  selectedPatient: null,
  appointments: [],
  pagination: null,
  getAllPatients: async (page = 0) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/admin/patient/fetch/${page}`);
      // const fetchedPatients = response.data.data.data;
      const fetchedPatients = Array.isArray(response.data.data.data)
        ? response.data.data.data
        : [response.data.data]; // Wrap the single object in an array

      set({
        patients: fetchedPatients,
        pagination: response.data.data.pagination,
      });
      console.log(response.data.data.pagination);
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch patients");
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch a single patient by ID
  getPatientById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/admin/patient/fetch/${id}`);
      console.log(response.data.data);
      set({ selectedPatient: response.data.data });
      // toast.success(response.data.message);
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(error.message || "Failed to fetch doctor details");
    } finally {
      set({ isLoading: false });
    }
  },

  // Create a new Patient
  createPatient: async (data) => {
    set({ isLoading: true });
    try {
      const payload = {
        ...data,
        branch_id: data.branch_id ?? null,
      };
      const response = await api.post("/admin/patient/create", payload);
      if (response.status === 201) {
        // Refresh the doctors list after creation
        await get().getAllPatients();
        useStatsStore.getState().getStats();
        useStatsStore.getState().getClinicalStats();
        toast.success(response.data.message);
        return true;
      }
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response.data.message || "Failed to add doctor");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  getAllAppointments: async (page = 1) => {
    set({ isLoading: true });
    try {
      const response = await api.get(
        `/admin/appointment/all-records?page=${page}`
      );

      if (response.data.status) {
        set({
          appointments: response.data.data.data,
          // pagination: response.data.data.pagination,
        });
        // toast.success(response.data.message);
        return true;
      }
      console.log(response.data.data.data);
      return false;
    } catch (error: any) {
      console.error(
        "Error fetching appointments:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Failed to load appointments"
      );
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  createAppointment: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/admin/appointment/assign", data);
      if (response.data.success) {
        toast.success(response.data.message);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response.data.message || "Failed to add appointment");
      return null;
    }
  },
}));
