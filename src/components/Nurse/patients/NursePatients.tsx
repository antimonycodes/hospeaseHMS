// NursePatients.tsx
import React, { useEffect, useState, useMemo } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Tabs from "../../ReusablepatientD/Tabs";
import PatientTable from "../../ReusablepatientD/PatientTable";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";

type PatientStatus = "Pending" | "Completed" | "Ongoing";

const NursePatients = () => {
  const { patients, getAllPatients, isLoading } = usePatientStore();
  const [activeTab, setActiveTab] = useState<PatientStatus>("Pending");

  const statusCounts = useMemo(() => {
    return patients.reduce(
      (acc: Record<PatientStatus, number>, patient) => {
        const status = patient.attributes.status as PatientStatus;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      { Pending: 0, Completed: 0, Ongoing: 0 }
    );
  }, [patients]);

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => p.attributes.status === activeTab);
  }, [patients, activeTab]);

  useEffect(() => {
    getAllPatients("/nurses/all-patients");
  }, [getAllPatients]);

  // Assuming Tabs component expects these props
  const tabOptions: PatientStatus[] = ["Pending", "Completed", "Ongoing"];

  return (
    <div className="p-4">
      <Tablehead
        typebutton="Add New"
        tableTitle="Patients"
        tableCount={patients.length}
      />
      <Tabs<PatientStatus>
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        statusCounts={statusCounts}
        tabs={tabOptions}
      />
      <PatientTable patients={filteredPatients} isLoading={isLoading} />
    </div>
  );
};

export default NursePatients;
