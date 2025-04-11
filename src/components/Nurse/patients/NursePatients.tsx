// NursePatients.tsx
import React, { useEffect, useState, useMemo } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Tabs from "../../ReusablepatientD/Tabs";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import NursePatientTable from "./NursePatientTable";

type PatientStatus = "Pending" | "Completed";

const NursePatients = () => {
  const { getAllPatients, patients = [], isLoading } = usePatientStore();
  const [activeTab, setActiveTab] = React.useState<"Pending" | "Completed">(
    "Pending"
  );
  useEffect(() => {
    getAllPatients("/nurses/all-patients");
  }, [getAllPatients]);

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

  // Assuming Tabs component expects these props
  const tabOptions: PatientStatus[] = ["Pending", "Completed"];

  return (
    <div className="p-4">
      <Tablehead
        typebutton="Add New"
        tableTitle="Patients"
        tableCount={patients.length}
      />
      <Tabs<"Pending" | "Completed">
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        statusCounts={statusCounts}
        tabs={["Pending", "Completed"]}
      />
      <NursePatientTable patients={patients} isLoading={isLoading} />
    </div>
  );
};

export default NursePatients;
