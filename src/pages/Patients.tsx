import { JSX } from "react";
import PatientsPage from "../components/Superadmin/patients/PatientsPage";
import { useRole } from "../hooks/useRole";

const roleComponents: Record<string, JSX.Element> = {
  superadmin: <PatientsPage />,
  //   doctor:  ,
  //   frontdesk: ,
};

const Patients = () => {
  const role = useRole();

  return (
    <div>
      <PatientsPage />
    </div>
  );
};

export default Patients;
