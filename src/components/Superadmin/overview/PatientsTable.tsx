import { JSX } from "react";
import Table from "../../../Shared/Table";

type Patient = {
  id: string;
  patientId: string;
  name: string;
  phone: string;
  gender: "Male" | "Female";
};

const PatientsTable = () => {
  const patients: Patient[] = [
    {
      id: "1",
      patientId: "0019402",
      name: "Philip Ikiriko",
      phone: "+2345839499",
      gender: "Male",
    },
    {
      id: "2",
      patientId: "0020402",
      name: "Deborah Durojaiye",
      phone: "+2345839499",
      gender: "Female",
    },
    {
      id: "3",
      patientId: "0038802",
      name: "Victoria Ilesanmi",
      phone: "+2345839499",
      gender: "Male",
    },
  ];

  const columns: {
    key: keyof Patient;
    label: string;
    render?: (value: any, patient: Patient) => JSX.Element;
  }[] = [
    {
      key: "name",
      label: "Name",
      render: (_, patient) => (
        <span className="font-medium text-[#101828]">{patient.name}</span>
      ),
    },
    {
      key: "patientId",
      label: "Patient ID",
      render: (_, patient) => (
        <span className="text-[#667085]">{patient.patientId}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (_, patient) => (
        <span className="text-[#667085]">{patient.phone}</span>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      render: (_, patient) => (
        <span className={`  font-medium text-[#667085]`}>{patient.gender}</span>
      ),
    },
  ];

  return (
    <div className="w-full h-full">
      <Table
        data={patients}
        columns={columns}
        rowKey="id"
        pagination={patients.length > 10}
        rowsPerPage={10}
        // className="patients-table"
      />
    </div>
  );
};

export default PatientsTable;
