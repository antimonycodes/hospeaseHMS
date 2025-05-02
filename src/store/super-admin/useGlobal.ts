import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useDoctorStore } from "./useDoctorStore";
import {
  handleErrorToast,
  isSuccessfulResponse,
} from "../../utils/responseHandler";
import { Pagination } from "./usePatientStore";

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

interface Togglestatus {
  is_active: boolean;
  user_id: number;
}

interface Hospital {
  id: number;
  name: string;
  logo: string;
}

interface BranchAttributes {
  name: string;
  hospital: Hospital;
  created_at: string;
  total_patient: number;
}

interface Branch {
  type: string;
  id: number;
  attributes: BranchAttributes;
}

interface ClinicaldeptAttributes {
  name: string;
  total_patient: number;
}

interface Clinicaldept {
  type: string;
  id: number;
  attributes: ClinicaldeptAttributes;
}

interface CreateBranchData {
  name: string;
}

interface CreateClinicaldeptData {
  name: string;
}
export interface CreateStaff {
  email: string;
  department_id?: number;
  role?: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface AssignShift {
  // user_id: number;
  // shifts: ShiftData[];
}

export interface ShiftData {
  date: string;
  shift_type: string;
  start_time: string;
  end_time: string;
  clinical_dept: number;
  department_id: null;
}

export interface ShiftType {
  shift_type: string;
  start_time: string;
  end_time: string;
}

interface Globalstore {
  isLoading: boolean;
  isStaffLoading: boolean;
  branches: Branch[];
  clinicaldepts: Clinicaldept[];
  staffs: any[];
  pagination: Pagination | null;
  allStaffs: any[];
  shiftDetails: any[];
  selectedStaff: any | null;
  staffShift: any[];
  shiftTypes: any[];
  allShifts: any[];
  notifications: any[];
  unreadCount: any;
  roles: Record<string, { id: number; role: string }>;
  setSelectedStaff: (staff: any) => void;
  togglestatus: (data: Togglestatus) => Promise<any>;
  getBranches: (endpoint?: string) => Promise<any>;
  createBranch: (data: CreateBranchData) => Promise<any>;
  getClinicaldept: (endpoint?: string) => Promise<any>;
  createClinicaldept: (data: CreateClinicaldeptData) => Promise<any>;
  createStaff: (data: CreateStaff, role: string) => Promise<any>;
  updateStaff: (data: any, id: any) => Promise<any>;
  getDeptStaffs: (
    data: string,
    page?: string,
    perPage?: string
  ) => Promise<any>;
  createShiftType: (data: ShiftType) => Promise<any>;
  updateShiftType: (id: any, data: ShiftType) => Promise<any>;
  getShiftType: (endpoint?: string) => Promise<any>;
  assignShifts: (data: AssignShift, endpoint: any) => Promise<any>;
  getStaffShifts: (id: string, endpoint: any) => Promise<any>;
  getAllShifts: (endpoint: string) => Promise<any>;
  getShiftDetails: (date: any) => Promise<any>;
  updateShift: (id: any, data: any, update: any) => Promise<any>;
  deleteShift: (id: any, endpoint: any) => Promise<any>;
  getAllRoles: (endpoint?: string) => Promise<any>;
  getAllNotifications: () => Promise<any>;
  getUnreadNotificationCount: () => Promise<any>;
  markAllAsRead: () => Promise<any>;
  getAllStaffs: () => Promise<any>;
}

export const useGlobalStore = create<Globalstore>((set, get) => ({
  isLoading: false,
  branches: [],
  clinicaldepts: [],
  staffs: [],
  roles: {},
  allStaffs: [],
  shiftTypes: [],
  allShifts: [],
  shiftDetails: [],
  notifications: [],
  isStaffLoading: false,
  selectedStaff: null,
  staffShift: [],
  pagination: null,

  unreadCount: 0,
  setSelectedStaff: (staff) => set({ selectedStaff: staff }),

  togglestatus: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/admin/profile/account-status", data);
      if (response.status === 200) {
        // Return the new status to confirm it was updated on server
        toast.success(response.data.message);

        return response.data.data?.attributes.is_active ?? data.is_active;
      }
      console.log(response.data.data?.attributes.is_active);
      toast.success(response.data.message);
      return null; // Indicate failure
    } catch (error: any) {
      console.error(
        "Error changing status:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to update status");
      return null; // Indicate failure
    } finally {
      set({ isLoading: false });
    }
  },

  getBranches: async (endpoint = "/admin/branches/fetch") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      if (response.status === 200) {
        // Return the new status to confirm it was updated on server
        // toast.success(response.data.message);
        set({ branches: response.data.data });
        console.log(response.data.data);
        return true;
      }
      console.log(response.data.data?.data);
      toast.success(response.data.message);
      return null;
    } catch (error: any) {
      console.error(
        "Error changing status:",
        error.response?.data || error.message
      );
      //   toast.error(error.response?.data?.message || "Failed");
      return null; // Indicate failure
    } finally {
      set({ isLoading: false });
    }
  },
  createBranch: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/admin/branches/create", data);
      if (response.status === 201) {
        toast.success(response.data.message);
        await get().getBranches();
        return true;
      }
      console.log(response.data.data?.data);
      toast.success(response.data.message);
      return null;
    } catch (error: any) {
      console.error(
        "Error changing status:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed");
      return null; // Indicate failure
    } finally {
      set({ isLoading: false });
    }
  },

  getClinicaldept: async (
    endpoint = "/medical-report/clinical-department-fetch"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      if (response.status === 200) {
        // Return the new status to confirm it was updated on server
        // toast.success(response.data.message);
        set({ clinicaldepts: response.data.data });
        return true;
      }
      console.log(response.data.data?.data);
      toast.success(response.data.message);
      return null;
    } catch (error: any) {
      console.error(
        "Error changing status:",
        error.response?.data || error.message
      );
      //   toast.error(error.response?.data?.message || "Failed");
      return null; // Indicate failure
    } finally {
      set({ isLoading: false });
    }
  },

  // editPatient: async (id, data, endpoint = `/appointments/${id}`) => {
  //   set({ isLoading: true });
  //   try {
  //     const response = await api.put(endpoint, data);
  //     toast.success("Appointment updated successfully!");
  //     return response.data;
  //   } catch (error: any) {
  //     toast.error(error.response.message);
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },
  createClinicaldept: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post(
        "/admin/department/clinical-department",
        data
      );
      if (response.status === 201) {
        // Return the new status to confirm it was updated on server
        toast.success(response.data.message);
        await get().getClinicaldept();
        return true;
      }
      console.log(response.data.data?.data);
      toast.success(response.data.message);
      return null;
    } catch (error: any) {
      console.error(
        "Error changing status:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed");
      return null; // Indicate failure
    } finally {
      set({ isLoading: false });
    }
  },
  createStaff: async (data, role) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/admin/department/head-dept", data);
      if (response.status === 201) {
        toast.success(response.data.message);
        await get().getDeptStaffs(role);
        return true;
      }
      console.log(response.data.message);
      return null;
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response.data.message);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  updateStaff: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/medical-report/head-dept/${id}`, data);
      if (response.status === 200) {
        toast.success("Record updated successfully");
        await get().getDeptStaffs(data.role);
        return true;
      }
      console.log(response.data.message);
      return null;
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response.data.message);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  getDeptStaffs: async (role, page = "1", perPage = "10") => {
    set({ isStaffLoading: true });
    try {
      const response = await api.post(
        `/admin/department/get-users-dept?page=${page}&per_page=${perPage}`,
        {
          role,
        }
      );
      if (response.status === 200) {
        // toast.success(response.data.message);
        set({ staffs: response.data.data.data });
        set({ pagination: response.data.data.pagination });
        // console.log(response.data.data.data, "staffs");
        return response.data.data;
      }
      console.log(response.data.message);
      return null;
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response.data.message);
      return null;
    } finally {
      set({ isStaffLoading: false });
    }
  },
  createShiftType: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post("admin/shift/schedule", data);
      if (response.status === 201) {
        console.log(response.data.data, "shift type");
        toast.success(response.data.message);
        await get().getShiftType();
        return true;
      }
      console.log(response.data.message);
      return null;
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response.data.message);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  updateShiftType: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await api.put(
        `/admin/update/schedule-shift/${id}`,
        data
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        await get().getShiftType();
        return true;
      }
      console.log(response.data.message);
      return null;
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response.data.message);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  getShiftType: async (endpoint = "/admin/schedule-all") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      if (response.status === 200) {
        set({ shiftTypes: response.data.data.data });
        console.log(response.data.data);
        return true;
      }
      console.log(response.data.data?.data);
      toast.success(response.data.message);
      return null;
    } catch (error: any) {
      console.error(
        "Error changing status:",
        error.response?.data || error.message
      );
      //   toast.error(error.response?.data?.message || "Failed");
      return null; // Indicate failure
    } finally {
      set({ isLoading: false });
    }
  },
  assignShifts: async (data, endpoint = "/matron/shift/assign") => {
    set({ isLoading: true });
    try {
      const response = await api.post(endpoint, data);
      if (response.status === 201) {
        toast.success(response.data.message);
        console.log(response.data.message);
        return true;
      }
      return null;
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response.message);
      return null;
    }
  },
  getAllShifts: async (endpoint = `/matron/shift/user-records`) => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      if (response.status === 200) {
        set({ allShifts: response.data.data.data.data });
        // toast.success(response.data.message);
        console.log(response.data.data.data);
        return true;
      }
    } catch (error: any) {
      // toast.error(error.response?.message);
      console.log(error.response.message);
      return null;
    } finally {
      set({ isLoading: false });
      return null;
    }
  },
  getShiftDetails: async (date) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/medical-report/shift/${date}`);
      if (response.status === 200) {
        set({ shiftDetails: response.data.data.doctors });
        // toast.success(response.data.message);
        console.log(response.data.data.doctors, "dfghjk");
        return true;
      }
    } catch (error: any) {
      // toast.error(error.response?.message);
      console.log(error.response.message);
      return null;
    } finally {
      set({ isLoading: false });
      return null;
    }
  },
  getStaffShifts: async (id, endpoint) => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      if (response.status === 200) {
        set({ staffShift: response.data.data.data.data });
        // toast.success(response.data.message);
        console.log(response.data.data.data);
        return true;
      }
    } catch (error: any) {
      // toast.error(error.response?.message);
      console.log(error.response.message);
      return null;
    } finally {
      set({ isLoading: false });
      return null;
    }
  },

  updateShift: async (id, data, endpoint = `/admin/shift/update/${id}`) => {
    set({ isLoading: true });
    try {
      const response = await api.put(endpoint, data);
      if (response.status === 200) {
        toast.success(response.data.message);
        console.log(response.data.message);
        return true;
      }
    } catch (error: any) {
      console.error(error.response?.data);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteShift: async (id, endpoint = `/admin/shift/delete/${id}`) => {
    set({ isLoading: true });
    try {
      const response = await api.delete(endpoint);
      if (response.status === 200) {
        toast.success(response.data.message);
        console.log(response.data.message);
        return true;
      }
    } catch (error: any) {
      console.error(error.response?.data);
    } finally {
      set({ isLoading: false });
    }
  },
  getAllRoles: async (endpoint = "/medical-report/dept-fetch") => {
    try {
      const response = await api.get(endpoint);
      const departments = response.data.data;

      // Define custom name mappings
      const customMap: Record<string, string> = {
        pharmacy: "pharmacist",
        inventory: "inventory-manager",
        "medical director": "medical-director",
        // "front desk": "front-desk-manager", // optional: if you have this department
      };

      // Prepare the roleVariables object
      const roleVariables: Record<string, { id: number; role: string }> = {};

      departments.forEach((item: any) => {
        const rawName = item.attributes.name.toLowerCase(); // Normalize the name
        const id = item.id;

        // Map using customMap if available, else use the rawName
        const roleName = customMap[rawName] || rawName;

        roleVariables[roleName] = {
          id,
          role: roleName,
        };
      });

      console.log("Mapped Roles:", roleVariables);
      set({ roles: roleVariables });
    } catch (error: any) {
      console.log(error.response?.data || error.message);
    }
  },
  getAllNotifications: async () => {
    set({ isLoading: false });
    try {
      const response = await api.get("notification/all");
      if (response.status === 200) {
        set({ notifications: response.data.data });
        set({ unreadCount: response.data.data[0].unread_count });
        console.log(response.data.data[0].unread_count, "erfgh");
        return true;
      }
      return null;
    } catch (error: any) {
      console.log(error.response?.data || error.message);
    }
  },
  getUnreadNotificationCount: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/notification/all-count");
      if (response.status === 200) {
        // set({ unreadCount: response.data.data });
        console.log(response.data);
        return true;
      }
      return null;
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  markAllAsRead: async () => {
    set({ isLoading: true });
    try {
      const response = await api.post("/notification/mark-all-read");

      if (isSuccessfulResponse(response)) {
        // toast.success(response.data?.msg);
        // set({ items: response.data.data });
        get().getAllNotifications();
        return true;
      }
      return null;
    } catch (error) {
      //   handleErrorToast(error, "Failed.");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  getAllStaffs: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/medical-report/all-staffs");

      if (isSuccessfulResponse(response)) {
        set({ allStaffs: response.data.data });
        // toast.success(response.data?.message);
        console.log(response.data.data);
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
