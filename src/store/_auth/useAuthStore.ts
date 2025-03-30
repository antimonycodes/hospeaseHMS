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
  // password: string;
  logo: File;
  cac_docs: File;
}

interface AuthStore {
  isLoading: boolean;
  //   updateCompanyDetails: (data: any) => Promise<any>;
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
        console.log(response.data.data.token, "token");
        set({ user: response.data.data.user });
        console.log(response.data.data.user.attributes.role, "role");
        set({
          role: response.data.data.user.attributes.role,
          isAuthenticated: true,
        });
        const token = response.data.data.token;
        Cookies.set("token", token, { expires: 1, secure: true });

        localStorage.setItem("role", response.data.data.user.attributes.role);
        return true;
      }
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

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("email", data.email);
      formData.append("logo", data.logo);
      formData.append("cac_docs", data.cac_docs);

      const response: AxiosResponse = await api.post(
        "/auth/onboard-hospitals",
        formData,
        {
          headers: { "Content-Type": "application/json" },
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
