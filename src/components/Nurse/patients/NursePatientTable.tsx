import React, { useState } from "react";
import Table from "../../../Shared/Table";
import { useNavigate } from "react-router-dom";
import Loader from "../../../Shared/Loader";

type NursePatientData = {
  name: string;
  patientId: string;
  gender: string;
  phone: string;
  occupation: string;
  viewmore: string;
  status: string;
  id: number;
};

type Columns = {
  key: keyof NursePatientData | "viewmore";
  label: string;
  render?: (value: any, patient: NursePatientData) => React.ReactElement;
};

type NursePatientDataProps = {
  isLoading?: boolean;
  patients: {
    attributes: {
      first_name: string;
      last_name: string;
      card_id: string;
      gender: string;
      phone_number: string;
      status: string;
      occupation: string;
    };
    id: number;
  }[];
};

const NursePatientTable = ({ patients, isLoading }: NursePatientDataProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  const formattedPatients = patients.map((patient: any) => ({
    name: `${patient.attributes.first_name} ${patient.attributes.last_name}`,
    patientId: patient.attributes.card_id,
    gender: patient.attributes.gender,
    phone: patient.attributes.phone_number,
    occupation: patient.attributes.occupation,
    status: patient.attributes.status || "Pending",

    viewmore: "viewmore",
    id: patient.id,
  }));

  const handleViewMore = (id: number) => {
    navigate(`/dashboard/nurses/patients/${id}`);
  };

  if (isLoading) return <Loader />;

  if (!patients.length) return <div>No patients to display</div>;

  const columns: Columns[] = [
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
      key: "gender",
      label: "Gender",
      render: (_, patient) => (
        <span className="text-[#667085]">{patient.gender}</span>
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
      key: "occupation",
      label: "Occupation",
      render: (_, patient) => (
        <span className="text-[#667085]">{patient.occupation}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (_, patient) => (
        <span className="text-[#667085]">{patient.status}</span>
      ),
    },
    {
      key: "viewmore",
      label: "",
      render: (_, patient) => (
        <span
          className="text-primary text-sm font-medium cursor-pointer"
          onClick={() => handleViewMore(patient.id)}
        >
          View More
        </span>
      ),
    },
  ];
  return (
    <div>
      <Table
        data={formattedPatients}
        columns={columns}
        rowKey="id"
        currentPage={currentPage}
        pagination={formattedPatients.length > 10}
        rowsPerPage={10}
      />
    </div>
  );
};

export default NursePatientTable;
