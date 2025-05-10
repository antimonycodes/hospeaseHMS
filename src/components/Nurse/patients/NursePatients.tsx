// NursePatients.tsx
import React, { useEffect, useState, useMemo } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import NursePatientTable from "./NursePatientTable";
import SearchBar from "../../ReusablepatientD/SearchBar";

type PatientStatus = "Pending" | "Completed";

const NursePatients = () => {
  const { getAllPatients, patients, searchPatients, isLoading, pagination } =
    usePatientStore();
  const [activeTab, setActiveTab] = React.useState<"Pending" | "Completed">(
    "Pending"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const baseEndpoint = "/nurses/all-patients";

  useEffect(() => {
    if (searchQuery) {
      searchPatients(searchQuery).then((fetchedPatients) => {
        usePatientStore.setState({ patients: fetchedPatients });
      });
    } else {
      getAllPatients("1", "10", baseEndpoint);
    }
  }, [getAllPatients, searchPatients, searchQuery]);

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

  const tabOptions: PatientStatus[] = ["Pending", "Completed"];

  return (
    <div className="p-4">
      <Tablehead
        typebutton="Add New"
        tableTitle="Patients"
        tableCount={patients.length}
        showSearchBar={true}
        showControls={true}
        searchBar={<SearchBar onSearch={handleSearch} />}
      />
      <NursePatientTable
        patients={patients}
        isLoading={isLoading}
        pagination={pagination}
        baseEndpoint={baseEndpoint}
      />
    </div>
  );
};

export default NursePatients;
