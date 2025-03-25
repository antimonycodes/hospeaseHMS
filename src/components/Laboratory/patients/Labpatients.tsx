import React, { useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Tabs from "../../ReusablepatientD/Tabs";
import PatientTable from "../../ReusablepatientD/PatientTable";

type Patient = {
  id: string;
  lastVisit: string;
  name: string;
  phone: string;
  gender: "Male" | "Female";
  patientid: string;
  branch: string;
  occupation: string;
  age: number;
  status: "Pending" | "Ongoing" | "Completed";
};

const patients: Patient[] = [
  {
    id: "1",
    lastVisit: "01-01-2025",
    name: "Philip Ikiriko",
    phone: "+2348035839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 28,
    status: "Pending",
  },
  {
    id: "2",
    lastVisit: "01-01-2025",
    name: "Deborah Durojaiye",
    phone: "+2348025839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 34,
    status: "Pending",
  },
  {
    id: "3",
    lastVisit: "01-01-2025",
    name: "Victoria Ilesanmi",
    phone: "+2348055839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 22,
    status: "Ongoing",
  },
  {
    id: "4",
    lastVisit: "01-01-2025",
    name: "John Doe",
    phone: "+2348075839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 45,
    status: "Pending",
  },
  {
    id: "5",
    lastVisit: "01-01-2025",
    name: "Jane Smith",
    phone: "+2348095839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 30,
    status: "Ongoing",
  },
  {
    id: "6",
    lastVisit: "01-01-2025",
    name: "Michael Johnson",
    phone: "+2348105839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 50,
    status: "Ongoing",
  },
  {
    id: "7",
    lastVisit: "01-01-2025",
    name: "Sarah Brown",
    phone: "+2348115839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 27,
    status: "Pending",
  },
  {
    id: "8",
    lastVisit: "01-01-2025",
    name: "David Wilson",
    phone: "+2348125839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 33,
    status: "Pending",
  },
  {
    id: "9",
    lastVisit: "01-01-2025",
    name: "Laura Martinez",
    phone: "+2348135839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 29,
    status: "Completed",
  },
  {
    id: "10",
    lastVisit: "01-01-2025",
    name: "James Anderson",
    phone: "+2348145839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 40,
    status: "Completed",
  },
  {
    id: "11",
    lastVisit: "01-01-2025",
    name: "Emily Taylor",
    phone: "+2348155839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 35,
    status: "Completed",
  },
  {
    id: "12",
    lastVisit: "01-01-2025",
    name: "Daniel Thomas",
    phone: "+2348165839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 31,
    status: "Completed",
  },
  {
    id: "13",
    lastVisit: "01-01-2025",
    name: "Olivia Jackson",
    phone: "+2348175839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 26,
    status: "Pending",
  },
  {
    id: "14",
    lastVisit: "01-01-2025",
    name: "William White",
    phone: "+2348185839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 38,
    status: "Completed",
  },
  {
    id: "15",
    lastVisit: "01-01-2025",
    name: "Sophia Harris",
    phone: "+2348195839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 32,
    status: "Pending",
  },
  {
    id: "16",
    lastVisit: "01-01-2025",
    name: "Benjamin Clark",
    phone: "+2348205839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 41,
    status: "Pending",
  },
  {
    id: "17",
    lastVisit: "01-01-2025",
    name: "Ava Lewis",
    phone: "+2348215839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 28,
    status: "Pending",
  },
  {
    id: "18",
    lastVisit: "01-01-2025",
    name: "Henry Walker",
    phone: "+2348225839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 36,
    status: "Pending",
  },
  {
    id: "19",
    lastVisit: "01-01-2025",
    name: "Mia Hall",
    phone: "+2348235839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 29,
    status: "Pending",
  },
  {
    id: "20",
    lastVisit: "01-01-2025",
    name: "Samuel Young",
    phone: "+2348245839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 37,
    status: "Pending",
  },
];

const getStatusCounts = () => {
  return patients.reduce(
    (acc, patient) => {
      acc[patient.status]++;
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
      {" "}
      <Tablehead />
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        statusCounts={statusCounts}
      />
      <PatientTable patients={filteredPatients} />
    </div>
  );
};

export default Labpatients;
