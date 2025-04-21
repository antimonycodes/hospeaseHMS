import { useEffect, useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import FrontdeskInfo from "./FrontdeskInfo";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import AddPatientModals from "./AddPatientModals";

const FpatientsTable = () => {
  const [openModal, setOpenModal] = useState(false);
  const { getAllPatients, patients, createPatient, isLoading, pagination } =
    usePatientStore();
  const baseEndpoint = "/front-desk/patient/fetch";

  useEffect(() => {
    getAllPatients("1", "10", baseEndpoint);
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
        typebutton="Add New"
        onButtonClick={handleOpenModal}
      />
      <FrontdeskInfo
        patients={patients}
        isLoading={isLoading}
        pagination={pagination}
        baseEndpoint={baseEndpoint}
      />
      {/* Modal */}
      {openModal && (
        <AddPatientModals
          onClose={() => setOpenModal(false)}
          createPatient={createPatient}
          isLoading={isLoading}
          endpoint="/front-desk/patient/create"
          refreshendpoint={baseEndpoint}
        />
      )}
    </div>
  );
};

export default FpatientsTable;
