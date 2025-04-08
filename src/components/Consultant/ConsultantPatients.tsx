import { useEffect } from "react";
import { useDoctorStore } from "../../store/super-admin/useDoctorStore";
import Tablehead from "../ReusablepatientD/Tablehead";
import PatientTable from "../ReusablepatientD/PatientTable";

const ConsultantPatients = () => {
  const { consultants, getAllConsultants, isLoading } = useDoctorStore();

  useEffect(() => {
    getAllConsultants("/consultant/my-appointments"); // Fetch consultants' appointments
  }, [getAllConsultants]);

  return (
    <div>
      <Tablehead
        typebutton="Add New"
        tableTitle="Patients"
        tableCount={consultants.length}
      />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <PatientTable patients={consultants} />
      )}
    </div>
  );
};

export default ConsultantPatients;
