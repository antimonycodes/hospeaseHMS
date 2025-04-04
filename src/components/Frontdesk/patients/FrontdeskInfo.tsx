import { JSX, useState } from "react";
import Table from "../../../Shared/Table";
import { useNavigate } from "react-router-dom";
import Loader from "../../../Shared/Loader";
import EditIcon from "../../../assets/EditIcon.png";
type FrondeskPatientData = {
  name: string;
  patientId: string;
  age: number;
  gender: string;
  phone: string;
  branch: string;
  occupation: string;
  editpatients: string;
  id: string; // Added 'id' to match the rowKey
};

type Columns = {
  key: keyof FrondeskPatientData | "editpatients";
  label: string;
  render?: (value: any, patient: FrondeskPatientData) => JSX.Element;
};

type FrondeskPatientDataProps = {
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
      address: string;
    };
    id: number;
  }[];
};

const FrontdeskInfo = ({ patients, isLoading }: FrondeskPatientDataProps) => {
  console.log(patients);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  const formattedPatients = patients.map((patient: any) => ({
    name: `${patient.attributes.first_name} ${patient.attributes.last_name}`,
    patientId: patient.id.toString(), // Convert ID to string if needed
    age: patient.attributes.age,
    gender: patient.attributes.gender,
    phone: patient.attributes.phone_number,
    branch: patient.attributes.branch,
    occupation: patient.attributes.occupation,
    editpatients: "Editpatients",
    id: patient.id,
  }));
  const handleViewMore = (id: string) => {
    console.log("Navigating to patient ID:", id);
    navigate(` `);
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
      key: "editpatients",
      label: "",
      render: (_, patient) => (
        <span
          className="text-primary text-sm font-medium cursor-pointer"
          onClick={() => handleViewMore(patient.patientId)}
        >
          <img src={EditIcon} alt="" />
        </span>
      ),
    },
  ];

  return (
    <div>
      {" "}
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

export default FrontdeskInfo;
