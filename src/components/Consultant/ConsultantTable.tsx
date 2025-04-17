import React, { useEffect, useState } from "react";
import { getUserColumns } from "../../Shared/UsersColumn";
import { useNavigate } from "react-router-dom";
import { useAppointmentStore } from "../../store/staff/useAppointmentStore";
// import FrontdeskAppointmentModal from "../Frontdesk/appointment/FrontdeskAppointmentModal";
import { getImageSrc } from "../../utils/imageUtils";
import Table from "../../Shared/Table";
import { usePatientStore } from "../../store/super-admin/usePatientStore";

interface Patient {
  id: number;
  name: string;
  patientId: string;
  gender: string;
  phone: string;
  occupation: string;
  doctor: string;
  status: "Pending" | "Completed" | undefined;
}

const tabs = ["Pending", "Completed"] as const;
type TabType = (typeof tabs)[number];

const getStatusCounts = (patients: Patient[]) => {
  return patients.reduce(
    (acc, patient) => {
      if (patient.status) {
        acc[patient.status]++;
      }
      return acc;
    },
    {
      Pending: 0,
      Completed: 0,
    }
  );
};

const ConsultantTable = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Pending");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getAllAppointments, appointments } = usePatientStore();

  const transformedPatients: Patient[] = appointments.map((item: any) => {
    const rawStatus = item.attributes.status?.toLowerCase() ?? "";
    let status: Patient["status"];

    switch (rawStatus) {
      case "pending":
        status = "Pending";
        break;
      case "completed":
        status = "Completed";
        break;
      default:
        status = undefined;
    }

    return {
      id: item.id,
      name: `${item.attributes.patient.attributes.first_name} ${item.attributes.patient.attributes.last_name}`,
      patientId: item.attributes.patient.attributes.card_id,
      gender: item.attributes.patient.attributes.gender ?? "N/A",
      phone: item.attributes.patient.attributes.phone_number,
      occupation: item.attributes.patient.attributes.occupation ?? "N/A",
      doctor: item.attributes.doctor?.attributes?.name ?? "N/A",
      status, // Use the mapped status
    };
  });

  const statusCounts = getStatusCounts(transformedPatients);

  useEffect(() => {
    getAllAppointments("/consultant/my-appointments");
  }, [getAllAppointments]);

  const navigate = useNavigate();

  const details = (id: string) => {
    navigate(`/dashboard/appointment/doctor/${id}`);
  };

  // Get all columns, including Status and View more
  const allColumns = getUserColumns(details, transformedPatients, true);
  // Filter out the "Doctor Assigned" column
  const columns = allColumns.filter(
    (column) => column.label !== "Doctor Assigned"
  );

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const filteredPatients =
    activeTab === "Pending"
      ? transformedPatients.filter((p) => p.status === "Pending")
      : transformedPatients.filter((p) => p.status === activeTab);

  return (
    <div className="w-full h-full bg-white rounded-[8px] shadow overflow-hidden">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-[18px] w-[160px] font-medium">
          Patients{" "}
          <span className="bg-[#F9F5FF] py-[2px] px-[8px] rounded-[16px] text-[#6941C6] font-medium text-[12px]">
            {transformedPatients.length}
          </span>
        </h1>

        <div className="flex w-full items-center gap-2 border border-gray-200 py-2 px-4 rounded-[10px] md:w-[70%]">
          <img src={getImageSrc("search.svg")} alt="" />
          <input
            type="search"
            placeholder="Type to search"
            className="outline-none font-medium placeholder:text-xs text-xs"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="cursor-pointer">
            <img src={getImageSrc("filter.svg")} alt="Filter" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 w-full flex space-x-2 md:space-x-6">
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
            {statusCounts[tab] > 0 && (
              <span className="text-xs bg-primary text-white py-0.5 px-3 rounded-xl">
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
      />
    </div>
  );
};

export default ConsultantTable;
