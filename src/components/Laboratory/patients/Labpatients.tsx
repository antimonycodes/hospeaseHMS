import React, { useState } from "react";
import { patients } from "../../../data/patientsData";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Tabs from "../../ReusablepatientD/Tabs";
import PatientTable from "../../ReusablepatientD/PatientTable"; // Ensure correct import

const getStatusCounts = () => {
  return patients.reduce(
    (acc, patient) => {
      acc[patient.status] = (acc[patient.status] || 0) + 1;
      return acc;
    },
    { Pending: 0, Ongoing: 0, Completed: 0 }
  );
};

const Labpatients = () => {
  const [activeTab, setActiveTab] = useState<
    "Pending" | "Ongoing" | "Completed"
  >("Pending");
  const statusCounts = getStatusCounts();
  const filteredPatients = patients.filter((p) => p.status === activeTab);

  return (
    <div>
      <Tablehead tableTitle="Patients" tableCount={patients.length} />
      <Tabs<"Pending" | "Ongoing" | "Completed">
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        statusCounts={statusCounts}
        tabs={["Pending", "Ongoing", "Completed"]}
      />

      <PatientTable patients={filteredPatients} />
    </div>
  );
};

export default Labpatients;
