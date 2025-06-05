import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useDoctorStore } from "./useDoctorStore";
import {
  handleErrorToast,
  isSuccessfulResponse,
} from "../../utils/responseHandler";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

// Attach bearer token
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

interface CreateAdmission {
  recommended_by: number;
  patient_id: number;
  clinical_department_id: number;
  bed_number: string;
  diagnosis: string;
  status: string;
}

interface CreateFluidBalance {
  type: string;
  iv_input: string;
  oral_input: string;
  urine_input: string;
  vomits_input: string;
  other_input: string;
  admission_id: number;
  comment: string;
}

interface UpdateFluidBalance {
  type?: string;
  iv_input?: string;
  oral_input?: string;
  urine_input?: string;
  vomits_input?: string;
  other_input?: string;
  comment?: string;
}

interface Patient {
  type: string;
  id: number;
  attributes: {
    first_name: string;
    last_name: string;
    card_id: string;
    phone_number: string;
    occupation: string;
    religion: string;
    gender: string;
    address: string;
    age: number;
    branch: string;
    is_admitted: boolean;
    patient_type: string;
    clinical_department: {
      id: number;
      name: string;
    };
    next_of_kin: Array<{
      name: string;
      last_name: string;
      gender: string;
      phone: string;
      occupation: string;
      address: string;
      relationship: string;
      religion: string;
    }>;
    created_at: string;
  };
}

interface AdmissionDetail {
  type: string;
  id: number;
  attributes: {
    patient: Patient;
    clinical_department: {
      id: number;
      name: string;
    };
    bed_number: string;
    recommended_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    status: string;
    recorded_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    diagnosis: string;
    created_at: string;
    updated_at: string;
  };
}

interface FluidBalanceEntry {
  id: number;
  type: string;
  iv_input: string;
  oral_input: string;
  urine_input: string;
  vomits_input: string;
  other_input: string;
  comment: string;
  created_at: string;
  updated_at: string;
}

interface AdmissionStore {
  isLoading: boolean;
  admissionList: any[];
  currentAdmission: AdmissionDetail | null;
  fluidBalanceEntries: FluidBalanceEntry[];
  createAdmission: (data: CreateAdmission) => Promise<any>;
  allAdmission: () => Promise<any>;
  getAdmissionById: (id: number) => Promise<AdmissionDetail | null>;
  updateAdmissionStatus: (id: number, status: string) => Promise<boolean>;
  createFluidBalance: (data: CreateFluidBalance) => Promise<boolean>;
  updateFluidBalance: (
    id: number,
    data: UpdateFluidBalance
  ) => Promise<boolean>;
  getFluidBalanceEntries: (admissionId: number) => Promise<FluidBalanceEntry[]>;
  clearCurrentAdmission: () => void;
}

export const useAdmissionStore = create<AdmissionStore>((set, get) => ({
  isLoading: false,
  admissionList: [],
  currentAdmission: null,
  fluidBalanceEntries: [],

  createAdmission: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/medical-report/admission/create", data);
      if (isSuccessfulResponse(response)) {
        toast.success(response.data?.message);
        return true;
      }
      return null;
    } catch (error) {
      handleErrorToast(error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  allAdmission: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/medical-report/admission/all-records");
      if (isSuccessfulResponse(response)) {
        set({ admissionList: response.data.data.data });
      }
      return null;
    } catch (error) {
      handleErrorToast(error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  getAdmissionById: async (id: number) => {
    set({ isLoading: true });
    try {
      const response = await api.get(
        `/medical-report/admission/all-records/${id}`
      );
      if (isSuccessfulResponse(response)) {
        const admissionDetail = response.data.data;
        set({ currentAdmission: admissionDetail });
        return admissionDetail;
      }
      return null;
    } catch (error) {
      handleErrorToast(error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateAdmissionStatus: async (id: number, status: string) => {
    set({ isLoading: true });
    try {
      const response = await api.patch(
        `/medical-report/admission/update/${id}`,
        {
          status,
        }
      );
      if (isSuccessfulResponse(response)) {
        toast.success(response.data?.message || "Status updated successfully");
        // Update the current admission status locally
        const currentAdmission = get().currentAdmission;
        if (currentAdmission && currentAdmission.id === id) {
          set({
            currentAdmission: {
              ...currentAdmission,
              attributes: {
                ...currentAdmission.attributes,
                status,
              },
            },
          });
        }
        return true;
      }
      return false;
    } catch (error) {
      handleErrorToast(error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  createFluidBalance: async (data: CreateFluidBalance) => {
    set({ isLoading: true });
    try {
      const response = await api.post(
        "/medical-report/admission/fluid-balance",
        data
      );
      if (isSuccessfulResponse(response)) {
        toast.success(
          response.data?.message || "Fluid balance entry created successfully"
        );

        // Refresh fluid balance entries for the current admission
        if (data.admission_id) {
          await get().getFluidBalanceEntries(data.admission_id);
        }

        return true;
      }
      return false;
    } catch (error) {
      handleErrorToast(error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateFluidBalance: async (id: number, data: UpdateFluidBalance) => {
    set({ isLoading: true });
    try {
      const response = await api.patch(
        `/medical-report/admission/update-fluid-balance/${id}`,
        data
      );
      if (isSuccessfulResponse(response)) {
        toast.success(
          response.data?.message || "Fluid balance entry updated successfully"
        );

        // Update local state
        const currentEntries = get().fluidBalanceEntries;
        const updatedEntries = currentEntries.map((entry) =>
          entry.id === id ? { ...entry, ...data } : entry
        );
        set({ fluidBalanceEntries: updatedEntries });

        return true;
      }
      return false;
    } catch (error) {
      handleErrorToast(error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  getFluidBalanceEntries: async (admissionId: number) => {
    set({ isLoading: true });
    try {
      // Assuming there's an endpoint to get fluid balance entries by admission ID
      // If not available, you might need to create one or modify this
      const response = await api.get(
        `/medical-report/admission/fluid-balance/${admissionId}`
      );
      if (isSuccessfulResponse(response)) {
        const entries = response.data.data || [];
        set({ fluidBalanceEntries: entries });
        return entries;
      }
      return [];
    } catch (error) {
      handleErrorToast(error);
      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  clearCurrentAdmission: () => {
    set({ currentAdmission: null, fluidBalanceEntries: [] });
  },
}));
