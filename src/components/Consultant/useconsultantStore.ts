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

export interface ConsultantAttributes {
  status(status: any): unknown;
  first_name: string;
  id: number;
  last_name: string;
  phone: string;
  email: string;
  consultant_id?: string;
  shift_status: "Available" | "Out-of-work";
  picture?: string | undefined;
  religion?: string;
  gender?: string;
  age?: number;
  houseAddress?: string;
  is_active: boolean;
  user_id: number;
}
export interface Consultant {
  id: number;
  type: string;
  attributes: ConsultantAttributes;
}

interface ConsultantStore {
  isLoading: boolean;
  consultants: ConsultantAttributes[]; // Add consultants to the store
  getAllConsultants: () => Promise<void>;
}

export const useconsultantStore = create<ConsultantStore>((set, get) => ({
  isLoading: false, // Initialize isLoading with a default value
  consultants: [], // Initialize consultants with an empty array

  getAllConsultants: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/consultant/my-appointments");
      const fetchedConsultants = response.data.data.data; // Extract consultant array
      set({ consultants: fetchedConsultants });
      console.log("Consultants fetched successfully:", fetchedConsultants);
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to fetch consultants"
      );
    } finally {
      set({ isLoading: false });
    }
  },
}));
