import Table from "../../Shared/Table";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { useNavigate } from "react-router-dom";
import { Patient } from "../../data/patientsData";

interface PatientTableProps {
  patients: Patient[];
}

const PatientTable = ({ patients }: PatientTableProps) => {
  const navigate = useNavigate();

  const details = (patientId: string) => {
    navigate(`/dashboard/appointments/${patientId}`);
  };

  const statusStyles: Record<Patient["status"], string> = {
    Ongoing: "bg-[#FFEBAA] text-[#B58A00]",
    Completed: "bg-[#CFFFE9] text-[#009952]",
    Pending: "bg-[#FBE1E1] text-[#F83E41]",
  };

  // Explicitly define the type for columns
  const columns: {
    key: keyof Patient;
    label: string;
    render: (value: string | number, row: Patient) => React.ReactNode;
  }[] = [
    {
      key: "name",
      label: "Name",
      render: (value) => (
        <span className="text-dark font-medium text-sm">{value}</span>
      ),
    },
    {
      key: "patientid",
      label: "Patient ID",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (value) => (
        <span className="text-[#667085] text-sm">
          {formatPhoneNumber(value as string)}
        </span>
      ),
    },
    {
      key: "occupation",
      label: "Occupation",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            statusStyles[value as Patient["status"]]
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "id",
      label: "",
      render: (value, row) => (
        <button
          className="cursor-pointer text-[#009952] text-sm font-medium"
          onClick={() => details(row.id)}
        >
          View more
        </button>
      ),
    },
  ];

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
