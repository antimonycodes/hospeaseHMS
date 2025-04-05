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

function App() {
  return (
    <div className="font-inter">
      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="overview" />} />
              <Route path="overview" element={<Overview />} />
              <Route path="patients" element={<Patients />} />
              <Route path="patients/:id" element={<PatientDetails />} />
              <Route
                path="doctor/patients/:id"
                element={<DoctorPatientDetails />}
              />
              {/* <Route
                path="appointments/:patientId"
                element={<AppointmentDetails />}
              /> */}
              <Route path="doctors" element={<Doctors />} />
              <Route path="doctors/:id" element={<DoctorDetails />} />
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
              <Route path="nurses" element={<Nurses />} />
              <Route path="nurses/:id" element={<NurseDetails />} />
              <Route path="pharmacy/info" element={<Pharmacy />} />
              <Route
                path="pharmacy/staffs"
                element={<Staffs department="pharmacy" />}
              />
              <Route
                path="laboratory/staffs"
                element={<Staffs department="laboratory" />}
              />
              <Route
                path="finance/staffs"
                element={<Staffs department="finance" />}
              />
              <Route path="users" element={<Users />} />
              <Route path="payment" element={<Payment />} />
              <Route path="profile" element={<Profile />} />
              <Route path="shifts" element={<Shift />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="stock" element={<Stocks />} />
              <Route path="request" element={<Request />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="branch" element={<Branch />} />
              <Route path="clinical-department" element={<ClinicalDept />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </div>
  );
}

export default App;
