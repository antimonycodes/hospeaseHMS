// FrondeskAppointmentTable.tsx
import { JSX, useEffect, useState } from "react";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Tablehead from "../../ReusablepatientD/Tablehead";
import AppointmentDetails from "./AppointmentDetails";
import BookAppointmentModal from "../../../Shared/BookAppointmentModal";
import SearchBar from "../../ReusablepatientD/SearchBar";

type FrondeskAppointmentTableProps = {
  endpoint?: string; // Allow custom endpoint
  bookEndpoint?: string; // Endpoint for booking appointments
  refreshEndpoint?: string; // Endpoint for refreshing after booking
  tableTitle?: string; // Custom table title
};

const FrondeskAppointmentTable = ({
  endpoint = "/front-desk/appointment/all-records",
  bookEndpoint = "/front-desk/appointment/book",
  refreshEndpoint = "/front-desk/appointment/all-records",
  tableTitle = "Appointment",
}: FrondeskAppointmentTableProps) => {
  const [openModal, setOpenModal] = useState(false);
  const {
    appointments,
    searchPatients,
    pagination,
    isLoading,
    getAllAppointments,
  } = usePatientStore();
  const [searchQuery, setSearchQuery] = useState("");
  const baseEndpoint = "/front-desk/appointment/all-records";

  // useEffect(() => {
  //   getAllAppointments("1", "10");
  // }, [getAllAppointments]);

  useEffect(() => {
    if (searchQuery) {
      searchPatients(searchQuery).then((fetchedPatients) => {
        usePatientStore.setState({ patients: fetchedPatients });
      });
    } else {
      getAllAppointments("1", "10", baseEndpoint);
    }
  }, [getAllAppointments, searchPatients, searchQuery]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
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
