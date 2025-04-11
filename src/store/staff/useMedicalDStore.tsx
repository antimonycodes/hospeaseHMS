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

interface MedicalDStore {
  isLoading: boolean;
  selectedDoctor: any | null;
  getDoctorById: (id: string) => Promise<any>;
}

export const useMedicalDStore = create<MedicalDStore>((set, get) => ({
  selectedDoctor: null,
  isLoading: false,

  getDoctorById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/medical-director/all-doctors/${id}`);
      console.log(response.data.data);
      set({ selectedDoctor: response.data.data });
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to fetch nurse details"
      );
    } finally {
      set({ isLoading: false });
    }
  },
}));
