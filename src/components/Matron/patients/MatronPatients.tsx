import React, { JSX, useEffect, useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import MatronPatientTable from "./MatronPatientTable";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Tabs from "../../ReusablepatientD/Tabs";
import SearchBar from "../../ReusablepatientD/SearchBar";

const MatronPatients = () => {
  // const { getAllPatients, patients, isLoading } = usePatientStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { getAllPatients, searchPatients, patients, isLoading, pagination } =
    usePatientStore();
  const [activeTab, setActiveTab] = React.useState<"Pending" | "Completed">(
    "Pending"
  );

  const baseEndpoint = "/matron/all-patients";

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

  const filteredPatients = patients.filter(
    (patient) =>
      patient.attributes?.status === activeTab || activeTab === "Pending"
  );

  const statusCounts = patients.reduce(
    (acc, patient) => {
      const status = patient.attributes?.status || "Pending";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { Pending: 0, Completed: 0 }
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <Tablehead
        tableTitle="Patients"
        tableCount={patients.length}
        showControls={true}
        showSearchBar={true}
        searchBar={<SearchBar onSearch={handleSearch} />}
      />
      <Tabs<"Pending" | "Completed">
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        statusCounts={statusCounts}
        tabs={["Pending", "Completed"]}
      />
      <MatronPatientTable
        patients={patients}
        isLoading={isLoading}
        pagination={pagination}
        baseEndpoint={baseEndpoint}
        getAllPatients={getAllPatients}
      />
    </div>
  );
};

export default MatronPatients;
