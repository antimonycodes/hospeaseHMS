import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Signup from "./_Auth/Signup";
import Overview from "./pages/Overview";
import { AuthProvider } from "./store/AuthContext";
import Patients from "./pages/Patients";

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
            {/* 
          <Route path="appointments" element={<Appointments />} />
          <Route path="users" element={<Users />} />
          <Route path="finance" element={<Finance />} /> */}
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
