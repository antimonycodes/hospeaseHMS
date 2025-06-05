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

interface AdmissionStore {
  isLoading: boolean;
  admissionList: any[];
  createAdmission: (data: CreateAdmission) => Promise<any>;
  allAdmission: () => Promise<any>;
}

export const useAdmissionStore = create<AdmissionStore>((set, get) => ({
  isLoading: false,
  admissionList: [],

  createAdmission: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/medical-report/admission/create", data);
      if (isSuccessfulResponse(response)) {
        toast.success(response.data?.message);
        // await get().getPaymentSource();
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
        // return response.data.data;
      }
      return null;
    } catch (error) {
      handleErrorToast(error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
}));
