import { JSX, useState, useEffect } from "react";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Tablehead from "../../ReusablepatientD/Tablehead";
import AppointmentDetails from "./AppointmentDetails";
import BookAppointmentModal from "../../../Shared/BookAppointmentModal";

const FrondeskAppointmentTable = () => {
  const [openModal, setOpenModal] = useState(false);

  const { appointments, isLoading, getAllAppointments } = usePatientStore();

  useEffect(() => {
    getAllAppointments("/front-desk/appointment/all-records");
  }, [getAllAppointments]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

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
