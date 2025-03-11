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
    <div className="w-full h-full rounded-lg custom-shadow bg-white">
      <div className=" p-4 flex items-center gap-2">
        <h1 className=" font-medium text-lg text-[#101828] ">Patients</h1>
        <span className=" bg-[#F9F5FF] py-1 px-4 rounded-full text-[#6941C6] font-medium">
          {patients.length}
        </span>
      </div>
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
