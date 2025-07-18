// Updated useAdmissionStore.ts
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

export interface CreateFluidBalance {
  type: string;
  iv_input: string;
  oral_input: string;
  urine_input: string;
  vomits_input: string;
  other_input: string;
  admission_id: number;
  comment: string;
}

export interface UpdateFluidBalance {
  type?: string;
  iv_input?: string;
  oral_input?: string;
  urine_input?: string;
  vomits_input?: string;
  other_input?: string;
  comment?: string;
}

export interface CreateMedication {
  admission_id: any;
  drug_name: string;
  dosage: string;
  route: string;
  prescribed_by: any;
}

export interface CreateTPR {
  admission_id: any;
  pulse: string;
  temperature: string;
  respiration: string;
  blood_pressure: string;
  comment: string;
}

export interface CreateVitals {
  admission_id: any;
  temperature: string;
  pulse: string;
  respiration_rate: string;
  systolic_bp: string;
  diastolic_bp: string;
  oxygen_saturation: string;
  pain_score: string;
}

interface Patient {
  type: string;
  id: number;
  attributes: {
    first_name: string;
    last_name: string;
    card_id: string;
    phone_number: string;
    occupation: string;
    religion: string;
    gender: string;
    address: string;
    age: number;
    branch: string;
    is_admitted: boolean;
    patient_type: string;
    clinical_department: {
      id: number;
      name: string;
    };
    next_of_kin: Array<{
      name: string;
      last_name: string;
      gender: string;
      phone: string;
      occupation: string;
      address: string;
      relationship: string;
      religion: string;
    }>;
    created_at: string;
  };
}

// New interfaces for the extracted data
export interface MedicationEntry {
  id: number;
  type: string;
  attributes: {
    drug_name: string;
    dosage: string;
    route: string;
    recorded_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    created_at: string;
    updated_at: string;
  };
}

export interface TPREntry {
  id: number;
  type: string;
  attributes: {
    temperature: string;
    pulse: string;
    respiration: string;
    blood_pressure: string;
    comment: string;
    recorded_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    created_at: string;
    updated_at: string;
  };
}

export interface FluidBalanceEntry {
  id: number;
  type: string;
  attributes: {
    admission_id: string;
    type: string;
    iv_input: string;
    oral_input: string;
    urine_input: string;
    vomits_input: string;
    other_input: string;
    comment: string;
    recorded_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    created_at: string;
    updated_at: string;
  };
}

interface AdmissionDetail {
  type: string;
  id: number;
  attributes: {
    patient: Patient;
    clinical_department: {
      id: number;
      name: string;
    };
    bed_number: string;
    recommended_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    status: string;
    recorded_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    diagnosis: string;
    recovery_history: any[];
    fluid_balance: FluidBalanceEntry[];
    medication_history: MedicationEntry[];
    tpr_history: TPREntry[];
    vital_signs_history: any[];
    created_at: string;
    updated_at: string;
  };
}

interface AdmissionStore {
  isLoading: boolean;
  admissionList: any[];
  currentAdmission: AdmissionDetail | null;
  // Separate state for each data type
  fluidBalanceEntries: FluidBalanceEntry[];
  medicationEntries: MedicationEntry[];
  tprEntries: TPREntry[];
  vitalsEntries: any[];

  createAdmission: (data: CreateAdmission) => Promise<any>;
  dischargePatient: (data: any) => Promise<any>;
  updateRecoveryStatus: (data: any) => Promise<any>;
  allAdmission: () => Promise<any>;
  getAdmissionById: (id: number) => Promise<AdmissionDetail | null>;
  updateAdmissionStatus: (id: number, status: string) => Promise<boolean>;
  createFluidBalance: (data: CreateFluidBalance) => Promise<boolean>;
  updateFluidBalance: (
    id: number,
    data: UpdateFluidBalance
  ) => Promise<boolean>;
  createMedication: (data: CreateMedication) => Promise<boolean>;
  createTPR: (data: CreateTPR) => Promise<boolean>;
  createVitals: (data: CreateVitals) => Promise<boolean>;

  // New methods to extract data
  extractMedicationHistory: () => MedicationEntry[];
  extractTPRHistory: () => TPREntry[];
  extractFluidBalanceHistory: () => FluidBalanceEntry[];
  extractVitals: () => any[];
}

export const useAdmissionStore = create<AdmissionStore>((set, get) => ({
  isLoading: false,
  admissionList: [],
  currentAdmission: null,
  fluidBalanceEntries: [],
  medicationEntries: [],
  tprEntries: [],
  vitalsEntries: [],

  updateRecoveryStatus: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.put(
        "/medical-report/admission/update-recovery-status",
        data
      );
      if (isSuccessfulResponse(response)) {
        toast.success(response.data?.message);
        // get().getAdmissionById();
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

  dischargePatient: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.put(
        "/medical-report/admission/discharge-patient",
        data
      );
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

  createAdmission: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/medical-report/admission/create", data);
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

  allAdmission: async (page = "1", perPage = "1000") => {
    set({ isLoading: true });
    try {
      let endpoint = `/medical-report/admission/all-records?page=${page}&per_page=${perPage}`;
      const response = await api(endpoint);
      if (isSuccessfulResponse(response)) {
        set({ admissionList: response.data.data.data });
      }
      return null;
    } catch (error) {
      handleErrorToast(error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  getAdmissionById: async (id: number) => {
    set({ isLoading: true });
    try {
      const response = await api.get(
        `/medical-report/admission/all-records/${id}`
      );
      if (isSuccessfulResponse(response)) {
        const admissionDetail = response.data.data;

        // Extract and set individual arrays
        const medicationHistory =
          admissionDetail.attributes.medication_history || [];
        const tprHistory = admissionDetail.attributes.tpr_history || [];
        const fluidBalanceHistory =
          admissionDetail.attributes.fluid_balance || [];
        const vitalsHistory =
          admissionDetail.attributes.vital_signs_history || [];

        set({
          currentAdmission: admissionDetail,
          medicationEntries: medicationHistory,
          tprEntries: tprHistory,
          fluidBalanceEntries: fluidBalanceHistory,
          vitalsEntries: vitalsHistory,
        });

        return admissionDetail;
      }
      return null;
    } catch (error) {
      handleErrorToast(error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateAdmissionStatus: async (id: number, status: string) => {
    set({ isLoading: true });
    try {
      const response = await api.patch(
        `/medical-report/admission/update/${id}`,
        {
          status,
        }
      );
      if (isSuccessfulResponse(response)) {
        toast.success(response.data?.message || "Status updated successfully");
        const currentAdmission = get().currentAdmission;
        if (currentAdmission && currentAdmission.id === id) {
          set({
            currentAdmission: {
              ...currentAdmission,
              attributes: {
                ...currentAdmission.attributes,
                status,
              },
            },
          });
        }
        return true;
      }
      return false;
    } catch (error) {
      handleErrorToast(error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  createFluidBalance: async (data: CreateFluidBalance) => {
    set({ isLoading: true });
    try {
      const response = await api.post(
        "/medical-report/admission/fluid-balance",
        data
      );
      if (isSuccessfulResponse(response)) {
        toast.success(
          response.data?.message || "Fluid balance entry created successfully"
        );

        // Create a new entry object to append to existing data
        const newEntry: FluidBalanceEntry = {
          id: response.data.data?.id || Date.now(),
          type: "Admission Fluid Balance",
          attributes: {
            admission_id: data.admission_id.toString(),
            type: data.type,
            iv_input: data.iv_input,
            oral_input: data.oral_input,
            urine_input: data.urine_input,
            vomits_input: data.vomits_input,
            other_input: data.other_input,
            comment: data.comment,
            recorded_by: {
              id: 0, // You might want to get this from current user context
              first_name: "Current",
              last_name: "User",
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        };

        // Append to existing entries
        const currentEntries = get().fluidBalanceEntries;
        set({ fluidBalanceEntries: [...currentEntries, newEntry] });

        return true;
      }
      return false;
    } catch (error) {
      handleErrorToast(error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateFluidBalance: async (id: number, data: UpdateFluidBalance) => {
    set({ isLoading: true });
    try {
      const response = await api.put(
        `/medical-report/admission/update-fluid-balance/${id}`,
        data
      );
      if (isSuccessfulResponse(response)) {
        toast.success(
          response.data?.message || "Fluid balance entry updated successfully"
        );

        // Update local state
        const currentEntries = get().fluidBalanceEntries;
        const updatedEntries = currentEntries.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                attributes: {
                  ...entry.attributes,
                  ...data,
                  updated_at: new Date().toISOString(),
                },
              }
            : entry
        );
        set({ fluidBalanceEntries: updatedEntries });

        return true;
      }
      return false;
    } catch (error) {
      handleErrorToast(error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  createMedication: async (data: CreateMedication) => {
    set({ isLoading: true });
    try {
      const response = await api.post(
        "/medical-report/admission/drug-prescription",
        data
      );
      if (isSuccessfulResponse(response)) {
        toast.success(
          response.data?.message || "Medication entry created successfully"
        );

        // Create a new medication entry to append
        const newEntry: MedicationEntry = {
          id: response.data.data?.id || Date.now(),
          type: "Admission Medication Resource",
          attributes: {
            drug_name: data.drug_name,
            dosage: data.dosage,
            route: data.route,
            recorded_by: {
              id: 0, // Get from current user context
              first_name: "Current",
              last_name: "User",
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        };

        // Append to existing medication entries
        const currentEntries = get().medicationEntries;
        set({ medicationEntries: [...currentEntries, newEntry] });

        return true;
      }
      return false;
    } catch (error) {
      handleErrorToast(error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  createTPR: async (data: CreateTPR) => {
    set({ isLoading: true });
    try {
      const response = await api.post(
        "/medical-report/admission/medical-tpr",
        data
      );
      if (isSuccessfulResponse(response)) {
        toast.success(
          response.data?.message || "TPR entry created successfully"
        );

        // Create a new TPR entry to append
        const newEntry: TPREntry = {
          id: response.data.data?.id || Date.now(),
          type: "Admission TPR Resource",
          attributes: {
            temperature: data.temperature,
            pulse: data.pulse,
            respiration: data.respiration,
            blood_pressure: data.blood_pressure,
            comment: data.comment,
            recorded_by: {
              id: 0, // Get from current user context
              first_name: "Current",
              last_name: "User",
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        };

        // Append to existing TPR entries
        const currentEntries = get().tprEntries;
        set({ tprEntries: [...currentEntries, newEntry] });

        return true;
      }
      return false;
    } catch (error) {
      handleErrorToast(error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  createVitals: async (data: CreateVitals) => {
    set({ isLoading: true });
    try {
      const response = await api.post(
        "/medical-report/admission/vital-signs",
        data
      );
      if (isSuccessfulResponse(response)) {
        toast.success(
          response.data?.message || "Vital entry created successfully"
        );

        // Create a new TPR entry to append
        // const newEntry: any = {
        //   id: response.data.data?.id || Date.now(),
        //   type: "Admission TPR Resource",
        //   attributes: {
        //     temperature: data.temperature,
        //     pulse: data.pulse,
        //     respiration: data.respiration,
        //     blood_pressure: data.blood_pressure,
        //     comment: data.comment,
        //     recorded_by: {
        //       id: 0, // Get from current user context
        //       first_name: "Current",
        //       last_name: "User",
        //     },
        //     created_at: new Date().toISOString(),
        //     updated_at: new Date().toISOString(),
        //   },
        // };

        // // Append to existing TPR entries
        // const currentEntries = get().tprEntries;
        // set({ tprEntries: [...currentEntries, newEntry] });

        return true;
      }
      return false;
    } catch (error) {
      handleErrorToast(error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Extraction methods
  extractMedicationHistory: () => {
    const state = get();
    return state.medicationEntries;
  },

  extractTPRHistory: () => {
    const state = get();
    return state.tprEntries;
  },

  extractFluidBalanceHistory: () => {
    const state = get();
    return state.fluidBalanceEntries;
  },
  extractVitals: () => {
    const state = get();
    return state.vitalsEntries;
  },
}));
