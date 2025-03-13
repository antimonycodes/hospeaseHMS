import { useState, JSX } from "react";
import Table from "../../../Shared/Table";
import { getImageSrc } from "../../../utils/imageUtils";
import AddPatientModal from "../patients/AddPatientModal";
import FrontdeskAppointmentModal from "./FrontdeskAppointmentModal";
import { useNavigate } from "react-router-dom";

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

const patients: Patient[] = [
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

const FrondeskAppointmentTable = () => {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const statusCounts = getStatusCounts();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const details = (patientId: string) => {
    navigate(`/dashboard/appointments/${patientId}`);
  };

  // table content
  const columns: Column<Patient>[] = [
    {
      key: "name",
      label: "Name",
      render: (_, data) => (
        <span className="font-medium text-[#101828] text-sm">{data.name}</span>
      ),
    },
    {
      key: "patientId",
      label: "Patient ID",
      render: (_, data) => (
        <span className="text-[#667085] text-sm">{data.patientId}</span>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      render: (_, data) => (
        <span className="text-[#667085] text-sm">{data.gender}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (_, data) => (
        <span className="text-[#667085] text-sm">{data.phone}</span>
      ),
    },
    {
      key: "occupation",
      label: "Occupation",
      render: (_, data) => (
        <span className="text-[#667085] text-sm">{data.occupation}</span>
      ),
    },
    {
      key: "doctor",
      label: "Doctor Assigned",
      render: (_, data) => (
        <span className="text-[#667085] text-sm">{data.doctor}</span>
      ),
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
      key: "patientId",
      label: "",
      render: (_, data) => (
        <button
          className="cursor-pointer text-[#009952] text-sm font-medium"
          onClick={() => details(data.patientId)}
        >
          View more
        </button>
      ),
    },
  ];

  // Function to open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const filteredPatients =
    activeTab === "All"
      ? patients
      : patients.filter((p) => p.status === activeTab);
  return (
    <div className="w-full h-full bg-white rounded-[8px] shadow overflow-hidden">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-[18px] w-[160px] font-medium">
          Patients{" "}
          <span className="bg-[#F9F5FF] py-[2px] px-[8px] rounded-[16px] text-[#6941C6] font-medium text-[12px]">
            {patients.length}
          </span>
        </h1>

        {/* search / filter / add button
         */}
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

            {/* add button */}
            <button
              onClick={openModal}
              className="min-w-[120px] flex items-center justify-center gap-2 cursor-pointer text-white text-sm bg-primary px-6 h-[40px] rounded-[8px]"
            >
              Book new appointment
              <img src={getImageSrc("plus.svg")} alt="" />
            </button>
          </div>
        </div>
      </div>

      {/* table tabs */}
      <div className=" px-4 w-full flex space-x-2 md:space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 flex items-center gap-2 text-xs md:text-sm font-medium cursor-pointer ${
              activeTab === tab
                ? "text-green-600 border-b-2 border-green-600"
                : "text-[#667185]"
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

      <Table
        columns={columns}
        data={filteredPatients}
        rowKey="patientId"
        pagination={true}
        rowsPerPage={5}
      />

      {/* modal */}
      <FrontdeskAppointmentModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default FrondeskAppointmentTable;
