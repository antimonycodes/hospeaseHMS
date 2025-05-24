import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
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
    const token = Cookies.get("hhmstxt");
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
export interface PatientStats {
  total_patient: number;
  men_total_count: number;
  ladies_total_count: number;
  children_count: number;
  graph_appointment_representation?: Record<string, number>;
}

interface PatientStore {
  isLoading: boolean;
  patients: any[];
  pagination: Pagination | null;
  selectedPatient: any | null;
  appointments: { data: any[]; pagination?: Pagination | null } | null;
  selectedAppointment: any | null;
  labPatients: LabPatient[];

  // stats: {
  //   total_patient: number;
  //   men_total_count: number;
  //   ladies_total_count: number;
  //   children_count: number;
  //   graph_appointment_representation?: Record<string, number>;
  // } | null;
  getAllPatients: (
    page?: string,
    perPage?: string,
    endpoint?: string
  ) => Promise<void>;
  getAllPatientsNoPerPage: () => Promise<void>;
  getPatientById: (id: string) => Promise<void>;
  updatePatient: (id: string, patientData: any) => Promise<any>;
  getPharPatientById: (id: string) => Promise<any>;
  getFdeskPatientById: (id: string) => Promise<any>;
  getLabPatientById: (id: string) => Promise<any>;
  getPatientByIdDoc: (id: string) => Promise<any>;
  createPatient: (
    data: CreatePatientData,
    endpoint?: string
    // refreshendpoint?: string
  ) => Promise<boolean | null>;
  getAllAppointments: (
    page?: string,
    perPage?: string,
    endpoint?: string
  ) => Promise<void>;
  bookAppointment: (
    data: BookAppointmentData,
    endpoint?: string,
    refreshEndpoint?: string
  ) => Promise<boolean>;
  getAppointmentById: (id: string, endpoint: any) => Promise<void>;
  manageAppointment: (id: string, data: any, endpoint: any) => Promise<any>;
  searchPatients: (query: string) => Promise<any[]>;
  // searchAppointment: (query: string) => Promise<any[]>;
  getLabPatients: (endpoint?: string) => Promise<void>; // New function for lab patients
  searchPatientsappointment: (query: string) => Promise<any[]>;
  getFrontdeskStats: () => Promise<void>;
  stats: PatientStats | null;
  getDeskByIdDoc: (id: string) => Promise<any>;
}

export const usePatientStore = create<PatientStore>((set, get) => ({
  isLoading: true,
  patients: [],
  stats: null,

  selectedPatient: null,
  appointments: { data: [], pagination: null },
  pagination: null,
  selectedAppointment: null,
  labPatients: [],

  getAllPatients: async (
    page = "1",
    perPage = "10",
    baseEndpoint = "/admin/patient/fetch"
  ) => {
    set({ isLoading: true });
    try {
      // Construct the full endpoint with query parameters
      const endpoint = `${baseEndpoint}?page=${page}&per_page=${perPage}`;

      console.log("Fetching patients from:", endpoint);

      const response = await api.get(endpoint);
      set({ pagination: response.data.data.pagination });
      console.log(response.data.data.pagination, "pagination");
      const fetchedPatients = response.data.data.data || response.data.data;
      set({ patients: fetchedPatients });
      console.log(response.data.message);
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(error.response?.data?.message || "Failed to fetch patients");
    } finally {
      set({ isLoading: false });
    }
  },

  getAllPatientsNoPerPage: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/medical-report/all-patient");
      set({ pagination: response.data.data.pagination });
      console.log(response.data.data.pagination, "pagination");
      const fetchedPatients = response.data.data;
      set({ patients: fetchedPatients });
      console.log(response.data.message);
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(error.response?.data?.message || "Failed to fetch patients");
    } finally {
      set({ isLoading: false });
    }
  },

  getFrontdeskStats: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/front-desk/stats");
      if (response.status === 200) {
        set({ stats: response.data.data });
        // toast.success(response.data.message);
      }
    } catch (error: any) {
      console.error(
        "Error fetching front-desk stats:",
        error.response?.data || error.message
      );
      // toast.error(error.response?.data?.message || "Failed to fetch stats");
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
      // toast.error(
      //   error.response?.data?.message || "Failed to fetch laboratory patients"
      // );
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
      // toast.error(error.response?.data?.message || "Failed to fetch patients");
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
      // toast.error(
      //   error.response?.data?.message || "Failed to fetch patient details"
      // );
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
      // toast.error(
      //   error.response?.data?.message || "Failed to fetch patient details"
      // );
    } finally {
      set({ isLoading: false });
    }
  },
  getFdeskPatientById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/front-desk/patient/fetch/${id}`);
      console.log(response.data.data);
      set({ selectedPatient: response.data.data }); // Store fetched doctor in state
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(
      //   error.response?.data?.message || "Failed to fetch patient details"
      // );
    } finally {
      set({ isLoading: false });
    }
  },
  getLabPatientById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/laboratory/patient/all/${id}`);
      console.log(response.data.data);
      set({ selectedPatient: response.data.data }); // Store fetched doctor in state
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(
      //   error.response?.data?.message || "Failed to fetch patient details"
      // );
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
      // toast.error(
      //   error.response?.data?.message || "Failed to fetch patient details"
      // );
    } finally {
      set({ isLoading: false });
    }
  },
  getDeskByIdDoc: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/front-desk/patient/fetch/${id}`);
      console.log(response.data.data);
      set({ selectedPatient: response.data.data }); // Store fetched doctor in state
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(
      //   error.response?.data?.message || "Failed to fetch patient details"
      // );
    } finally {
      set({ isLoading: false });
    }
  },

  // Create a new Patient
  createPatient: async (
    data,
    endpoint = "/admin/patient/create"
    // refreshendpoint
  ) => {
    set({ isLoading: true });
    try {
      const payload = {
        ...data,
        branch_id: data.branch_id ?? null,
      };
      const response = await api.post(endpoint, payload);
      if (response.status === 201) {
        const newPatient = {
          id: response.data.data.id,
          attributes: response.data.data.attributes,
        };

        set((state) => ({
          patients: [newPatient, ...state.patients],
        }));

        toast.success(response.data.message);
        return true;
      }

      return null;
    } catch (error: any) {
      console.error(error.response?.data);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updatePatient: async (id: string, patientData: any) => {
    set({ isLoading: true });
    try {
      const response = await api.put(
        // `/admin/patient/update/${id}`,
        `/admin/patient/update/${id}`,
        patientData
      );

      if (isSuccessfulResponse(response)) {
        console.log(response);
        toast.success(response.data.message);
        const updatedPatient = response.data.data || response.data.data.data;
        // Update the patient in the state
        set((state) => ({
          ...state,
          selectedPatient: updatedPatient,
          patients: state.patients.map((patient) =>
            patient.id === id ? updatedPatient.data : patient
          ),
        }));
        // toast.success(response.data.message);

        return updatedPatient;
        // return true;
      }
      return null;
    } catch (error) {
      handleErrorToast(error);
      console.log(error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  searchPatients: async (query: string, page = "1", perPage = "10") => {
    try {
      const response = await api.get(
        `/medical-report/all-patient?search=${encodeURIComponent(
          query
        )}&page=${page}&per_page=${perPage}`
      );
      console.log(response.data.data);

      usePatientStore.setState({
        patients: response.data.data.data || response.data.data,
        pagination: response.data.data.pagination || null,
      });
      return response.data.data.data || response.data.data;
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(error.response?.data?.message || "Search failed");
      return [];
    }
  },
  // searchAppointment: async (query: string, page = "1", perPage = "10") => {
  //   try {
  //     const response = await api.get(
  //       `/medical-report/all-patient?search=${encodeURIComponent(
  //         query
  //       )}&page=${page}&per_page=${perPage}`
  //     );
  //     console.log(response.data.data);

  //     usePatientStore.setState({
  //       appointments: response.data.data.data || response.data.data,
  //       pagination: response.data.data.pagination || null,
  //     });
  //     return response.data.data.data || response.data.data;
  //   } catch (error: any) {
  //     console.error(error.response?.data);
  //     // toast.error(error.response?.data?.message || "Search failed");
  //     return [];
  //   }
  // },
  searchPatientsappointment: async (query: string) => {
    try {
      const response = await api.get(
        `/medical-report/all-patient?search=${query}`
      );
      console.log("API response:", response.data); // Log to inspect structure
      // Adjust based on actual structure, e.g., response.data.data or response.data.data.data
      return response.data.data.data || response.data.data || [];
    } catch (error: any) {
      console.error("Search error:", error.response?.data);
      // toast.error(error.response?.data?.message || "Search failed");
      return [];
    }
  },

  // In usePatientStore.ts
  getAllAppointments: async (
    page = "1",
    perPage = "10",
    baseEndpoint = "/medical-report/appointment/all-records"
  ) => {
    set({ isLoading: true, appointments: { data: [] }, pagination: null });
    try {
      const endpoint = `${baseEndpoint}?page=${page}&per_page=${perPage}`;
      console.log("Fetching appointments from:", endpoint);

      const response = await api.get(endpoint);
      if (!response.data?.data) {
        throw new Error("Invalid response structure");
      }

      // Normalize appointment data
      const rawAppointments = response.data.data.data || response.data.data;
      const normalizedAppointments = rawAppointments.map((appt: any) => ({
        id: appt.id,
        attributes: {
          id: appt.id,
          patient: appt.attributes.patient || appt.patient_name || "Unknown",
          gender: appt.attributes.gender || "N/A",
          card_id: appt.attributes.card_id || "N/A",
          patient_contact: appt.attributes.patient_contact || "N/A",
          occupation: appt.attributes.occupation || "N/A",
          doctor: appt.attributes.doctor || appt.doctor_name || null,
          department: appt.attributes.department || null,
          status: appt.attributes.status || "pending",
          rescheduled_data: appt.attributes.rescheduled_data || null,
          doctor_contact: appt.attributes.doctor_contact || "N/A",
          department_contact: appt.attributes.department_contact || null,
          date: appt.date || appt.attributes.appointment_date || "",
          time: appt.time || appt.attributes.appointment_time || "",
          reason_if_rejected_or_rescheduled:
            appt.attributes.reason_if_rejected_or_rescheduled || null,
          assigned_by: appt.attributes.assigned_by || "N/A",
          created_at: appt.attributes.created_at || "",
          responded_at: appt.attributes.responded_at || null,
        },
      }));

      console.log("Normalized appointments:", normalizedAppointments);

      // Normalize pagination data
      const paginationData = response.data.data.pagination || {
        total: rawAppointments.length,
        per_page: parseInt(perPage),
        current_page: parseInt(page),
        last_page: Math.ceil(rawAppointments.length / parseInt(perPage)),
        from: 1,
        to: rawAppointments.length,
      };

      // FIX: Store the normalized data structure consistently
      set({
        appointments: {
          data: normalizedAppointments,
          pagination: paginationData,
        },
        pagination: paginationData,
      });
      console.log("Appointments loaded:", normalizedAppointments);
    } catch (error: any) {
      console.error("Error fetching appointments:", error);
      // toast.error(error.message || "Failed to fetch appointments");
      set({ appointments: { data: [] }, pagination: null });
    } finally {
      set({ isLoading: false });
    }
  },

  bookAppointment: async (
    data: BookAppointmentData,
    endpoint = "/medical-report/appointment/book"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.post(endpoint, data);

      if (response.status === 201) {
        toast.success(response.data.message);

        // Normalize the new appointment data consistently
        const appt = response.data.data;
        const newAppointment = {
          id: appt.id,
          attributes: {
            id: appt.id,
            patient: appt.attributes?.patient || appt.patient_name || "Unknown",
            gender: appt.attributes?.gender || "N/A",
            card_id: appt.attributes?.card_id || "N/A",
            patient_contact: appt.attributes?.patient_contact || "N/A",
            occupation: appt.attributes?.occupation || "N/A",
            doctor: appt.attributes?.doctor || appt.doctor_name || null,
            department: appt.attributes?.department || null,
            status: appt.attributes?.status || "pending",
            rescheduled_data: appt.attributes?.rescheduled_data || null,
            doctor_contact: appt.attributes?.doctor_contact || "N/A",
            department_contact: appt.attributes?.department_contact || null,
            date: appt.date || appt.attributes?.appointment_date || "",
            time: appt.time || appt.attributes?.appointment_time || "",
            reason_if_rejected_or_rescheduled:
              appt.attributes?.reason_if_rejected_or_rescheduled || null,
            assigned_by: appt.attributes?.assigned_by || "N/A",
            created_at: appt.attributes?.created_at || "",
            responded_at: appt.attributes?.responded_at || null,
          },
        };

        // FIX: Update state with consistent structure and prevent duplicates
        set((state) => {
          const currentAppointments = state.appointments?.data || [];

          // Check if appointment already exists to prevent duplicates
          const existingIndex = currentAppointments.findIndex(
            (existing) => existing.id === newAppointment.id
          );

          let updatedAppointments;
          if (existingIndex >= 0) {
            // Replace existing appointment
            updatedAppointments = [...currentAppointments];
            updatedAppointments[existingIndex] = newAppointment;
          } else {
            // Add new appointment to the beginning
            updatedAppointments = [newAppointment, ...currentAppointments];
          }

          return {
            appointments: {
              data: updatedAppointments,
              pagination: state.appointments?.pagination || state.pagination,
            },
            // pagination: {
            //   ...state.pagination,
            //   total:
            //     existingIndex >= 0
            //       ? state.pagination?.total || 0
            //       : (state.pagination?.total || 0) + 1,
            //   to:
            //     existingIndex >= 0
            //       ? state.pagination?.to || 0
            //       : (state.pagination?.to || 0) + 1,
            // },
          };
        });

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

  getAppointmentById: async (id, endpoint) => {
    set({ isLoading: true });
    try {
      // Use the provided endpoint parameter in the API call
      const response = await api.get(`${endpoint}/${id}`);
      set({ selectedAppointment: response.data.data });
      console.log(response.data.data, "selectedAppointment");
      return response.data.data;
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(
      //   error.response?.data?.message || "Failed to fetch appointment details"
      // );
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Updated to match how it's called in the handler functions
  manageAppointment: async (
    id,
    data,
    endpoint = "/doctor/manage-appointment"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`${endpoint}/${id}`, data);
      if (response.status === 200) {
        // toast.success(response.data.message);
        // await get().getAllAppointments();
        return true;
      }
      return null;
    } catch (error: any) {
      console.error(error.response?.data);
      // toast.error(
      //   error.response?.data?.message || "Failed to manage appointment"
      // );
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
}));
