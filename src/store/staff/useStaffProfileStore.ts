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
    const token = Cookies.get("token");
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
  changePassword: (data: ChangePasswordData) => Promise<boolean>;
}

export const useStaffProfileStore = create<StaffProfileState>((set) => ({
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
      toast.error(errorMessage);
    }
  },

  changePassword: async (data: ChangePasswordData) => {
    set({ isLoading: true, error: null });
    try {
      await api.put("/user/password", {
        old_password: data.old_password,
        new_password: data.new_password,
        new_password_confirmation: data.new_password_confirmation,
      });
      set({ isLoading: false });
      toast.success("Password changed successfully");
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },
}));
