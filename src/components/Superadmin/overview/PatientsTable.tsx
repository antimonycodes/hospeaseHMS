import { JSX, useEffect, useState } from "react";
import Table from "../../../Shared/Table";

type Column<T> = {
  key: keyof T;
  label: string;
  render: (value: any, row: T) => React.ReactNode;
};

interface PatientAttributes {
  card_id: any;
  id: number;
  first_name: string;
  last_name: string;
  patientId: string;
  phone: string;
  gender: "Male" | "Female";
}

interface Patient {
  id: number;
  attributes: PatientAttributes;
}

const PatientsTable = ({
  patients,
  pagination,
}: {
  patients: Patient[];
  pagination?: { total: number };
}) => {
  const [simplifiedPatients, setSimplifiedPatients] = useState<
    PatientAttributes[]
  >([]);

  console.log(pagination, "pagination");

  // UseEffect to transform patient data into a simplified version
  useEffect(() => {
    return setSimplifiedPatients(
      patients.slice(0, 3).map((patient) => ({
        id: patient.id,
        first_name: patient.attributes.first_name,
        last_name: patient.attributes.last_name,
        card_id: patient.attributes.card_id,
        patientId: patient.attributes.card_id,
        phone: patient.attributes.phone,
        gender: patient.attributes.gender,
      }))
    );
  }, [patients]);

  const columns: Column<PatientAttributes>[] = [
    {
      key: "first_name",
      label: "Name",
      render: (_, patient) => (
        <span className="font-medium text-[#101828]">
          {patient.first_name} {patient.last_name}
        </span>
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
        <span className="font-medium text-[#667085]">{patient.gender}</span>
      ),
    },
  ];

  return (
    <div className="w-full h-full rounded-lg custom-shadow bg-white">
      <div className="p-4 flex items-center gap-2">
        <h1 className="font-medium text-lg text-[#101828]">Patients</h1>
        <span className="bg-[#F9F5FF] py-1 px-4 rounded-full text-[#6941C6] font-medium">
          {pagination?.total}
        </span>
      </div>

      {/* Pass the simplified patients data to the Table */}
      <Table
        data={simplifiedPatients} // Use simplifiedPatients here
        columns={columns}
        rowKey="id"
        pagination={simplifiedPatients.length > 10} // You can adjust this based on your needs
        rowsPerPage={10} // If you want to have pagination, you can adjust as needed
      />
    </div>
  );
};

export default PatientsTable;
