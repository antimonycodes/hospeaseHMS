// pages/index.ts
import { lazy } from "react";

// Lazy load pages
export const Overview = lazy(() => import("./Overview"));
export const Patients = lazy(() => import("./Patients"));
export const PatientDetails = lazy(() => import("../Shared/PatientDetails"));
export const Doctors = lazy(() => import("./Doctors"));
export const DoctorDetails = lazy(() => import("../Shared/DoctorDetails"));
export const FrontdeskDetails = lazy(
  () => import("../components/Frontdesk/appointment/FrontdeskDetails")
);
export const Finance = lazy(() => import("./Finance"));
export const Laboratory = lazy(() => import("./Laboratory"));
export const Consultants = lazy(() => import("./Consultants"));
export const Appointments = lazy(() => import("./Appointments"));
export const Expenses = lazy(() => import("./Expenses"));
export const Users = lazy(() => import("./Users"));
export const Nurses = lazy(() => import("./Nurses"));
export const Pharmacy = lazy(() => import("./Pharmacy"));
export const AppointmentDetails = lazy(
  () => import("../components/Frontdesk/appointment/AppointmentDetails")
);
export const Payment = lazy(() => import("./Payment"));
export const Profile = lazy(() => import("./Profile"));
export const Shift = lazy(() => import("./Shift"));
export const Inventory = lazy(() => import("./Inventory"));
export const Stocks = lazy(() => import("./Stocks"));
export const Request = lazy(() => import("./Request"));
export const Branch = lazy(() => import("./Branch"));
export const ClinicalDept = lazy(() => import("./ClinicalDept"));
export const Staffs = lazy(() => import("./Staffs"));

// Auth Pages
export const Signin = lazy(() => import("../_Auth/Signin"));
export const Signup = lazy(() => import("../_Auth/Signup"));

// Superadmin Pages
export const ConsultantDetails = lazy(
  () => import("../components/Superadmin/consultant/ConsultantDetails")
);
export const NurseDetails = lazy(
  () => import("../components/Superadmin/nurses/NurseDetails")
);
