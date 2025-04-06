import React, { useEffect, useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import { patients } from "../../../data/patientsData";
import Tabs from "../../ReusablepatientD/Tabs";

import PatientTable from "../../ReusablepatientD/PatientTable";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";

const getStatusCounts = () => {
  const { getAllPatients, patients } = usePatientStore();

  useEffect(() => {
    getAllPatients("pharmacy/patient/all");
  }, []);

  console.log(patients, "pharmacy");
  return patients.reduce(
    (
      acc: { Pending: number; Completed: number },
      patient: { status: "Pending" | "Completed" }
    ) => {
      if (patient.status === "Pending" || patient.status === "Completed") {
        acc[patient.status] = (acc[patient.status] || 0) + 1;
      }
      return acc;
    },
    { Pending: 0, Completed: 0 }
  );
};

const PharmPatients = () => {
  const [activeTab, setActiveTab] = useState<"Pending" | "Completed">(
    "Pending"
  );
  const statusCounts = getStatusCounts();
  const filteredPatients = patients.filter((p) => p.status === activeTab);

  return (
    <div>
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
      <PatientTable patients={filteredPatients} />
    </div>
  );
};

export default PharmPatients;
