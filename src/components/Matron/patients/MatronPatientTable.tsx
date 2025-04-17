import JSX, { useState } from "react";
import Loader from "../../../Shared/Loader";
import Table from "../../../Shared/Table";
import { useNavigate } from "react-router-dom";

type MatronPatientData = {
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
  key: keyof MatronPatientData | "viewmore";
  label: string;
  render?: (value: any, patient: MatronPatientData) => React.ReactElement;
};

type MatronPatientDataProps = {
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
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  } | null;
  baseEndpoint?: string;
  getAllPatients: (
    page: string,
    perPage: string,
    baseEndpoint?: string
  ) => void;
};

const MatronPatientTable = ({
  patients,
  isLoading,
  pagination,
  baseEndpoint,
  getAllPatients,
}: MatronPatientDataProps) => {
  const navigate = useNavigate();
  const [perPage, setPerPage] = useState(pagination?.per_page || 10);

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
    navigate(`/dashboard/matron/patients/${id}`);
  };

  const handlePageChange = (page: number) => {
    getAllPatients(page.toString(), perPage.toString(), baseEndpoint);
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
        pagination={true}
        paginationData={pagination}
        loading={isLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MatronPatientTable;
