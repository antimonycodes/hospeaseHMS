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

interface AdmissionStore {
  isLoading: boolean;
  admissionList: any[];
  currentAdmission: AdmissionDetail | null;
  createAdmission: (data: CreateAdmission) => Promise<any>;
  allAdmission: () => Promise<any>;
  getAdmissionById: (id: number) => Promise<AdmissionDetail | null>;
  updateAdmissionStatus: (id: number, status: string) => Promise<boolean>;
  clearCurrentAdmission: () => void;
}

export const useAdmissionStore = create<AdmissionStore>((set, get) => ({
  isLoading: false,
  admissionList: [],
  currentAdmission: null,

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

  clearCurrentAdmission: () => {
    set({ currentAdmission: null });
  },
}));
