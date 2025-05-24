import { create } from "zustand";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import {
  handleErrorToast,
  isSuccessfulResponse,
} from "../../utils/responseHandler";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, //
});

// const getCsrfToken = () => {
//   return Cookies.get("XSRF-TOKEN");
// };

// // Update Axios headers
// api.interceptors.request.use((config) => {
//   config.headers["X-XSRF-TOKEN"] = getCsrfToken();
//   return config;
// });

// --- Data Payload Interfaces ---

export interface LoginData {
  email: string;
  password: string;
}
export interface SignupData {
  name: string;
  phone: string;
  address: string;
  email: string;
  logo: File | null;
  // cac_docs: File | null;
}

interface ForgotPassword {
  email: string;
}

interface AuthStore {
  isLoading: boolean;
  login: (data: LoginData) => Promise<any>;
  signup: (data: SignupData) => Promise<any>;
  logout: () => Promise<void>;
  forgotPassword: (data: ForgotPassword) => Promise<any>;
  user: any[];
  role: string;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLoading: false,
  user: [],
  role: "",
  isAuthenticated: false,

  login: async (data) => {
    set({ isLoading: true });
    try {
      // Cookies.remove("XSRF-TOKEN");
      // Cookies.remove("hospease_session");
      // localStorage.clear();

      const response = await api.post("/auth/login", data);
      if (response.status === 200) {
        // console.log(response.data.data.token, "token");
        // set({ user: response.data.data.user });
        // console.log(response.data.data.user.attributes.role, "role");
        set({
          role: response.data.data.user.attributes.role,
          isAuthenticated: true,
        });
        const token = response.data.data.token;
        sessionStorage.setItem("userId", response.data.data.user.id);
        console.log(response.data.data.user.id, "idd");
        console.log(response.data.data.user.id, "idd");
        // Cookies.set("token", token, { expires: 1, secure: true });
        Cookies.set("hhmstxt", token, { expires: 30, secure: true });
        localStorage.setItem("role", response.data.data.user.attributes.role);
        localStorage.setItem(
          "hospitalName",
          response.data.data.user.attributes.hospital.name
        );
        localStorage.setItem(
          "hospitalLogo",
          response.data.data.user.attributes.hospital.logo
        );
        localStorage.setItem(
          "hmo",
          response.data.data.user.attributes.hospital.hmo_percentage
        );
        localStorage.setItem("uid", response.data.data.user.id);
        toast.success(response.data.message);
        return true;
      }
      return false;
    } catch (error: any) {
      console.log(error.response.data.message);
      const errorMessage =
        error.response?.data?.message || "Login failed! Please try again.";
      toast.error(errorMessage);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    localStorage.removeItem("role");
    Cookies.remove("token");
    set({ user: [], role: "", isAuthenticated: false });
  },
  signup: async (data) => {
    set({ isLoading: true });

    try {
      if (
        !data.name ||
        !data.phone ||
        !data.address ||
        !data.email ||
        !data.logo
        // !data.cac_docs
      ) {
        toast.error("All fields are required!");
        set({ isLoading: false });
        return;
      }

      // Prepare FormData for file uploads
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("email", data.email);
      formData.append("logo", data.logo);
      // formData.append("cac_docs", data.cac_docs);

      const response: AxiosResponse = await api.post(
        "/auth/onboard-hospitals",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        // console.log("Response:", response.data);
        toast.success(response.data.message);
        return true;
      }
      return null;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed!");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  forgotPassword: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/auth/forget-password", data);

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
}));
