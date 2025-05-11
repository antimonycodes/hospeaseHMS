// FrondeskAppointmentTable.tsx
import { JSX, useEffect, useState } from "react";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Tablehead from "../../ReusablepatientD/Tablehead";
import AppointmentDetails from "./AppointmentDetails";
import BookAppointmentModal from "../../../Shared/BookAppointmentModal";
import SearchBar from "../../ReusablepatientD/SearchBar";

type FrondeskAppointmentTableProps = {
  endpoint?: string;
  bookEndpoint?: string;
  refreshEndpoint?: string;
  tableTitle?: string;
};

const FrondeskAppointmentTable = ({
  endpoint = "medical-report/appointment/all-records",
  bookEndpoint = "/front-desk/appointment/book",

  tableTitle = "Appointment",
}: FrondeskAppointmentTableProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    appointments,

    pagination,
    isLoading,
    getAllAppointments,
  } = usePatientStore();

  const baseEndpoint = "medical-report/appointment/all-records";

  useEffect(() => {
    getAllAppointments("1", "10");
  }, [getAllAppointments]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const refreshEndpoint = "medical-report/appointment/all-records";
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <Tablehead
        tableTitle={tableTitle}
        showButton={true}
        typebutton="Book Appointment"
        onButtonClick={handleOpenModal}
        showSearchBar={true}
        searchBar={<SearchBar onSearch={handleSearch} />}
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
