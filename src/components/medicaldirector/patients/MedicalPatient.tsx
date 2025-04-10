import React, { useEffect } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import MedpatientInfo from "./MedpatientInfo";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";

const MedicalPatient = () => {
  const { patients, getAllPatients, isLoading } = usePatientStore();

  useEffect(() => {
    getAllPatients("/medical-director/patient");
  }, [getAllPatients]);

  return (
    <div>
      <Tablehead
        tableTitle="Patients"
        tableCount={patients.length}
        showSearchBar={true}
        showControls={true}
      />
      <MedpatientInfo patients={patients} isLoading={isLoading} />
    </div>
  );
};

export default MedicalPatient;
