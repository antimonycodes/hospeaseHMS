// NursePatients.tsx
import React, { useEffect, useState, useMemo } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Tabs from "../../ReusablepatientD/Tabs";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import NursePatientTable from "./NursePatientTable";

type PatientStatus = "Pending" | "Completed";

const NursePatients = () => {
  const { getAllPatients, patients, isLoading, pagination } = usePatientStore();
  const [activeTab, setActiveTab] = React.useState<"Pending" | "Completed">(
    "Pending"
  );
  const baseEndpoint = "/nurses/all-patients";

  useEffect(() => {
    getAllPatients("1", "10", baseEndpoint);
  }, [getAllPatients]);

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
