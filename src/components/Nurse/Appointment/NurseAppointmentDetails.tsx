import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Loader from "../../../Shared/Loader";

// InfoRow reusable component
type InfoRowItem = {
  label: string;
  value: string | null | undefined;
};

const InfoRow: React.FC<{
  items: InfoRowItem[];
  columns?: string;
}> = ({ items, columns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" }) => (
  <div className={`grid gap-4 mb-4 ${columns}`}>
    {items.map(({ label, value }, i) => (
      <div key={i}>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-medium">{value || "-"}</p>
      </div>
    ))}
  </div>
);

// Back Button component
const BackButton = ({ label }: any) => (
  <div className="flex items-center mb-4">
    <button className="flex items-center text-gray-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-1"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
      {label}
    </button>
  </div>
);

// Helpers for date and time formatting
const getDaySuffix = (day: any) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const getMonthName = (month: number) =>
  [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][month];

const formatDate = (dateString: string | number | Date) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return `${date.getDate()}${getDaySuffix(date.getDate())} ${getMonthName(
      date.getMonth()
    )} ${date.getFullYear()}`;
  } catch {
    return dateString;
  }
};

const formatTime = (time: { split: (arg0: string) => [any, any] }) => {
  if (!time) return "-";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "pm" : "am";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes}${period}`;
};

const generateTimeOptions = () => {
  const times = [];
  const start = 7; // 7 AM
  const end = 19; // 7 PM

  for (let hour = start; hour <= end; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const hour12 = hour % 12 || 12;
      const ampm = hour < 12 ? "am" : "pm";
      const formatted = `${hour12.toString().padStart(2, "0")}:${min
        .toString()
        .padStart(2, "0")}${ampm}`;
      times.push(formatted);
    }
  }

  return times;
};

// Consistent endpoint generation
const getEndpoints = (role: string) => {
  // Normalize role to lowercase and trim
  const normalizedRole = (role || "").toLowerCase().trim();

  let fetchEndpoint = "";
  let manageEndpoint = "";

  switch (normalizedRole) {
    case "nurse":
      fetchEndpoint = "/nurses/my-appointments";
      manageEndpoint = "/nurses/manage-appointment";
      break;
    case "doctor":
      fetchEndpoint = "/doctor/my-appointments";
      manageEndpoint = "/doctor/manage-appointment";
      break;
    default:
      console.warn(`Unknown role: ${role}, using doctor endpoints as fallback`);
      fetchEndpoint = "/doctor/my-appointments";
      manageEndpoint = "/doctor/manage-appointment";
  }

  return { fetchEndpoint, manageEndpoint };
};

const NurseAppointmentDetails = () => {
  const { id } = useParams();
  const {
    selectedAppointment,
    getAppointmentById,
    manageAppointment,
    isLoading,
  } = usePatientStore();

  const [actionLoading, setActionLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const timeOptions = generateTimeOptions();

  // Get endpoints based on role
  const { fetchEndpoint, manageEndpoint } = getEndpoints(role);

  // Load role from localStorage on component mount
  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "";
    setRole(storedRole);
    console.log("Role loaded:", storedRole);
  }, []);

  // Fetch appointment data when ID and role are available
  useEffect(() => {
    if (id && role) {
      console.log(
        `Fetching appointment ${id} using endpoint: ${fetchEndpoint}`
      );
      getAppointmentById(id, fetchEndpoint);
    }
  }, [id, role, fetchEndpoint, getAppointmentById]);

  // Show temporary messages
  const showMessage = (type: string, message: React.SetStateAction<string>) => {
    if (type === "error") {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 5000);
    } else {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  };

  // Handle approve action
  const handleApprove = async () => {
    if (!id) {
      showMessage("error", "Appointment ID is missing");
      return;
    }

    setActionLoading(true);

    try {
      console.log(
        `Approving appointment ${id} with endpoint: ${manageEndpoint}`
      );
      console.log("Payload:", { status: "accepted" });

      const result = await manageAppointment(
        id,
        { status: "accepted" },
        manageEndpoint
      );

      if (result) {
        showMessage("success", "Appointment approved successfully");
      } else {
        showMessage("error", "Failed to approve appointment");
      }
    } catch (error) {
      console.error("Error approving appointment:", error);
      showMessage("error", "Error approving appointment");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle decline with reason
  const handleDecline = async () => {
    if (!id) {
      showMessage("error", "Appointment ID is missing");
      return;
    }

    if (!reason) {
      showMessage("error", "Please provide a reason for declining");
      return;
    }

    setActionLoading(true);

    try {
      console.log(
        `Declining appointment ${id} with endpoint: ${manageEndpoint}`
      );
      console.log("Payload:", { status: "rejected", reason });

      const result = await manageAppointment(
        id,
        { status: "rejected", reason },
        manageEndpoint
      );

      if (result) {
        setReason("");
        setShowDeclineForm(false);
        showMessage("success", "Appointment declined successfully");
      } else {
        showMessage("error", "Failed to decline appointment");
      }
    } catch (error) {
      console.error("Error declining appointment:", error);
      showMessage("error", "Error declining appointment");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reschedule
  const handleReschedule = async () => {
    if (!id) {
      showMessage("error", "Appointment ID is missing");
      return;
    }

    if (!selectedDate) {
      showMessage("error", "Please select a date");
      return;
    }

    if (!selectedTime) {
      showMessage("error", "Please select a time");
      return;
    }

    setActionLoading(true);

    try {
      console.log(
        `Rescheduling appointment ${id} with endpoint: ${manageEndpoint}`
      );
      const payload = {
        status: "reschedule",
        reason: reason || undefined,
        reschedule_data: {
          date: selectedDate,
          time: selectedTime,
        },
      };
      console.log("Payload:", payload);

      const result = await manageAppointment(id, payload, manageEndpoint);

      if (result) {
        setSelectedDate("");
        setSelectedTime("");
        setReason("");
        setShowRescheduleForm(false);
        showMessage("success", "Appointment rescheduled successfully");
      } else {
        showMessage("error", "Failed to reschedule appointment");
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      showMessage("error", "Error rescheduling appointment");
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle form displays - ensure only one is shown at a time
  const toggleDeclineForm = () => {
    setShowDeclineForm(!showDeclineForm);
    if (!showDeclineForm) {
      setShowRescheduleForm(false);
    }
  };

  const toggleRescheduleForm = () => {
    setShowRescheduleForm(!showRescheduleForm);
    if (!showRescheduleForm) {
      setShowDeclineForm(false);
    }
  };

  // Handle loading state and no appointment data
  if (isLoading || !selectedAppointment) {
    return <Loader />;
  }

  // Get the first appointment from the array if selectedAppointment is an array
  const appointmentData = Array.isArray(selectedAppointment)
    ? selectedAppointment[0]
    : selectedAppointment;

  // Extract the attributes from the selected appointment
  const attributes = appointmentData?.attributes || {};

  // Extract the status from attributes
  const status = attributes?.status || "pending";

  // Extract patient data, adding fallbacks
  const patient = attributes?.patient?.attributes || {};

  // Extract doctor data
  const doctor = attributes?.doctor?.attributes || {};

  // Extract next of kin data with fallback
  const nextOfKin =
    patient?.next_of_kin?.length > 0 ? patient.next_of_kin[0] : {};

  const formattedDate = formatDate(attributes?.date);
  const formattedTime = formatTime(attributes?.time);

  return (
    <div>
      <Link to="/dashboard/appointments">
        <BackButton label="Patients" />
      </Link>

      {/* Messages */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Patient Info */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <InfoRow
          items={[
            { label: "First Name", value: patient?.first_name },
            { label: "Last Name", value: patient?.last_name },
            { label: "Patient ID", value: patient?.card_id },
            { label: "Age", value: patient?.age },
          ]}
        />
        <InfoRow
          items={[
            { label: "Gender", value: patient?.gender },
            { label: "Branch", value: patient?.branch },
            { label: "Occupation", value: patient?.occupation },
            { label: "Religion", value: "Christian" }, // hardcoded
          ]}
        />
        <InfoRow
          columns="grid-cols-2 md:grid-cols-4"
          items={[
            { label: "Phone", value: patient?.phone_number },
            { label: "House Address", value: patient?.address },
          ]}
        />

        {/* Next of Kin - Only render if nextOfKin is available */}
        {nextOfKin && Object.keys(nextOfKin).length > 0 && (
          <>
            <hr className="my-6 border-gray-200" />
            <h3 className="font-semibold mb-4">Next of Kin</h3>
            <InfoRow
              items={[
                { label: "First Name", value: nextOfKin?.name },
                { label: "Last Name", value: nextOfKin?.last_name },
                { label: "Gender", value: nextOfKin?.gender },
                { label: "Occupation", value: nextOfKin?.occupation },
              ]}
            />
            <InfoRow
              items={[
                { label: "Religion", value: "Christian" },
                { label: "Phone", value: nextOfKin?.phone },
                {
                  label: "Relationship with Patient",
                  value: nextOfKin?.relationship,
                },
                { label: "House Address", value: nextOfKin?.address },
              ]}
            />
          </>
        )}
      </div>

      {/* Appointment Details - Only show if status is not accepted */}
      {status !== "accepted" && (
        <div className="bg-white rounded-lg shadow-sm p-6 text-[#667085]">
          <h3 className="font-semibold mb-4">Appointment Details</h3>
          <div className="mb-4">
            <p className="mb-1">Date: {String(formattedDate)}</p>
            <p>Time: {formattedTime}</p>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              className="bg-primary text-white px-6 py-2 rounded-lg"
              onClick={handleApprove}
              disabled={actionLoading}
            >
              {actionLoading ? "Processing..." : "Approve"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseAppointmentDetails;
