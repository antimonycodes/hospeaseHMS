import { useState, JSX, useEffect, useMemo } from "react";
import Table from "../../../Shared/Table";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Loader from "../../../Shared/Loader";

// Define interfaces based on your API response
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
  reason_if_rejected_or_rescheduled: string | null;
  assigned_by: string;
  time: string;
  created_at: string;
}

interface AppointmentData {
  type: string;
  id: number;
  attributes: AppointmentAttributes;
}

// Use the same Column interface structure that your Table component expects
// Instead of defining a new Column interface, import it from your Table component
// For this solution, I'll use a type that matches what the Table component expects
// This is assuming your Table component expects a Column with keyof T as the key type
type TableColumn<T> = {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => JSX.Element;
};

// Map API status to UI status format and styles
const formatStatus = (
  status: string
): "Pending" | "Accepted" | "Declined" | "Rescheduled" => {
  const statusMap: Record<
    string,
    "Pending" | "Accepted" | "Declined" | "Rescheduled"
  > = {
    pending: "Pending",
    approved: "Accepted",
    rejected: "Declined",
    rescheduled: "Rescheduled",
  };

  return statusMap[status] || "Pending";
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
};

const AppointmentTable = () => {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const { appointments, isLoading, getAllAppointments } = usePatientStore();

  useEffect(() => {
    getAllAppointments();
  }, [getAllAppointments]);

  // Function to flatten appointment data for table consumption
  const flattenAppointments = useMemo(() => {
    return (data: AppointmentData[]): FlattenedAppointment[] => {
      return data.map((appointment) => ({
        id: appointment.id,
        type: appointment.type,
        // Spread attributes properties to top level
        patient: appointment.attributes.patient,
        doctor: appointment.attributes.doctor,
        status: appointment.attributes.status,
        gender: appointment.attributes.gender,
        patient_contact: appointment.attributes.patient_contact,
        occupation: appointment.attributes.occupation,
      }));
    };
  }, []);

  if (isLoading) return <Loader />;

  // Define columns for the flattened appointment data
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

  // Calculate status counts from API data
  const getStatusCounts = () => {
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
      ? appointments
      : appointments.filter(
          (a) => formatStatus(a.attributes.status) === activeTab
        );

  // Flatten the filtered appointments for the table
  const flattenedAppointments = flattenAppointments(filteredAppointments);

  return (
    <div className="mt-2">
      <div className="w-full flex space-x-2 md:space-x-6">
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
              <span className="text-xs bg-primary text-white py-0.5 px-3 rounded-xl ml-2">
                {statusCounts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {appointments.length === 0 ? (
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
  );
};

export default AppointmentTable;
