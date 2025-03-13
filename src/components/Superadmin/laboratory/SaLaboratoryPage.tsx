import { Search } from "lucide-react";
import { useState, JSX } from "react";
import Table from "../../../Shared/Table";

interface Patient {
  name: string;
  patientId: string;
  gender: string;
  phone: string;
  occupation: string;
  doctor: string;
  status: "Pending" | "Ongoing" | "Completed";
  viewMore: string;
}

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => JSX.Element;
}

const tabs = ["Pending", "Ongoing", "Completed"] as const;
type TabType = (typeof tabs)[number];

// **Calculate the count for each status**
const getStatusCounts = () => {
  return patients.reduce(
    (acc, patient) => {
      acc[patient.status]++;
      return acc;
    },
    { Pending: 0, Ongoing: 0, Completed: 0 }
  );
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
    viewMore: "View More",
  },
  {
    name: "John Diongoli",
    patientId: "0020602",
    gender: "Female",
    phone: "+234 802 987 8543",
    occupation: "Tailor",
    doctor: "Dr Mary Omisore",
    status: "Ongoing",
    viewMore: "View More",
  },
  {
    name: "Mary Durusaiye",
    patientId: "0030602",
    gender: "Male",
    phone: "+234 805 804 5130",
    occupation: "Farmer",
    doctor: "Dr Michael Saidu",
    status: "Completed",
    viewMore: "View More",
  },
  {
    name: "Martha Taribo",
    patientId: "0040602",
    gender: "Female",
    phone: "+234 803 800 1111",
    occupation: "Teacher",
    doctor: "Dr Andrew Oyeleke",
    status: "Pending",
    viewMore: "View More",
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
  {
    key: "viewMore",
    label: "",
    render: (_, data) => (
      <span
        className="text-primary text-sm font-medium cursor-pointer"
        // onClick={() => handleViewMore(data.patientId)}
      >
        View More
      </span>
    ),
  },
];

const statusStyles: Record<Patient["status"], string> = {
  Ongoing: "bg-[#FFEBAA] text-[#B58A00]",
  Completed: "bg-[#CFFFE9] text-[#009952]",
  Pending: "bg-[#FBE1E1] text-[#F83E41]",
};

const SaLaboratoryPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Pending");
  const statusCounts = getStatusCounts();

  const filteredPatients = patients.filter((p) => p.status === activeTab);

  return (
    <div className="rounded-lg custom-shadow bg-white p-4">
      {/* search and filter */}
      <div className=" flex items-center justify-between gap-8 lg:gap-24">
        <div className=" flex gap-2">
          {/* title */}
          <h1>Patient</h1>
          <span>3000</span>
        </div>
        {/* search input */}
        <div className="relative w-full flex-1">
          <input
            type="text"
            placeholder="Type to search"
            className="w-full border border-gray-200 py-2 pl-10 pr-4 rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] size-4" />
        </div>
      </div>
      {/* Tabs */}
      <div className=" w-full flex space-x-2 md:space-x-6 mt-4">
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
              <span className="  text-xs bg-primary text-white py-0.5 px-3 rounded-xl">
                {statusCounts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
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

export default SaLaboratoryPage;
