import { useEffect, useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import FrontdeskInfo from "./FrontdeskInfo";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import AddPatientModals from "./AddPatientModals";
import SearchBar from "../../ReusablepatientD/SearchBar";
import Loader from "../../../Shared/Loader";

const FpatientsTable = () => {
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    getAllPatients,
    searchPatients,
    patients,
    createPatient,
    isLoading,
    pagination,
  } = usePatientStore();
  const baseEndpoint = "/front-desk/patient/fetch";

  useEffect(() => {
    if (searchQuery) {
      searchPatients(searchQuery).then((fetchedPatients) => {
        usePatientStore.setState({ patients: fetchedPatients });
      });
    } else {
      getAllPatients("1", "10", baseEndpoint);
    }
  }, [getAllPatients, searchPatients, searchQuery]);

  if (!patients) return <Loader />;

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  return (
    <div className="font-inter">
      <Tablehead
        tableTitle="Patients"
        tableCount={patients.length}
        showButton={true}
        showControls={true}
        searchBar={<SearchBar onSearch={handleSearch} />}
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
          // updateEndpoint="/front-desk/patient/update"
          // refreshendpoint={baseEndpoint}
        />
      )}
    </div>
  );
};

export default FpatientsTable;
