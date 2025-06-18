import { JSX } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../Shared/Table";

type DpatientsData = {
  id: any;
  name: string;
  patientId: string;
  age: number;
  gender: string;
  phone: string;
  branch: string;
  occupation: string;
  viewMore: string;
};

type Columns = {
  key: keyof DpatientsData | "viewMore";
  label: string;
  render?: (value: any, patient: DpatientsData) => JSX.Element;
};

type DpatientsDataProps = {
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
  getAllPatients: (page: string, perPage: string, endpoint?: string) => void;
};
const DpatientsInfo = ({
  patients,
  isLoading,
  pagination,
  baseEndpoint,
  getAllPatients,
}: DpatientsDataProps) => {
  console.log(patients);
  const navigate = useNavigate();

  const formattedPatients = patients.map((patient: any) => ({
    name: `${patient.attributes.first_name} ${patient.attributes.last_name}`,
    patientId: patient.attributes.card_id, // Convert ID to string if needed
    age: patient.attributes.age,
    gender: patient.attributes.gender,
    phone: patient.attributes.phone_number,
    branch: patient.attributes.branch,
    occupation: patient.attributes.occupation,
    viewMore: "View More",
    id: patient.id,
  }));
  const handleViewMore = (id: string) => {
    // console.log("Navigating to patient ID:", id);
    navigate(`/dashboard/doctor/patients/${id}`);
  };
  const handleRowClick = (patient: DpatientsData) => {
    // console.log("Navigating to patient ID:", patient.id);
    navigate(`/dashboard/doctor/patients/${patient.id}`);
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
      key: "patientId",
      label: "Patient ID",
      render: (_, patient) => (
        <span className="text-[#667085]">{patient.patientId}</span>
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
  const handlePageChange = (page: number) => {
    // Use the stored baseEndpoint for consistency when changing pages
    getAllPatients(page.toString(), "10", baseEndpoint);
  };

  return (
    <div>
      <Table
        data={formattedPatients}
        columns={columns}
        rowKey="patientId"
        pagination={true}
        paginationData={pagination}
        loading={isLoading}
        onPageChange={handlePageChange}
        clickableRows={true} // Enable clickable rows
        onRowClick={handleRowClick} // Handle row clicks
      />
    </div>
  );
};

export default DpatientsInfo;
