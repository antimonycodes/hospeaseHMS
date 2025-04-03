import { useEffect, useState } from "react";
import AddPatientModal from "../../../Shared/AddPatientModal";
import Tablehead from "../../ReusablepatientD/Tablehead";
import FrontdeskInfo from "./FrontdeskInfo";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";

// FpatientsTable.tsx
const FpatientsTable = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const { getAllPatients, patients, createPatient, isLoading } =
    usePatientStore();

  useEffect(() => {
    getAllPatients("/front-desk/patient/fetch"); // Fetch patients from front-desk endpoint
  }, [getAllPatients]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return (
    <div className="font-inter">
      <Tablehead
        tableTitle="Patients"
        tableCount={patients.length}
        showButton={true}
        showControls={true}
        showSearchBar={true}
        onButtonClick={handleOpenModal}
      />
      <FrontdeskInfo patients={patients} isLoading={isLoading} />
      {/* Modal */}
      {openModal && (
        <AddPatientModal
          onClose={() => setOpenModal(false)}
          createPatient={createPatient}
          isLoading={isLoading}
          endpoint="/front-desk/patient/create"
          refreshendpoint="/front-desk/patient/fetch"
        />
      )}
    </div>
  );
};

export default FpatientsTable;
