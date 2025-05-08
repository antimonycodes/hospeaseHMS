import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import DashboardLayout from "./layout/DashboardLayout";
import ProtectedRoutes from "./layout/ProtectedRoutes";

// Import all lazy-loaded components from `pages/index.ts`
import {
  Signin,
  Signup,
  Overview,
  Patients,
  PatientDetails,
  Doctors,
  DoctorDetails,
  Finance,
  Laboratory,
  Consultants,
  Appointments,
  Users,
  Nurses,
  Pharmacy,
  AppointmentDetails,
  Payment,
  Profile,
  Shift,
  Inventory,
  Stocks,
  Request,
  Branch,
  ClinicalDept,
  Staffs,
  ConsultantDetails,
  NurseDetails,
  Expenses,
} from "./pages";
import DoctorPatientDetails from "./components/Doctor/DoctorPatientDetails";
import DoctorAppointmentDetails from "./components/Doctor/appointment/DoctorAppointmentDetails";
import StaffsDetail from "./components/Superadmin/Staffs/StaffsDetail";
import FrontdeskDetails from "./components/Frontdesk/appointment/FrontdeskDetails";
import MatronPatientDetails from "./components/Matron/patients/MatronPatientDetails";
import MatronNurseDetails from "./components/Matron/nurse/MatronNurseDetails";
import PharPatientDetails from "./components/Pharmacy/Patients/PharPatientDetails";
import SaFrontdeskpage from "./components/Superadmin/frontdesk/SaFrontdeskpage";
import LabPatientDetails from "./components/Laboratory/patients/LabPatientDetails";
import NotificationPage from "./components/Dashboard/Notification";
// import LabDetails from "./components/Laboratory/patients/labDetails";
// import LabDetails from "./components/Laboratory/patients/LabDetaill";
// import LabDetail from "./components/Laboratory/patients/LabDetaill";
import StaffProfile from "./pages/StaffProfile";
// import LabDetaill from "./components/Laboratory/patients/LabDetaill";
import MedPatientsDetails from "./components/medicaldirector/patients/MedPatientsDetails";
import MedAppointmentDetails from "./components/medicaldirector/appointment/MedAppointmentDetails";
import MedDoctorDetail from "./components/medicaldirector/doctor/MedDoctorDetail";
import SignupSuccess from "./_Auth/SignupSuccess";
import NurseDetail from "./components/Nurse/patients/NurseDetail";
import ServiceCharges from "./pages/ServiceCharges";
import ForgotPassword from "./_Auth/ForgotPassword";
import FrontdeskDeets from "./components/Superadmin/frontdesk/FrontdeskDeets";
import Category from "./pages/Category";
import SaInventoryPage from "./components/Superadmin/Inventory/SaInventoryPage";
import PaymentDetails from "./components/Finance/payment/PaymentDetails";
import FrontdeskPatientDetails from "./components/Frontdesk/patients/FrontdeskPatientDetails";
import TourListener from "./Shared/TourListener";
import CreateShift from "./components/Matron/shifts/CreateShift";

function App() {
  return (
    <div className="font-inter">
      {/* <TourListener /> */}
      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup-success" element={<SignupSuccess />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="overview" />} />
              <Route path="overview" element={<Overview />} />
              <Route path="staffprofile" element={<StaffProfile />} />
              <Route path="patients" element={<Patients />} />
              <Route path="patients/:id" element={<PatientDetails />} />
              <Route
                path="doctor/patients/:id"
                element={<DoctorPatientDetails />}
              />
              <Route
                path="pharmacy/patient/:patientId/case-report/:caseId"
                element={<PharPatientDetails />}
              />
              <Route
                path="laboratory/patient/:patientId/case-report/:caseId"
                element={<LabPatientDetails />}
              />
              <Route path="doctors" element={<Doctors />} />
              <Route path="doctors/:id" element={<DoctorDetails />} />
              <Route
                path="doctors/meddoctor/:id"
                element={<MedDoctorDetail />}
              />
              <Route path="consultants" element={<Consultants />} />
              <Route path="consultants/:id" element={<ConsultantDetails />} />
              <Route path="finance/info" element={<Finance />} />
              <Route path="laboratory/info" element={<Laboratory />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="nurse" element={<Nurses />} />
              <Route
                path="appointment/doctor/:id"
                element={<DoctorAppointmentDetails />}
              />
              <Route
                path="appointment/medicalDirector/:id"
                element={<MedAppointmentDetails />}
              />
              <Route
                path="appointment/frontdesk/:id"
                element={<FrontdeskDetails />}
              />
              <Route
                path="matron/patients/:id"
                element={<MatronPatientDetails />}
              />
              <Route
                path="matron/nurses/:id"
                element={<MatronNurseDetails />}
              />
              <Route
                path="laboratory/patients/:id"
                element={<LabPatientDetails />}
              />
              <Route
                path="medical/patients/:id"
                element={<MedPatientsDetails />}
              />
              <Route path="finance/payment/:id" element={<PaymentDetails />} />
              <Route path="nurses" element={<Nurses />} />
              <Route path="nurses/:id" element={<NurseDetails />} />
              <Route
                path="/dashboard/nurses/patients/:id"
                element={<NurseDetail />}
              />
              <Route
                path="/dashboard/frontdesk/patient/:id"
                element={<FrontdeskPatientDetails />}
              />
              <Route path="pharmacy/info" element={<Pharmacy />} />
              <Route
                path="pharmacy/staffs"
                element={<Staffs department="pharmacist" />}
              />
              <Route
                path="laboratory/staffs"
                element={<Staffs department="laboratory" />}
              />
              <Route
                path="finance/staffs"
                element={<Staffs department="finance" />}
              />
              <Route
                path="frontdesk/staffs"
                element={<Staffs department="front-desk-manager" />}
              />
              <Route path="frontdesk/:id" element={<FrontdeskDeets />} />
              <Route
                path="inventory/staffs"
                element={<Staffs department="inventory-manager" />}
              />{" "}
              <Route path="inventory/info" element={<SaInventoryPage />} />
              <Route path="staff-detail/:id" element={<StaffsDetail />} />
              <Route path="users" element={<Users />} />
              <Route path="payment" element={<Payment />} />
              <Route path="profile" element={<Profile />} />
              <Route path="shifts" element={<Shift />} />
              <Route path="create-shift" element={<CreateShift />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="category" element={<Category />} />
              <Route path="stocks" element={<Stocks />} />
              <Route path="request" element={<Request />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="branch" element={<Branch />} />
              <Route path="clinical-department" element={<ClinicalDept />} />
              <Route path="front-desk" element={<SaFrontdeskpage />} />
              <Route path="notifications" element={<NotificationPage />} />
              <Route path="service-charges" element={<ServiceCharges />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </div>
  );
}

export default App;
