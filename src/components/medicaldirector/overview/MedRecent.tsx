import React, { useEffect } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import RecentPatients from "./RecentPatients";

const MedRecent = () => {
  const { patients, getAllPatients, isLoading } = usePatientStore();

  useEffect(() => {
    getAllPatients("/medical-director/patient");
  }, [getAllPatients]);

  return (
    <div>
      <Tablehead tableTitle="Recent Patients" tableCount={patients.length} />
      <RecentPatients patients={patients} isLoading={isLoading} />
    </div>
  );
};

export default MedRecent;
