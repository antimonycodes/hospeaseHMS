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

interface ProfileStore {
  isLoading: boolean;
  profileData: any | null;
  getProfileData: () => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<any>;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  isLoading: false,
  profileData: null,

  getProfileData: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/admin/profile/my-profile");
      console.log("Profile data fetched:", response.data);
      console.log(response.data);
      set({ profileData: response.data.data });
    } catch (error: any) {
      console.error(
        "Error fetching profile:",
        error.response?.data || error.message
      );
    } finally {
      set({ isLoading: false });
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
        await get().getProfileData();
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
