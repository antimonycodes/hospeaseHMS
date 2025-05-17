import { JSX, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../Shared/Loader";
import EditIcon from "../../../assets/EditIcon.png";
import Table from "../../../Shared/Table";
import EditPatientModal from "../../../Shared/EditPatientModal";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";

type FrondeskPatientData = {
  name: string;
  age: number;
  gender: string;
  phone: string;
  branch: string;
  occupation: string;
  editpatients: string;
  viewmore: string;
  card_id: string;
  id: string;
};

type Columns = {
  key: keyof FrondeskPatientData | "editpatients";
  label: string;
  render?: (value: any, patient: FrondeskPatientData) => JSX.Element;
};

type FrondeskPatientDataProps = {
  isLoading: boolean;
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
};

const FrontdeskInfo = ({
  patients,
  isLoading,
  pagination,
  baseEndpoint = "/admin/patient/fetch", // Default value
}: FrondeskPatientDataProps) => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { selectedPatient, getDeskByIdDoc, getAllPatients } = usePatientStore();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getDeskByIdDoc(id);
    }
  }, [id, getDeskByIdDoc]);

  const [perPage, setPerPage] = useState(pagination?.per_page || 10);

  const formattedPatients = patients.map((patient: any) => ({
    name: `${patient.attributes.first_name} ${patient.attributes.last_name}`,
    age: patient.attributes.age,
    gender: patient.attributes.gender,
    phone: patient.attributes.phone_number,
    branch: patient.attributes.branch,
    occupation: patient.attributes.occupation,
    editpatients: "editpatients",
    card_id: patient.attributes.card_id,
    viewmore: "viewmore",
    id: patient.id,
  }));

  const handleViewMore = (id: string) => {
    console.log("Navigating to patient ID:", id);
    navigate(`/dashboard/frontdesk/patient/${id}`); // Properly format your navigation path
  };

  const handlePageChange = (page: number) => {
    // Call getAllPatients with the page number, perPage value, and the current baseEndpoint
    getAllPatients(page.toString(), perPage.toString(), baseEndpoint);
  };

  if (isLoading) return <Loader />;

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
      key: "branch",
      label: "Branch",
      render: (_, patient) => (
        <span className="text-[#667085]">{patient.branch}</span>
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
      <EditPatientModal
        isLoading={isLoading}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        patientData={selectedPatient}
        onSave={function (data: any): void {
          throw new Error("Function not implemented.");
        }} // onSave={handleSavePatient}
      />
    </div>
  );
};

export default FrontdeskInfo;
