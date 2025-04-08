import { JSX, useState, useEffect } from "react";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Table from "../../../Shared/Table";
import BookAppointmentModal from "../../../Shared/BookAppointmentModal";
import Tablehead from "../../ReusablepatientD/Tablehead";
import FrontdeskDetails from "./FrontdeskDetails";
import AppointmentDetails from "./AppointmentDetails";

const FrondeskAppointmentTable = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<"patient" | "appointment">(
    "patient"
  );

  const handleOpenModal = () => {
    setModalType(activeTab === 0 ? "patient" : "appointment");
    setOpenModal(true);
  };

  const {
    getAllPatients,
    patients,
    createPatient,
    getPatientById,
    selectedPatient,
    isLoading,
    pagination,
  } = usePatientStore();

  useEffect(() => {
    getAllPatients();
  }, []);
  return (
    <div>
      <Tablehead
        tableTitle="Appointment"
        showButton={true}
        typebutton="Book Appointment"
        onButtonClick={handleOpenModal}
        showSearchBar={true}
        showControls={true}
      />
      <AppointmentDetails />
      {openModal && modalType === "appointment" && (
        <BookAppointmentModal
          onClose={() => setOpenModal(false)}
          endpoint="/front-desk/appointment/book"
          refreshEndpoint="/front-desk/appointment/all-records"
        />
      )}
    </div>
  );
};

export default FrondeskAppointmentTable;
