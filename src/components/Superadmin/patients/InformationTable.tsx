import { JSX, useEffect, useMemo, useState } from "react";
import Table from "../../../Shared/Table";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Loader from "../../../Shared/Loader";

type InformationData = {
  name: string;
  patientId: string;
  age: number;
  gender: string;
  phone: string;
  branch: string;
  occupation: string;
  viewMore: string;
  id: number;
};

type Columns = {
  key: keyof InformationData | "viewMore";
  label: string;
  render?: (value: any, patient: InformationData) => JSX.Element;
};

type InformationTableProps = {
  patients: {
    attributes: {
      first_name: string;
      last_name: string;
      age: number;
      gender: string;
      phone_number: string;
      branch: string;
      occupation: string;
      card_id: string;
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
  isLoading: boolean;
};

const InformationTable = ({
  patients,
  isLoading,
  pagination,
}: InformationTableProps) => {
  const navigate = useNavigate();
  const { getAllPatients } = usePatientStore();
  const [perPage, setPerPage] = useState(pagination?.per_page || 10);

  const formattedPatients = useMemo(
    () =>
      patients.map((patient) => ({
        name: `${patient.attributes.first_name} ${patient.attributes.last_name}`,
        patientId: patient.attributes.card_id,
        age: patient.attributes.age || 0,
        gender: patient.attributes.gender || "",
        phone: patient.attributes.phone_number || "",
        branch: patient.attributes.branch || "",
        occupation: patient.attributes.occupation || "",
        viewMore: "View More",
        id: patient.id,
      })),
    [patients]
  );

  const handleViewMore = (id: string) => {
    navigate(`/dashboard/patients/${id}`);
  };

  const handlePageChange = (page: number) => {
    // Call getAllPatients with the page number and perPage value
    getAllPatients(page.toString(), perPage.toString());
  };

  if (isLoading && !patients.length) return <Loader />;

  const columns: Columns[] = [
    {
      key: "name",
      label: "Name",
      render: (_, patient) => <div>{patient.name}</div>,
    },
    {
      key: "patientId",
      label: "Patient ID",
      render: (_, patient) => <div>{patient.patientId}</div>,
    },
    {
      key: "age",
      label: "Age",
      render: (_, patient) => <div>{patient.age}</div>,
    },
    {
      key: "gender",
      label: "Gender",
      render: (_, patient) => <div>{patient.gender}</div>,
    },
    {
      key: "phone",
      label: "Phone",
      render: (_, patient) => <div>{patient.phone}</div>,
    },
    {
      key: "branch",
      label: "Branch",
      render: (_, patient) => <div>{patient.branch}</div>,
    },
    {
      key: "occupation",
      label: "Occupation",
      render: (_, patient) => <div>{patient.occupation}</div>,
    },
    {
      key: "viewMore",
      label: "",
      render: (_, patient) => (
        <button
          className="text-primary font-medium"
          onClick={() => handleViewMore(patient.id.toString())}
        >
          View More
        </button>
      ),
    },
  ];

  return (
    <div className="w-full">
      <Table
        columns={columns}
        data={formattedPatients}
        rowKey="id"
        pagination={true}
        paginationData={pagination}
        loading={isLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default InformationTable;
