// useStaffProfileStore.ts
import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_APP_BASE_URL ||
    "https://hospease.spadeals.com.ng/v0.1/api",
  headers: {
    "Content-Type": "application/json",
  },
});

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

export interface ChangePasswordData {
  old_password: string | number;
  new_password: string | number;
  new_password_confirmation: string | number;
}

interface ProfileData {
  type: string;
  id: number;
  attributes: {
    first_name: string;
    role: string;
    last_name: string | null;
    email: string;
    phone: string;
    image: string;

    is_active: boolean;
    hospital: {
      id: number;
      name: string;
      logo: string;
    };
    department: null | any;
    created_at: string;
  };
}

interface StaffProfileState {
  profileData: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<any>;
}

export const useStaffProfileStore = create<StaffProfileState>((set, get) => ({
  profileData: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/user");
      set({ profileData: response.data.data, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch profile data";
      set({ error: errorMessage, isLoading: false });
      // toast.error(errorMessage);
    }
  },

  changePassword: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/auth/change-password", data);
      if (response.status === 200 || response.status === 201) {
        console.log("Password changed:", response.data);
        toast.success(response.data.message);
        set({ profileData: response.data.data });
        await get().fetchProfile();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error(
        "Error changing password:",
        error.response?.data || error.message
      );
      toast.error(error.response.data.message);

      return null;
    } finally {
      set({ isLoading: false });
    }
  },
}));
