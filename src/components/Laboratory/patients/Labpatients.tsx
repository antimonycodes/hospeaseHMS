import React, { useEffect, useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Tabs from "../../ReusablepatientD/Tabs";
import Labpatientsinfo from "./Labpatientsinfo";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";

const Labpatients = () => {
  const { patients, getAllPatients, isLoading } = usePatientStore();

  useEffect(() => {
    getAllPatients("/laboratory/patient/all");
  }, [getAllPatients]);

  const [activeTab, setActiveTab] = useState<
    "Pending" | "Ongoing" | "Completed"
  >("Pending");

  // Calculate status counts for the tabs
  const getStatusCounts = () => {
    return patients.reduce(
      (acc, patient) => {
        acc[patient.status] = (acc[patient.status] || 0) + 1;
        return acc;
      },
      { Pending: 0, Ongoing: 0, Completed: 0 }
    );
  };

  const statusCounts = getStatusCounts();

  // Filter patients based on the active tab
  const filteredPatients = patients.filter((p) => p.status === activeTab);

  return (
    <div>
      <Tablehead
        typebutton="Add New"
        tableTitle="Patients"
        tableCount={patients.length}
      />
      <Tabs<"Pending" | "Ongoing" | "Completed">
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        statusCounts={statusCounts}
        tabs={["Pending", "Ongoing", "Completed"]}
      />

      {/* Pass filtered patients to Labpatientsinfo */}
      <Labpatientsinfo patients={filteredPatients} isLoading={isLoading} />
    </div>
  );
};

export default Labpatients;
