import Table from "../../Shared/Table";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { useNavigate } from "react-router-dom";

type Patient = {
  id: string;
  lastVisit: string;
  name: string;
  phone: string;
  gender: "Male" | "Female";
  patientid: string;
  branch: string;
  occupation: string;
  age: number;
  status: "Pending" | "Ongoing" | "Completed";
};

interface PatientTableProps {
  patients: Patient[];
}

const PatientTable = ({ patients }: PatientTableProps) => {
  const navigate = useNavigate();

  const details = (patientId: string) => {
    navigate(`/dashboard/appointments/${patientId}`);
  };

  const columns = [
    {
      key: "name" as keyof Patient,
      label: "Name",
      render: (_: any, patient: Patient) => (
        <span className="text-dark font-medium text-sm">{patient.name}</span>
      ),
    },
    {
      key: "patientid" as keyof Patient,
      label: "Patient ID",
      render: (_: any, patient: Patient) => (
        <span className="text-[#667085] text-sm">{patient.patientid}</span>
      ),
    },
    {
      key: "gender" as keyof Patient,
      label: "Gender",
      render: (_: any, patient: Patient) => (
        <span className="text-[#667085] text-sm">{patient.gender}</span>
      ),
    },
    {
      key: "phone" as keyof Patient,
      label: "Phone",
      render: (_: any, patient: Patient) => (
        <span className="text-[#667085] text-sm">
          {formatPhoneNumber(patient.phone)}
        </span>
      ),
    },
    {
      key: "occupation" as keyof Patient,
      label: "Occupation",
      render: (_: any, patient: Patient) => (
        <span className="text-[#667085] text-sm">{patient.occupation}</span>
      ),
    },
    {
      key: "status" as keyof Patient,
      label: "Status",
      render: (_: any, patient: Patient) => (
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            statusStyles[patient.status]
          }`}
        >
          {patient.status}
        </span>
      ),
    },
    {
      key: "id" as keyof Patient,
      label: "",
      render: (_: any, data: Patient) => (
        <button
          className="cursor-pointer text-[#009952] text-sm font-medium"
          onClick={() => details(data.id)}
        >
          View more
        </button>
      ),
    },
  ];

  const statusStyles: Record<Patient["status"], string> = {
    Ongoing: "bg-[#FFEBAA] text-[#B58A00]",
    Completed: "bg-[#CFFFE9] text-[#009952]",
    Pending: "bg-[#FBE1E1] text-[#F83E41]",
  };

  return (
    <div className="w-full h-full bg-white">
      <Table
        data={patients}
        columns={columns}
        rowKey="id"
        pagination={patients.length > 10}
        rowsPerPage={10}
        radius="rounded-none"
      />
    </div>
  );
};

export default PatientTable;
