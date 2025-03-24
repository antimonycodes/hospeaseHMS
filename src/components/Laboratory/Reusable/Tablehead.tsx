import Table from "../../../Shared/Table";
import { useState, JSX } from "react";
import { getImageSrc } from "../../../utils/imageUtils";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
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

// patient data
export const patients: Patient[] = [
  {
    id: "1",
    lastVisit: "01-01-2025",
    name: "Philip Ikiriko",
    phone: "+2348035839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 28,
    status: "Pending",
  },
  {
    id: "2",
    lastVisit: "01-01-2025",
    name: "Deborah Durojaiye",
    phone: "+2348025839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 34,
    status: "Pending",
  },
  {
    id: "3",
    lastVisit: "01-01-2025",
    name: "Victoria Ilesanmi",
    phone: "+2348055839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 22,
    status: "Ongoing",
  },
  {
    id: "4",
    lastVisit: "01-01-2025",
    name: "John Doe",
    phone: "+2348075839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 45,
    status: "Pending",
  },
  {
    id: "5",
    lastVisit: "01-01-2025",
    name: "Jane Smith",
    phone: "+2348095839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 30,
    status: "Ongoing",
  },
  {
    id: "6",
    lastVisit: "01-01-2025",
    name: "Michael Johnson",
    phone: "+2348105839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 50,
    status: "Ongoing",
  },
  {
    id: "7",
    lastVisit: "01-01-2025",
    name: "Sarah Brown",
    phone: "+2348115839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 27,
    status: "Pending",
  },
  {
    id: "8",
    lastVisit: "01-01-2025",
    name: "David Wilson",
    phone: "+2348125839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 33,
    status: "Pending",
  },
  {
    id: "9",
    lastVisit: "01-01-2025",
    name: "Laura Martinez",
    phone: "+2348135839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 29,
    status: "Completed",
  },
  {
    id: "10",
    lastVisit: "01-01-2025",
    name: "James Anderson",
    phone: "+2348145839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 40,
    status: "Completed",
  },
  {
    id: "11",
    lastVisit: "01-01-2025",
    name: "Emily Taylor",
    phone: "+2348155839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 35,
    status: "Completed",
  },
  {
    id: "12",
    lastVisit: "01-01-2025",
    name: "Daniel Thomas",
    phone: "+2348165839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 31,
    status: "Completed",
  },
  {
    id: "13",
    lastVisit: "01-01-2025",
    name: "Olivia Jackson",
    phone: "+2348175839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 26,
    status: "Pending",
  },
  {
    id: "14",
    lastVisit: "01-01-2025",
    name: "William White",
    phone: "+2348185839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 38,
    status: "Completed",
  },
  {
    id: "15",
    lastVisit: "01-01-2025",
    name: "Sophia Harris",
    phone: "+2348195839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 32,
    status: "Pending",
  },
  {
    id: "16",
    lastVisit: "01-01-2025",
    name: "Benjamin Clark",
    phone: "+2348205839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 41,
    status: "Pending",
  },
  {
    id: "17",
    lastVisit: "01-01-2025",
    name: "Ava Lewis",
    phone: "+2348215839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 28,
    status: "Pending",
  },
  {
    id: "18",
    lastVisit: "01-01-2025",
    name: "Henry Walker",
    phone: "+2348225839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 36,
    status: "Pending",
  },
  {
    id: "19",
    lastVisit: "01-01-2025",
    name: "Mia Hall",
    phone: "+2348235839499",
    gender: "Female",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 29,
    status: "Pending",
  },
  {
    id: "20",
    lastVisit: "01-01-2025",
    name: "Samuel Young",
    phone: "+2348245839499",
    gender: "Male",
    patientid: "0010602",
    branch: "Agodi",
    occupation: "Banker",
    age: 37,
    status: "Pending",
  },
];

const Tablehead = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Pending");
  const statusCounts = getStatusCounts();

  const filteredPatients = patients.filter((p) => p.status === activeTab);

  const navigate = useNavigate();

  const details = (patientId: string) => {
    navigate(`/dashboard/appointments/${patientId}`);
  };

  const columns: {
    key: keyof Patient;
    label: string;
    render?: (value: any, patient: Patient) => JSX.Element;
  }[] = [
    {
      key: "name",
      label: "Name",
      render: (_, patient) => (
        <span className=" text-dark font-medium text-sm">{patient.name}</span>
      ),
    },
    {
      key: "patientid",
      label: "Patient ID",
      render: (_, patient) => (
        <span className="text-[#667085] text-sm">{patient.patientid}</span>
      ),
    },

    {
      key: "gender",
      label: "Gender",
      render: (_, patient) => (
        <span className={`text-[#667085] text-sm`}>{patient.gender}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (_, patient) => (
        <span className="text-[#667085] text-sm">
          {formatPhoneNumber(patient.phone)}
        </span>
      ),
    },
    {
      key: "occupation",
      label: "Occupation",
      render: (_, patient) => (
        <span className={` text-[#667085] text-sm`}>{patient.occupation}</span>
      ),
    },
    {
      key: "status",
      label: "status",
      render: (_, patient) => (
        <span className={` text-[#667085] text-sm`}>{patient.status}</span>
      ),
    },
    {
      key: "id",
      label: "",
      render: (_, data) => (
        <button
          className="cursor-pointer text-[#009952] text-sm font-medium"
          onClick={() => details(data.id)}
        >
          View more
        </button>
      ),
    },
  ];

  return (
    <div className=" w-full font-inter h-full bg-white rounded-[8px] shadow overflow-hidden">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-[18px] w-[160px] font-medium">
          Patients{" "}
          <span className="bg-[#F9F5FF] py-[2px] px-[8px] rounded-[16px] text-[#6941C6] font-medium text-[12px]">
            3000
          </span>
        </h1>

        {/* search / filter / add button */}
        {/* search */}
        <div className="flex w-full items-center gap-2 border border-gray-200 py-2 px-4 rounded-[10px] md:w-[70%]">
          {/* icon */}
          <img src={getImageSrc("search.svg")} alt="" />
          {/* input */}
          <input
            type="search"
            name=""
            id=""
            placeholder="Type to search"
            className="outline-none font-medium placeholder:text-xs text-xs"
          />
        </div>
        <div className="flex items-center gap-4">
          {/* filter and add button */}
          <div className="flex items-center gap-4">
            {/* filter */}
            <button className="cursor-pointer">
              <img src={getImageSrc("filter.svg")} alt="" />
            </button>
          </div>
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
      {/* table */}
      <Table
        data={filteredPatients}
        columns={columns}
        rowKey="id"
        pagination={patients.length > 10}
        rowsPerPage={10}
        radius="rounded-none"
      />
    </div>
  );
};

export default Tablehead;
