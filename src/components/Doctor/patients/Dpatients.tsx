import Tablehead from "../../ReusablepatientD/Tablehead";
import DpatientsInfo from "./DpatientsInfo";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import { useEffect } from "react";

const Dpatients = () => {
  const { patients, getAllPatients, isLoading } = usePatientStore();

  useEffect(() => {
    getAllPatients("/doctor/patient");
  }, [getAllPatients]);

  return (
    <div className="w-full font-inter h-full bg-white rounded-[8px] shadow overflow-hidden">
      <Tablehead
        tableTitle="Patients"
        tableCount={patients.length}
        showSearchBar={true}
        showControls={true}
      />
      <DpatientsInfo patients={patients} isLoading={isLoading} />
    </div>
  );
};

export default Dpatients;
