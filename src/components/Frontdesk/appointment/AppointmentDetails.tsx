import { JSX, useEffect, useState } from "react";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Table from "../../../Shared/Table";

interface AppointmentAttributes {
  doctor: string;
  status: string; // This is "pending", "approved", etc. from your API
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

const formatStatus = (
  status: string
): "Pending" | "Accepted" | "Declined" | "Rescheduled" => {
  const statusMap: Record<
    string,
    "Pending" | "Accepted" | "Declined" | "Rescheduled"
  > = {
    pending: "Pending",
    approved: "Accepted", // still keep for legacy
    accepted: "Accepted", // <-- add this
    rejected: "Declined",
    declined: "Declined", // optional fallback
    rescheduled: "Rescheduled",
    reschedule: "Rescheduled", // <-- add this
  };

  return statusMap[status.toLowerCase()] || "Pending";
};

const statusStyles: Record<string, string> = {
  Pending: "bg-[#FFEBAA] text-[#B58A00]",
  Accepted: "bg-[#CFFFE9] text-[#009952]",
  Declined: "bg-[#FBE1E1] text-[#F83E41]",
  Rescheduled: "bg-[#BED4FF] text-[#101828]",
};

const tabs = ["All", "Pending", "Accepted", "Declined", "Rescheduled"] as const;
type TabType = (typeof tabs)[number];

// Create a flattened type that includes both top-level properties and attributes properties
// This will allow us to use dot notation for accessing nested properties
type FlattenedAppointment = {
  id: number;
  type: string;
  // Add all attributes as direct properties
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
};

const AppointmentDetails = () => {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const { appointments, isLoading, getAllAppointments } = usePatientStore();

  useEffect(() => {
    getAllAppointments("/front-desk/appointment/all-records");
  }, [getAllAppointments]);

  // Function to flatten appointment data for table consumption
  const flattenAppointments = (
    data: AppointmentData[]
  ): FlattenedAppointment[] => {
    return data.map((appointment) => ({
      id: appointment.id,
      type: appointment.type,
      // Spread attributes properties to top level
      ...appointment.attributes,
    }));
  };

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
    {
      key: "doctor",
      label: "Doctor Assigned",
      render: (_, data) => (
        <span className="text-[#667085]">{data.doctor || "N/A"}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (_, data) => {
        const displayStatus = formatStatus(data.status);
        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[displayStatus]}`}
          >
            {displayStatus}
          </span>
        );
      },
    },
  ];

  const getStatusCounts = () => {
    if (!appointments || !appointments.length) {
      return {
        All: 0,
        Pending: 0,
        Accepted: 0,
        Declined: 0,
        Rescheduled: 0,
      } as Record<TabType, number>;
    }

    return appointments.reduce(
      (acc, appointment) => {
        const status = formatStatus(appointment.attributes.status);
        acc[status]++;
        acc.All++;
        return acc;
      },
      {
        All: 0,
        Pending: 0,
        Accepted: 0,
        Declined: 0,
        Rescheduled: 0,
      } as Record<TabType, number>
    );
  };

  const statusCounts = getStatusCounts();

  // Filter appointments based on selected tab
  const filteredAppointments =
    activeTab === "All"
      ? appointments || []
      : (appointments || []).filter(
          (a) => formatStatus(a.attributes.status) === activeTab
        );

  // Flatten the filtered appointments for the table
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
      {" "}
      <div className=" ">
        <div className="w-full bg-white flex space-x-2 md:space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-4 text-xs md:text-sm font-medium ${
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
            rowsPerPage={5}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentDetails;
