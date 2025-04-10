import { JSX, useState, useEffect } from "react";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Table from "../../../Shared/Table";
import BookAppointmentModal from "../../../Shared/BookAppointmentModal";
import Tablehead from "../../ReusablepatientD/Tablehead";
import FrontdeskDetails from "./FrontdeskDetails";
import AppointmentDetails from "./AppointmentDetails";
import { Plus, Search } from "lucide-react";
import Button from "../../../Shared/Button";
import FrontdeskAppointmentModal from "./FrontdeskAppointmentModal";

const FrondeskAppointmentTable = () => {
  const [activeTab, setActiveTab] = useState(0);
  // const [activeTab, setActiveTab] = useState(0); // Tracks the active tab (if you have tabs)
  const [openModal, setOpenModal] = useState(false); // Controls modal visibility

  // Handler to open the Book Appointment modal
  const handleOpenModal = () => {
    setOpenModal(true); // Simply open the modal when the button is clicked
  };

  const { appointments, isLoading, getAllAppointments } = usePatientStore();

  useEffect(() => {
    getAllAppointments("/front-desk/appointment/all-records");
  }, [getAllAppointments]);

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
      {openModal && (
        <FrontdeskAppointmentModal
          onClose={() => setOpenModal(false)}
          endpoint="/front-desk/appointment/book"
          refreshEndpoint="/front-desk/appointment/all-records"
        />
      )}
    </div>
  );
};

export default FrondeskAppointmentTable;
