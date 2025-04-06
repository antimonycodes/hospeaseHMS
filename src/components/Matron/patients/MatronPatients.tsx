import React, { JSX, useEffect } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import MatronPatientTable from "./MatronPatientTable";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";

const MatronPatients = () => {
  const { getAllPatients, patients, isLoading } = usePatientStore();

  useEffect(() => {
    getAllPatients("/matron/all-patients"); // Fetch patients from front-desk endpoint
  }, [getAllPatients]);

  return (
    <div>
      <Tablehead
        tableTitle="Patients"
        tableCount={patients.length}
        showControls={true}
        showSearchBar={true}
      />
      <MatronPatientTable patients={patients} isLoading={isLoading} />
    </div>
  );
};

export default MatronPatients;
