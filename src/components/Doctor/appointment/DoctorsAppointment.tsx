import { useNavigate } from "react-router-dom";
import Table from "../../../Shared/Table";
import { getUserColumns } from "../../../Shared/UsersColumn";
import { getImageSrc } from "../../../utils/imageUtils";
import FrontdeskAppointmentModal from "../../Frontdesk/appointment/FrontdeskAppointmentModal";
import { useState } from "react";

interface Patient {
  name: string;
  patientId: string;
  gender: string;
  phone: string;
  occupation: string;
  doctor: string;
  status: "Accepted" | "Completed";
}

const patients: Patient[] = [
  {
    name: "Philip Ikiriko",
    patientId: "0010602",
    gender: "Male",
    phone: "+234 709 823 2411",
    occupation: "Banker",
    doctor: "Dr Omogpe Peter",
    status: "Accepted",
  },
  {
    name: "John Diongoli",
    patientId: "0020602",
    gender: "Female",
    phone: "+234 802 987 8543",
    occupation: "Tailor",
    doctor: "Dr Mary Omisore",
    status: "Accepted",
  },
  {
    name: "Mary Durusaiye",
    patientId: "0030602",
    gender: "Male",
    phone: "+234 805 804 5130",
    occupation: "Farmer",
    doctor: "Dr Michael Saidu",
    status: "Completed",
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

const tabs = ["New", "Accepted", "Completed"] as const;
type TabType = (typeof tabs)[number];

// **Calculate the count for each status**
const getStatusCounts = () => {
  return patients.reduce(
    (acc, patient) => {
      acc[patient.status]++;
      acc.New++;
      return acc;
    },
    { New: 0, Accepted: 0, Completed: 0 }
  );
};
const DoctorsAppointment = () => {
  const [activeTab, setActiveTab] = useState<TabType>("New");
  const statusCounts = getStatusCounts();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const details = (patientId: string) => {
    navigate(`/dashboard/appointments/${patientId}`);
  };

  // Dynamically generate columns based on the data
  const columns = getUserColumns(details, patients, false);

  // Function to open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const filteredPatients =
    activeTab === "New"
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

export default DoctorsAppointment;
