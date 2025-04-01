import { create } from "zustand";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//  request interceptor to attach the bearer token

// api.interceptors.request.use(
//   (config) => {
//     // const { authUser } = useAuthStore.getState();
//     // console.log(authToken, "dfg");

//     // if (authUser) {
//     //   console.log(authUser, "dfg");
//     //   config.headers.Authorization = `Bearer ${authUser}`;
//     // }

//     const token = Cookies.get("token");

//     // If token exists, add it to the headers
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

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
  logo: File | null; // Updated to File | null
  cac_docs: File | null; // Updated to File | null
}

interface AuthStore {
  isLoading: boolean;
  login: (data: LoginData) => Promise<any>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
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
        // Cookies.set("token", token, { expires: 1, secure: true });
        Cookies.set("token", token, { secure: true });

        localStorage.setItem("role", response.data.data.user.attributes.role);
        toast.success(response.data.message);
        return true;
      }
      return false;
    } catch (error: any) {
      console.log(error.response.data);
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
      // Final validation before sending request
      if (
        !data.name ||
        !data.phone ||
        !data.address ||
        !data.email ||
        !data.logo ||
        !data.cac_docs
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
      formData.append("logo", data.logo); // Append the logo file
      formData.append("cac_docs", data.cac_docs); // Append the cac_docs file

      // Make the API request with the FormData
      const response: AxiosResponse = await api.post(
        "/auth/onboard-hospitals",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important: Set the content type to multipart/form-data
          },
        }
      );

      toast.success("Signup successful!");
      console.log("Response:", response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed!");
    } finally {
      set({ isLoading: false });
    }
  },
}));
