import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Signup from "./_Auth/Signup";
import Overview from "./pages/Overview";
import { AuthProvider } from "./store/AuthContext";
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

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Signup />} />

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
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
