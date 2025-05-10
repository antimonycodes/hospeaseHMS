import React, { useEffect, useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import MedpatientInfo from "./MedpatientInfo";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import SearchBar from "../../ReusablepatientD/SearchBar";

const MedicalPatient = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { patients, getAllPatients, searchPatients, isLoading, pagination } =
    usePatientStore();
  const baseEndpoint = "/medical-director/patient";

  useEffect(() => {
    if (searchQuery) {
      searchPatients(searchQuery).then((fetchedPatients) => {
        usePatientStore.setState({ patients: fetchedPatients });
      });
    } else {
      getAllPatients("1", "10", baseEndpoint);
    }
  }, [getAllPatients, searchPatients, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  return (
    <div>
      <Tablehead
        tableTitle="Patients"
        tableCount={patients.length}
        showSearchBar={true}
        showControls={true}
        searchBar={<SearchBar onSearch={handleSearch} />}
      />
      <MedpatientInfo
        patients={patients}
        isLoading={isLoading}
        pagination={pagination}
        baseEndpoint={baseEndpoint}
        getAllPatients={getAllPatients}
      />
    </div>
  );
};

export default MedicalPatient;
