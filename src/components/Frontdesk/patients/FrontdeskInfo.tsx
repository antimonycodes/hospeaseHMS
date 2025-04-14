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
};

const FrontdeskInfo = ({ patients, isLoading }: FrondeskPatientDataProps) => {
  console.log(patients);
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { selectedPatient, getDeskByIdDoc } = usePatientStore();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getDeskByIdDoc(id);
    }
  }, [id, getDeskByIdDoc]);

  const formattedPatients = patients.map((patient: any) => ({
    name: `${patient.attributes.first_name} ${patient.attributes.last_name}`,
    // patientId: patient.attributes.card_id, // Convert ID to string if needed
    age: patient.attributes.age,
    gender: patient.attributes.gender,
    phone: patient.attributes.phone_number,
    branch: patient.attributes.branch,
    occupation: patient.attributes.occupation,
    editpatients: "editpatients",
    card_id: patient.attributes.card_id, // Add card_id property
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
      key: "editpatients",
      label: "",
      render: (_, patient) => (
        <span
          className="text-primary text-sm font-medium cursor-pointer"
          onClick={() => setIsEditModalOpen(true)}
        >
          <img src={EditIcon} alt="" />
        </span>
      ),
    },
  ];

  return (
    <div>
      {" "}
      <Table data={formattedPatients} columns={columns} rowKey="id" />
      <EditPatientModal
        isLoading={isLoading}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        patientData={selectedPatient}
      />
    </div>
  );
};

export default FrontdeskInfo;
