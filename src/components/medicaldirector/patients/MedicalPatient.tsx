import React, { useEffect } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import MedpatientInfo from "./MedpatientInfo";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";

const MedicalPatient = () => {
  const { patients, getAllPatients, isLoading, pagination } = usePatientStore();
  const baseEndpoint = "/medical-director/patient";

  useEffect(() => {
    getAllPatients("1", "10", baseEndpoint);
  }, [getAllPatients]);

  return (
    <div>
      <Tablehead
        tableTitle="Patients"
        tableCount={patients.length}
        showSearchBar={true}
        showControls={true}
      />
      <MedpatientInfo
        patients={patients}
        isLoading={isLoading}
        pagination={pagination}
        baseEndpoint={baseEndpoint}
        getAllPatients={getAllPatients}
      />
    </div>
  );
};

export default MedicalPatient;
