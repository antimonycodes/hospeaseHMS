// FrondeskAppointmentTable.tsx
import { JSX, useEffect, useState } from "react";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Tablehead from "../../ReusablepatientD/Tablehead";
import AppointmentDetails from "./AppointmentDetails";
import BookAppointmentModal from "../../../Shared/BookAppointmentModal";

type FrondeskAppointmentTableProps = {
  endpoint?: string; // Allow custom endpoint
  bookEndpoint?: string; // Endpoint for booking appointments
  refreshEndpoint?: string; // Endpoint for refreshing after booking
  tableTitle?: string; // Custom table title
};

const FrondeskAppointmentTable = ({
  endpoint = "/medical-report/appointment",
  bookEndpoint = "/front-desk/appointment/book",

  tableTitle = "Appointment",
}: FrondeskAppointmentTableProps) => {
  const [openModal, setOpenModal] = useState(false);
  const { appointments, pagination, isLoading, getAllAppointments } =
    usePatientStore();

  const baseEndpoint = "/front-desk/appointment/all-records";

  useEffect(() => {
    getAllAppointments("1", "10");
  }, [getAllAppointments]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const refreshEndpoint = "/front-desk/appointment/all-records";

  return (
    <div>
      <Tablehead
        tableTitle={tableTitle}
        showButton={true}
        typebutton="Book Appointment"
        onButtonClick={handleOpenModal}
        showSearchBar={true}
        showControls={true}
      />

      <AppointmentDetails
        data={appointments}
        pagination={pagination}
        isLoading={isLoading}
        endpoint={endpoint}
      />

      {openModal && (
        <BookAppointmentModal
          onClose={() => setOpenModal(false)}
          endpoint={bookEndpoint}
          refreshEndpoint={refreshEndpoint}
        />
      )}
    </div>
  );
};

export default FrondeskAppointmentTable;
