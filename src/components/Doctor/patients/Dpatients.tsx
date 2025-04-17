import Tablehead from "../../ReusablepatientD/Tablehead";
import DpatientsInfo from "./DpatientsInfo";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import { useEffect } from "react";

const Dpatients = () => {
  const { patients, getAllPatients, isLoading, pagination } = usePatientStore();

  const baseEndpoint = "/doctor/patient";

  useEffect(() => {
    getAllPatients("1", "10", baseEndpoint);
  }, [getAllPatients]);

  return (
    <div className="w-full font-inter h-full bg-white rounded-[8px] shadow overflow-hidden">
      <Tablehead
        typebutton="Add New"
        tableTitle="Patients"
        tableCount={patients.length}
        showSearchBar={true}
        showControls={true}
      />
      <DpatientsInfo
        patients={patients}
        isLoading={isLoading}
        pagination={pagination}
        baseEndpoint={baseEndpoint}
        getAllPatients={getAllPatients}
      />
    </div>
  );
};

export default Dpatients;
