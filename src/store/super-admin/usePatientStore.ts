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

export interface NextOfKin {
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
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface BookAppointmentData {
  patient_id: number;
  user_id: number; // staff selcted to attend to the patient
  date: string;
  time: string;
}

export interface LabPatient {
  id: number;
  name: string;
  patientid: string;
  phone: string;
  gender: string;
  status: "Pending" | "Ongoing" | "Completed";
}

interface PatientStore {
  isLoading: boolean;
  patients: any[];
  pagination: Pagination | null;
  selectedPatient: any | null;
  appointments: any[];
  selectedAppointment: any | null;
  labPatients: LabPatient[];

  getAllPatients: (endpoint?: string) => Promise<void>;
  getPatientById: (id: string) => Promise<void>;
  getPharPatientById: (id: string) => Promise<any>;
  getPatientByIdDoc: (id: string) => Promise<any>;
  createPatient: (
    data: CreatePatientData,
    endpoint?: string,
    refreshendpoint?: string
  ) => Promise<boolean | null>;
  getAllAppointments: (endpoint?: string) => Promise<void>;
  bookAppointment: (
    data: BookAppointmentData,
    endpoint?: string,
    refreshEndpoint?: string
  ) => Promise<boolean>; // Updated signature
  getAppointmentById: (id: string) => Promise<void>;
  manageAppointment: (id: string, data: any) => Promise<any>;
  searchPatients: (query: string) => Promise<any[]>;
  getLabPatients: (endpoint?: string) => Promise<void>; // New function for lab patients
}

export const usePatientStore = create<PatientStore>((set, get) => ({
  isLoading: true,
  patients: [],
  selectedPatient: null,
  appointments: [],
  pagination: null,
  selectedAppointment: null,
  labPatients: [],

  // Fetch all patient
  getAllPatients: async (endpoint = "/admin/patient/fetch") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      set({ pagination: response.data.data.pagination });
      console.log(response.data.data.pagination, "pagination");
      const fetchedPatients = response.data.data.data;
      const pharmacyid = response.data[0];
      set({ patients: fetchedPatients });
      console.log(response.data.message);
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(error.response?.data?.message || "Failed to fetch patients");
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch lab patients
  getLabPatients: async (endpoint = "/laboratory/patient/all") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      if (response.data && response.data.data) {
        // Transform API data to match our component's expected structure
        const formattedData = response.data.data.map((patient: any) => ({
          id: patient.id,
          name: `${patient.first_name || ""} ${patient.last_name || ""}`.trim(),
          patientid: patient.card_id || "N/A",
          phone: patient.phone_number || "",
          gender: patient.gender || "",
          status: patient.test_status || "Pending",
        }));

        set({ labPatients: formattedData });
        console.log("Lab patients loaded:", formattedData);
      }
    } catch (error: any) {
      console.error("Error fetching lab patients:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch laboratory patients"
      );
      set({ labPatients: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch all  Nurses
  getAllNurses: async (endpoint = "/admin/patient/fetch") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);

      const fetchedNurses = response.data.data.data; // Extract doctor array
      set({ patients: fetchedNurses });
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

  getPharPatientById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/pharmacy/patient/all/${id}`);
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

  getPatientByIdDoc: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/doctor/patient/${id}`);
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
  createPatient: async (
    data,
    endpoint = "/admin/patient/create",
    refreshendpoint
  ) => {
    set({ isLoading: true });
    try {
      const payload = {
        ...data,
        branch_id: data.branch_id ?? null,
      };
      const response = await api.post(endpoint, payload);
      if (response.status === 201) {
        // Refresh the doctors list after creation
        await get().getAllPatients(refreshendpoint);
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

  searchPatients: async (query: string) => {
    try {
      const response = await api.get(`/admin/patient/fetch?search=${query}`);
      return response.data.data.data; // returns an array of matching patients
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Search failed");
      return [];
    }
  },

  getAllAppointments: async (endpoint = "/admin/appointment/all-records") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
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

  bookAppointment: async (
    data: BookAppointmentData,
    endpoint = "/admin/appointment/assign",
    refreshEndpoint = "/admin/appointment/all-records"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.post(endpoint, data);
      if (response.status === 201) {
        console.log(response.data.message);
        toast.success(response.data.message);
        await get().getAllAppointments(refreshEndpoint); // Refresh with front desk endpoint
        return true;
      }
      return false;
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to book appointment"
      );
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  getAppointmentById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/doctor/my-appointments/${id}`);
      set({ selectedAppointment: response.data.data });
      console.log(response.data.data, "selectedAppointment");
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to fetch appointment details"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  manageAppointment: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await api.patch(
        `/doctor/manage-appointment/${id}`,
        data
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        await get().getAllAppointments();
        return true;
      }
      return null;
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to manage appointment"
      );
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
}));
