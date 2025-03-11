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
            <Route path="doctors" element={<Doctors />} />
            <Route
              path="/dashboard/doctors/doctor"
              element={<DoctorDetails />}
            />
            <Route path="consultants" element={<Consultants />} />
            <Route path="finance" element={<Finance />} />
            <Route path="laboratory" element={<Laboratory />} />

            <Route path="appointments" element={<Appointments />} />
            {/* 
          <Route path="users" element={<Users />} />
          <Route path="finance" element={<Finance />} /> */}
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
