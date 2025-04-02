// // usePatientStore.ts
import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

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
}

interface PatientStore {
  isLoading: boolean;
  patients: any[];
  selectedPatient: any | null;
  appointments: any[];

  getAllPatients: (endpoint?: string) => Promise<void>;
  getPatientById: (id: string) => Promise<void>;
  createPatient: (data: CreatePatientData) => Promise<boolean | null>;
  getAllAppointments: () => Promise<void>;
}

export const usePatientStore = create<PatientStore>((set, get) => ({
  isLoading: true,
  patients: [],
  selectedPatient: null,
  appointments: [],

  // Fetch all patient
  getAllPatients: async (endpoint = "/admin/patient/fetch") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);

      const fetchedPatients = response.data.data.data; // Extract doctor array
      set({ patients: fetchedPatients });
      console.log(response.data.message);
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
      set({ selectedPatient: response.data.data }); // Store fetched doctor in state
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to fetch patient details"
      );
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
        toast.success(response.data.message);
        return true;
      }
      return null;
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to add patient");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  getAllAppointments: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/admin/appointment/all-records");
      if (response.data && response.data.data) {
        set({ appointments: response.data.data.data });
        console.log("Appointments loaded successfully");
      } else {
        set({ appointments: [] });
        console.log("No appointments data found");
      }
    } catch (error: any) {
      console.error("Error fetching appointments:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch appointments"
      );
      set({ appointments: [] });
    } finally {
      set({ isLoading: false });
    }
  },
}));
