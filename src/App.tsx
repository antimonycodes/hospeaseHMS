import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Signup from "./_Auth/Signup";
import Overview from "./pages/Overview";
// import { AuthProvider } from "./store/AuthContext";
import Patients from "./pages/Patients";
import PatientDetails from "./Shared/PatientDetails";
import Doctors from "./pages/Doctors";
import Finance from "./pages/Finance";
import Laboratory from "./pages/Laboratory";
import DoctorDetails from "./Shared/DoctorDetails";
import Consultants from "./pages/Consultants";
import Appointments from "./pages/Appointments";
import Users from "./pages/Users";
import Nurses from "./pages/Nurses";
import Pharmacy from "./pages/Pharmacy";
import AppointmentDetails from "./components/Frontdesk/appointment/AppointmentDetails";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import Shift from "./pages/Shift";
import Expenses from "./pages/Expenses";
<<<<<<< HEAD
import Inventory from "./pages/Inventory";
import Stocks from "./pages/Stocks";
import Request from "./pages/Request";


=======
import Signin from "./_Auth/Signin";
import ConsultantDetails from "./components/Superadmin/consultant/ConsultantDetails";
import { Toaster } from "react-hot-toast";
import NurseDetails from "./components/Superadmin/nurses/NurseDetails";
>>>>>>> da874f1729ae2ef9f1db1d7067124aae49e10fa6

function App() {
  return (
    <div className=" font-inter">
      {/* <AuthProvider> */}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

<<<<<<< HEAD
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="overview" />} />
            <Route path="overview" element={<Overview />} />
            <Route path="patients" element={<Patients />} />
            <Route
              path="/dashboard/patients/:patientId"
              element={<PatientDetails />}
            />
            <Route
              path="/dashboard/appointments/:patientId"
              element={<AppointmentDetails />}
            />
            <Route path="doctors" element={<Doctors />} />
            <Route
              path="/dashboard/doctors/doctor"
              element={<DoctorDetails />}
            />
            <Route path="consultants" element={<Consultants />} />
            <Route path="finance" element={<Finance />} />
            <Route path="laboratory" element={<Laboratory />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="nurses" element={<Nurses />} />
            <Route path="pharmacy" element={<Pharmacy />} />
            <Route path="users" element={<Users />} />
            <Route path="payment" element={<Payment />} />
            <Route path="profile" element={<Profile />} />
            <Route path="shifts" element={<Shift />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="stocks" element={<Stocks />} />
            <Route path="request" element={<Request/>} />
        
            
          </Route>
        </Routes>
      </AuthProvider>
=======
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="overview" />} />
          <Route path="overview" element={<Overview />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:id" element={<PatientDetails />} />
          <Route
            path="appointments/:patientId"
            element={<AppointmentDetails />}
          />
          <Route path="doctors" element={<Doctors />} />
          <Route path="doctors/:id" element={<DoctorDetails />} />
          <Route path="consultants" element={<Consultants />} />
          <Route path="consultants/:id" element={<ConsultantDetails />} />

          <Route path="finance" element={<Finance />} />
          <Route path="laboratory" element={<Laboratory />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="nurses" element={<Nurses />} />
          <Route path="nurses/:id" element={<NurseDetails />} />
          <Route path="pharmacy" element={<Pharmacy />} />
          <Route path="users" element={<Users />} />
          <Route path="payment" element={<Payment />} />
          <Route path="profile" element={<Profile />} />
          <Route path="shifts" element={<Shift />} />
          <Route path="expenses" element={<Expenses />} />
        </Route>
      </Routes>
      <Toaster />
      {/* </AuthProvider> */}
>>>>>>> da874f1729ae2ef9f1db1d7067124aae49e10fa6
    </div>
  );
}

export default App;
