import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../Shared/Table";
type MedpatientData = {
  name: string;
  age: number;
  gender: string;
  phone: string;
  branch: string;
  occupation: string;
  viewMore: string;
  card_id: string;
  id: string;
};

type Columns = {
  key: keyof MedpatientData | "viewMore";
  label: string;
  render?: (value: any, patient: MedpatientData) => JSX.Element;
};

type MedpatientInfoProps = {
  isLoading?: boolean;
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
      address: string;
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
const MedpatientInfo = ({
  patients,
  isLoading,
  pagination,
  baseEndpoint,
  getAllPatients,
}: MedpatientInfoProps) => {
  console.log(patients);
  const [perPage, setPerPage] = useState(pagination?.per_page || 10);

  const navigate = useNavigate();

  const formattedPatients = patients.map((patient: any) => ({
    name: `${patient.attributes.first_name} ${patient.attributes.last_name}`,
    // patientId: patient.attributes.card_id, // Convert ID to string if needed
    age: patient.attributes.age,
    gender: patient.attributes.gender,
    phone: patient.attributes.phone_number,
    branch: patient.attributes.branch,
    occupation: patient.attributes.occupation,
    viewMore: "View More",
    card_id: patient.attributes.card_id, // Include card_id property
    id: patient.id,
  }));
  const handleViewMore = (id: string) => {
    console.log("Navigating to patient ID:", id);
    navigate(`/dashboard/medical/patients/${id}`);
  };

  const handlePageChange = (page: number) => {
    getAllPatients(page.toString(), perPage.toString(), baseEndpoint);
  };
  const columns: Columns[] = [
    {
      key: "name",
      label: "Name",
      render: (_, patient) => (
        <span className="font-medium text-[#101828]">{patient.name}</span>
      ),
    },
    {
      key: "card_id",
      label: "Patient ID",
      render: (_, patient) => (
        <span className="text-[#667085]">{patient.card_id}</span>
      ),
    },
    {
      key: "age",
      label: "Age",
      render: (_, patient) => (
        <span className="text-[#667085]">{patient.age}</span>
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
      key: "viewMore",
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

export default MedpatientInfo;
