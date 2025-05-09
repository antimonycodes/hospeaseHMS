import { useEffect, useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import FrontdeskInfo from "./FrontdeskInfo";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import AddPatientModals from "./AddPatientModals";
import SearchBar from "../../ReusablepatientD/SearchBar";

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

  // useEffect(() => {
  //   getAllPatients("1", "10", baseEndpoint);
  // }, [getAllPatients]);

  useEffect(() => {
    if (searchQuery) {
      // Call searchPatients when there's a search query
      searchPatients(searchQuery).then((fetchedPatients) => {
        // Assuming searchPatients returns an array of patients
        // Update patients state directly
        usePatientStore.setState({ patients: fetchedPatients });
      });
    } else {
      // Call getAllPatients with baseEndpoint when search query is empty
      getAllPatients("1", "10", baseEndpoint);
    }
  }, [getAllPatients, searchPatients, searchQuery]);

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
          refreshendpoint={baseEndpoint}
        />
      )}
    </div>
  );
};

export default FpatientsTable;
