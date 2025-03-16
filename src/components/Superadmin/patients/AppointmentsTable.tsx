import { useState, JSX } from "react";
import Table from "../../../Shared/Table";

interface Patient {
  name: string;
  patientId: string;
  gender: string;
  phone: string;
  occupation: string;
  doctor: string;
  status: "Pending" | "Accepted" | "Declined" | "Rescheduled";
}

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => JSX.Element;
}

const statusStyles: Record<Patient["status"], string> = {
  Pending: "bg-[#FFEBAA] text-[#B58A00]",
  Accepted: "bg-[#CFFFE9] text-[#009952]",
  Declined: "bg-[#FBE1E1] text-[#F83E41]",
  Rescheduled: "bg-[#BED4FF] text-[#101828]",
};

export const patients: Patient[] = [
  {
    name: "Philip Ikiriko",
    patientId: "0010602",
    gender: "Male",
    phone: "+234 709 823 2411",
    occupation: "Banker",
    doctor: "Dr Omogpe Peter",
    status: "Pending",
  },
  {
    name: "John Diongoli",
    patientId: "0020602",
    gender: "Female",
    phone: "+234 802 987 8543",
    occupation: "Tailor",
    doctor: "Dr Mary Omisore",
    status: "Declined",
  },
  {
    name: "Mary Durusaiye",
    patientId: "0030602",
    gender: "Male",
    phone: "+234 805 804 5130",
    occupation: "Farmer",
    doctor: "Dr Michael Saidu",
    status: "Rescheduled",
  },
  {
    name: "Martha Taribo",
    patientId: "0040602",
    gender: "Female",
    phone: "+234 803 800 1111",
    occupation: "Teacher",
    doctor: "Dr Andrew Oyeleke",
    status: "Accepted",
  },
];

const columns: Column<Patient>[] = [
  {
    key: "name",
    label: "Name",
    render: (_, data) => (
      <span className="font-medium text-[#101828]">{data.name}</span>
    ),
  },
  {
    key: "patientId",
    label: "Patient ID",
    render: (_, data) => (
      <span className="text-[#667085]">{data.patientId}</span>
    ),
  },
  {
    key: "gender",
    label: "Gender",
    render: (_, data) => <span className="text-[#667085]">{data.gender}</span>,
  },
  {
    key: "phone",
    label: "Phone",
    render: (_, data) => <span className="text-[#667085]">{data.phone}</span>,
  },
  {
    key: "occupation",
    label: "Occupation",
    render: (_, data) => (
      <span className="text-[#667085]">{data.occupation}</span>
    ),
  },
  {
    key: "doctor",
    label: "Doctor Assigned",
    render: (_, data) => <span className="text-[#667085]">{data.doctor}</span>,
  },
  {
    key: "status",
    label: "Status",
    render: (status: Patient["status"]) => (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}
      >
        {status}
      </span>
    ),
  },
];

const tabs = ["All", "Pending", "Accepted", "Declined", "Rescheduled"] as const;
type TabType = (typeof tabs)[number];

// **Calculate the count for each status**
const getStatusCounts = () => {
  return patients.reduce(
    (acc, patient) => {
      acc[patient.status]++;
      acc.All++;
      return acc;
    },
    { All: 0, Pending: 0, Accepted: 0, Declined: 0, Rescheduled: 0 }
  );
};

const AppointmentTable = () => {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const statusCounts = getStatusCounts();

  const filteredPatients =
    activeTab === "All"
      ? patients
      : patients.filter((p) => p.status === activeTab);

  return (
    <div className=" mt-2">
      <div className=" w-full flex space-x-2 md:space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-xs md:text-sm font-medium ${
              activeTab === tab
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="  text-xs bg-primary text-white py-0.5 px-3 rounded-xl ml-2">
                {statusCounts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      <Table
        columns={columns}
        data={filteredPatients}
        rowKey="patientId"
        pagination={true}
        rowsPerPage={5}
      />
    </div>
  );
};

export default AppointmentTable;
