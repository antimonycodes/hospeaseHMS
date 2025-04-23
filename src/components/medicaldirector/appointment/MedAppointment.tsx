import React, { JSX, useEffect, useState } from "react";
import Table from "../../../Shared/Table";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Tablehead from "../../ReusablepatientD/Tablehead";
import { useNavigate } from "react-router-dom";

interface AppointmentAttributes {
  doctor: string;
  status: string;
  rescheduled_data: any | null;
  doctor_contact: string | null;
  gender: string;
  patient_contact: string;
  occupation: string;
  patient: string;
  date: string;
  time: string;
  reason_if_rejected_or_rescheduled: string | null;
  assigned_by: string;
  created_at: string;
}

interface AppointmentData {
  type: string;
  id: number;
  attributes: AppointmentAttributes;
}

type TableColumn<T> = {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => JSX.Element;
};

const formatStatus = (status: string): "New" | "Accepted" | "Completed" => {
  const statusMap: Record<string, "New" | "Accepted" | "Completed"> = {
    pending: "New",
    approved: "Accepted",
    accepted: "Accepted",
    rejected: "Completed",
    declined: "Completed",
    rescheduled: "New",
    reschedule: "New",
  };

  return statusMap[status.toLowerCase()] || "New";
};

// const statusStyles: Record<string, string> = {
//   New: "bg-[#FFEBAA] text-[#B58A00]", // Similar to Pending
//   Accepted: "bg-[#CFFFE9] text-[#009952]", // Kept from original
//   Completed: "bg-[#E6E6FA] text-[#483D8B]", // New style for Completed
// };

const tabs = ["New", "Accepted", "Completed"] as const;
type TabType = (typeof tabs)[number];

type FlattenedAppointment = {
  id: number;
  type: string;
  patient: string;
  doctor: string;
  status: string;
  gender: string;
  patient_contact: string;
  occupation: string;
  date: string;
  time: string;
  created_at: string;
  doctor_contact: string | null;
  rescheduled_data: any | null;
  reason_if_rejected_or_rescheduled: string | null;
  assigned_by: string;
  viewMore: string;
};

const MedAppointment = () => {
  const [activeTab, setActiveTab] = useState<TabType>("New");
  const { appointments, isLoading, getAllAppointments } = usePatientStore();
  const navigate = useNavigate();
  const baseEndpoint = "/medical-director/all-appointments";
  useEffect(() => {
    getAllAppointments("1", "10", baseEndpoint);
  }, [getAllAppointments]);

  const flattenAppointments = (
    data: AppointmentData[]
  ): FlattenedAppointment[] => {
    return data.map((appointment) => ({
      id: appointment.id,
      type: appointment.type,
      ...appointment.attributes,
      viewMore: "View More",
    }));
  };

  // const handleViewMore = (id: string) => {
  //   console.log("Navigating to appointment details for ID:", id);
  //   navigate(`/medical/appointment/${id}`);
  // };

  const columns: TableColumn<FlattenedAppointment>[] = [
    {
      key: "patient",
      label: "Name",
      render: (_, data) => (
        <span className="font-medium text-[#101828]">{data.patient}</span>
      ),
    },
    {
      key: "id",
      label: "Appointment ID",
      render: (_, data) => (
        <span className="text-[#667085]">
          #{data.id.toString().padStart(6, "0")}
        </span>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      render: (_, data) => (
        <span className="text-[#667085]">
          {data.gender
            ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1)
            : "N/A"}
        </span>
      ),
    },
    {
      key: "patient_contact",
      label: "Phone",
      render: (_, data) => (
        <span className="text-[#667085]">{data.patient_contact || "N/A"}</span>
      ),
    },
    {
      key: "occupation",
      label: "Occupation",
      render: (_, data) => (
        <span className="text-[#667085]">{data.occupation || "N/A"}</span>
      ),
    },
    // {
    //   key: "status",
    //   label: "Status",
    //   render: (_, data) => {
    //     const displayStatus = formatStatus(data.status);
    //     return (
    //       <span
    //         className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[displayStatus]}`}
    //       >
    //         {displayStatus}
    //       </span>
    //     );
    //   },
    // },
    // {
    //   key: "viewMore",
    //   label: "",
    //   render: (_, data) => (
    //     <span
    //       className="text-primary text-sm font-medium cursor-pointer"
    //       onClick={() => handleViewMore(data.id.toString())}
    //     >
    //       View More
    //     </span>
    //   ),
    // },
  ];

  const getStatusCounts = () => {
    if (!appointments || !appointments.length) {
      return {
        New: 0,
        Accepted: 0,
        Completed: 0,
      } as Record<TabType, number>;
    }

    return appointments.reduce(
      (acc, appointment) => {
        const status = formatStatus(appointment.attributes.status);
        acc[status]++;
        return acc;
      },
      {
        New: 0,
        Accepted: 0,
        Completed: 0,
      } as Record<TabType, number>
    );
  };

  const statusCounts = getStatusCounts();

  const filteredAppointments = (appointments || []).filter(
    (a: AppointmentData) => formatStatus(a.attributes.status) === activeTab
  );

  const flattenedAppointments = flattenAppointments(filteredAppointments);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        Loading appointments...
      </div>
    );
  }

  return (
    <div>
      <div className="mt-2">
        <Tablehead tableTitle="Appointments" tableCount={appointments.length} />
        <div className="w-full bg-white flex space-x-2 md:space-x-6">
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
              <span
                className={`text-xs py-0.5 px-3 rounded-xl ml-2 ${
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {statusCounts[tab]}
              </span>
            </button>
          ))}
        </div>

        {flattenedAppointments.length === 0 ? (
          <div className="mt-10 text-center text-gray-500">
            No appointments found
          </div>
        ) : (
          <Table
            columns={columns}
            data={flattenedAppointments}
            rowKey="id"
            pagination={true}
          />
        )}
      </div>
    </div>
  );
};

export default MedAppointment;
