import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { useNavigate } from "react-router-dom";
import { JSX, useEffect } from "react";
import Table from "../../Shared/Table";
import { usePatientStore } from "../../store/super-admin/usePatientStore";
import Loader from "../../Shared/Loader";

type PatientTableData = {
  name: string;
  patientId: string;
  age: number;
  gender: string;
  phone: string;
  branch: string;
  occupation: string;
  viewMore: string;
  status: string;
  id: number;
};

type Columns = {
  key: keyof PatientTableData | "viewMore";
  label: string;
  render?: (value: any, patient: PatientTableData) => JSX.Element;
};

type PatientTableProps = {
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
      status: string;
    };
    id: number;
  }[];
};

const PatientTable = ({ patients, isLoading }: PatientTableProps) => {
  const navigate = useNavigate();

  const formattedPatients: PatientTableData[] = patients.map((patient) => ({
    name: `${patient.attributes.first_name} ${patient.attributes.last_name}`,
    patientId: patient.id.toString(),
    age: patient.attributes.age,
    gender: patient.attributes.gender,
    phone: patient.attributes.phone_number,
    branch: patient.attributes.branch,
    occupation: patient.attributes.occupation,
    status: patient.attributes.status,
    viewMore: "View More",
    id: patient.id,
  }));

  const handleViewMore = (id: string) => {
    navigate(`/dashboard/medical/patients/${id}`);
  };

  const statusStyles: Record<PatientTableData["status"], string> = {
    Completed: "bg-[#CFFFE9] text-[#009952] px-2 py-1 rounded-full",
    Pending: "bg-[#FBE1E1] text-[#F83E41] px-2 py-1 rounded-full",
  };

  const columns: Columns[] = [
    {
      key: "name",
      label: "Name",
      render: (_, patient) => (
        <span className="text-dark font-medium text-sm">{patient.name}</span>
      ),
    },
    {
      key: "patientId",
      label: "Patient ID",
      render: (_, patient) => (
        <span className="text-[#667085] text-sm">{patient.patientId}</span>
      ),
    },
    {
      key: "age",
      label: "Age",
      render: (_, patient) => (
        <span className="text-[#667085] text-sm">{patient.age}</span>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      render: (_, patient) => (
        <span className="text-[#667085] text-sm">{patient.gender}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (_, patient) => (
        <span className="text-[#667085] text-sm">{patient.phone}</span>
      ),
    },
    {
      key: "branch",
      label: "Branch",
      render: (_, patient) => (
        <span className="text-[#667085] text-sm">{patient.branch}</span>
      ),
    },
    {
      key: "occupation",
      label: "Occupation",
      render: (_, patient) => (
        <span className="text-[#667085] text-sm">{patient.occupation}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (_, patient) => (
        <span className={`text-sm ${statusStyles[patient.status]}`}>
          {patient.status}
        </span>
      ),
    },
    {
      key: "viewMore",
      label: "",
      render: (_, patient) => (
        <button
          className="cursor-pointer text-[#009952] text-sm font-medium"
          onClick={() => handleViewMore(patient.patientId)}
        >
          View more
        </button>
      ),
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full h-full bg-white">
      <Table
        data={formattedPatients}
        columns={columns}
        rowKey="id"
        pagination={formattedPatients.length > 10}
        rowsPerPage={10}
        radius="rounded-none"
      />
    </div>
  );
};

export default PatientTable;
