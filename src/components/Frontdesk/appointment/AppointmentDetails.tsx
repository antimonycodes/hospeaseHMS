import { JSX } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../Shared/Table";

// Define the structure of appointment data from the API
interface AppointmentFromAPI {
  id: number;
  attributes: {
    doctor: string;
    status?: string;
    rescheduled_data: string;
    doctor_contact: string;
    gender: string;
    patient_contact: string;
    occupation: string;
    patient: string;
    date: string;
    reason_if_rejected_or_rescheduled: string;
    assigned_by: string;
    time: string;
    created_at: string;
  };
}

// Define the structure for the formatted data used in the table
export type AppointmentData = {
  name: string;
  status?: string;

  gender: string;
  phone: string;

  occupation: string;
  viewMore: string;
  id: number;
  doctor: string;
};

type Columns = {
  key: keyof AppointmentData | "viewMore";
  label: string;
  render?: (value: any, appointment: AppointmentData) => JSX.Element;
};

type AppointmentDetailsProps = {
  isLoading?: boolean;
  appointments: AppointmentFromAPI[];
};

const AppointmentDetails = ({
  appointments = [],
  isLoading = false,
}: AppointmentDetailsProps) => {
  const navigate = useNavigate();

  // Handle case where appointments is undefined or not an array
  const appointmentsArray = Array.isArray(appointments) ? appointments : [];

  const formattedAppointments: AppointmentData[] = appointmentsArray.map(
    (appointment) => ({
      name: appointment.attributes?.patient || "",

      gender: appointment.attributes?.gender || "",
      phone: appointment.attributes?.patient_contact || "",
      occupation: appointment.attributes?.occupation || "",
      doctor: appointment.attributes?.doctor || "",
      status: appointment.attributes?.status || "",

      viewMore: "View More",
      id: appointment.id,
    })
  );

  const handleViewMore = (id: string) => {
    console.log("Navigating to patient ID:", id);
    navigate(`/dashboard/patients/${id}`);
  };

  const columns: Columns[] = [
    {
      key: "name",
      label: "Name",
      render: (_, appointment) => (
        <span className="font-medium text-[#101828]">{appointment.name}</span>
      ),
    },

    {
      key: "gender",
      label: "Gender",
      render: (_, appointment) => (
        <span className="text-[#667085]">{appointment.gender}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (_, appointment) => (
        <span className="text-[#667085]">{appointment.phone}</span>
      ),
    },
    {
      key: "occupation",
      label: "Occupation",
      render: (_, appointment) => (
        <span className="text-[#667085]">{appointment.occupation}</span>
      ),
    },
    {
      key: "doctor",
      label: "Doctor Assigned",
      render: (_, appointment) => (
        <span className="text-[#667085]">{appointment.doctor}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (_, appointment) => {
        let bgColor = "";
        let textColor = "";

        switch (appointment.status?.toLowerCase()) {
          case "pending":
            bgColor = "#FFEBAA";
            textColor = "#B58A00";
            break;
          case "declined":
            bgColor = "#FBE1E1";
            textColor = "#F83E41";
            break;
          case "rescheduled":
            bgColor = "#BED4FF";
            textColor = "#101828";
            break;
          case "accepted":
            bgColor = "#CFFFE9";
            textColor = "#009952";
            break;
          default:
            bgColor = "#E5E7EB"; // Default gray background
            textColor = "#374151"; // Default gray text
        }

        return (
          <span
            className="text-sm px-2 py-1 rounded-full"
            style={{
              backgroundColor: bgColor,
              color: textColor,
            }}
          >
            {appointment.status}
          </span>
        );
      },
    },

    {
      key: "viewMore",
      label: "",
      render: (_, appointment) => (
        <span
          className="text-primary text-sm font-medium cursor-pointer"
          onClick={() => handleViewMore(appointment.id.toString())}
        >
          View More
        </span>
      ),
    },
  ];

  if (isLoading) {
    return <div className="p-4 text-center">Loading appointments...</div>;
  }

  if (formattedAppointments.length === 0) {
    return <div className="p-4 text-center">No appointments found</div>;
  }

  return (
    <div>
      <Table
        data={formattedAppointments}
        columns={columns}
        rowKey="id"
        pagination={formattedAppointments.length > 10}
        rowsPerPage={10}
      />
    </div>
  );
};

export default AppointmentDetails;
