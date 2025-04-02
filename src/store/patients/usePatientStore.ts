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

export interface PatientAttributes {
  first_name: string;
  id: number;
  last_name: string;
  phone_number: string;

  card_id?: string;
  occupation: string;
  gender?: string;
  age?: number;
  address?: string;
  active: boolean;
}
export interface Patient {
  id: number;
  type: string;
  attributes: PatientAttributes;
}
export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

interface PatientStore {
  patients: Patient[];
  isLoading: boolean;
  selectedPatient: any | null;
  getPatients: () => Promise<any>;
  getPatientById: (id: number) => Promise<any>;
}

export const usePatientStore = create<PatientStore>((set, get) => ({
  isLoading: false,
  patients: [],
  selectedPatient: null,

  //
  getPatients: async () => {
    set({ isLoading: true });
    // try {
    //   const response = await api.get("/doctor/patient/fetch");
    //   const fetchedPatients = response.data.data;
    //   set({ patients: fetchedPatients });
    //   toast.success("Patients details retrieved successfully!");
    // } catch (error: any) {
    //   console.error(error.response?.data);
    //   toast.error(error.message || "Failed to fetch patients");
    // } finally {
    //   set({ loading: false });
    // }
    //
    try {
      const response = await api.get("/doctor/patient/fetch");
      if (response.status === 200 || response.status === 201) {
        console.log(response.data.data);
        set({ patients: response.data.data.data });
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch patients");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  getPatientById: async (id) => {
    set({ isLoading: false });
    // try {
    //   const response = await api.get(`/admin/patient/fetch/${id}`);
    //   set({ selectedPatient: response.data.data }); // Changed from selectedDoctor to selectedPatient
    //   toast.success("Patient details retrieved successfully!");
    // } catch (error: any) {
    //   console.error(error.response?.data);
    //   toast.error(error.message || "Failed to fetch patient details");
    // } finally {
    //   set({ loading: false });
    // }
    try {
      const response = await api.get(`/doctor/patient/fetch/${id}`);
      console.log(response.data.data);
      set({ selectedPatient: response.data.data }); // Store fetched doctor in state
      // toast.success(response.data.message);
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(error.message || "Failed to fetch doctor details");
    } finally {
      set({ isLoading: false });
    }
  },
}));
