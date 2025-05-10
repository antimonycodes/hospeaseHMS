import Tablehead from "../../ReusablepatientD/Tablehead";
import DpatientsInfo from "./DpatientsInfo";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import { useEffect, useState } from "react";
import SearchBar from "../../ReusablepatientD/SearchBar";

const Dpatients = () => {
  const { patients, getAllPatients, searchPatients, isLoading, pagination } =
    usePatientStore();
  const [searchQuery, setSearchQuery] = useState("");
  const baseEndpoint = "/doctor/patient";

  // useEffect(() => {
  //   getAllPatients("1", "10", baseEndpoint);
  // }, [getAllPatients]);

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
    <div className="w-full font-inter h-full bg-white rounded-[8px] shadow overflow-hidden">
      <Tablehead
        typebutton="Add New"
        tableTitle="Patients"
        tableCount={patients.length}
        showSearchBar={true}
        searchBar={<SearchBar onSearch={handleSearch} />}
        showControls={true}
      />
      <DpatientsInfo
        patients={patients}
        isLoading={isLoading}
        pagination={pagination}
        baseEndpoint={baseEndpoint}
        getAllPatients={getAllPatients}
      />
    </div>
  );
};

export default Dpatients;
