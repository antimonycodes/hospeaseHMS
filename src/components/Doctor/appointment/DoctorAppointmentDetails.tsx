import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Loader from "../../../Shared/Loader";

// InfoRow reusable component
const InfoRow = ({
  items,
  columns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
}: {
  items: { label: string; value: string | number | undefined }[];
  columns?: string;
}) => (
  <div className={`grid gap-4 mb-4 ${columns}`}>
    {items.map(({ label, value }, i) => (
      <div key={i}>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-medium">{value || "-"}</p>
      </div>
    ))}
  </div>
);

const DoctorAppointmentDetails = () => {
  const { id } = useParams<{ id: string }>();
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

  const timeOptions = generateTimeOptions();

  const endpointManagent = (role: string) => {
    if (role === "nurse") return "/nurses/my-appointments";
    if (role === "doctor") return "/doctor/my-appointments";
    if (role === "medical-director")
      return "/medical-director/shift/user-records";
    return ""; // fallback
  };

  const manageEndpoint = (role: string) => {
    if (role === "nurse") return "/nurse/manage-appointment";
    if (role === "doctor") return "/doctor/manage-appointment";
    if (role === "medical-director")
      return "/medical-director/shift/user-records";
    return ""; // fallback
  };
  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "";
    setRole(storedRole);
  }, []);

  useEffect(() => {
    if (id && role) {
      const endpoint = endpointManagent(role);
      console.log("Using endpoint:", endpoint);
      getAppointmentById(id, endpoint);
    }
  }, [id, role, getAppointmentById]);

  // Handle approval directly without reason
  const handleApprove = async () => {
    if (!id) return;
    setActionLoading(true);

    try {
      await manageAppointment(id, manageEndpoint(role), {
        status: "accepted",
      });
    } catch (error) {
      console.error("Error approving appointment:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle decline with reason
  const handleDecline = async () => {
    if (!id || !reason) return;
    setActionLoading(true);

    try {
      const result = await manageAppointment(id, manageEndpoint(role), {
        status: "rejected",
        reason: reason,
      });

      if (result) {
        setReason("");
        setShowDeclineForm(false);
      }
    } catch (error) {
      console.error("Error declining appointment:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reschedule
  const handleReschedule = async () => {
    if (!id || !selectedDate || !selectedTime) return;
    setActionLoading(true);

    try {
      const result = await manageAppointment(id, manageEndpoint(role), {
        status: "reschedule",
        reason: reason || undefined,
        reschedule_data: {
          date: selectedDate,
          time: selectedTime,
        },
      });

      if (result) {
        setSelectedDate("");
        setSelectedTime("");
        setReason("");
        setShowRescheduleForm(false);
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
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

  if (isLoading || !selectedAppointment) {
    return <Loader />;
  }

  // FIX: Get the first appointment from the array if selectedAppointment is an array
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
    <div className="">
      <BackButton label="Patients" />

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
            <p className="mb-1">Date: {formattedDate}</p>
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
            <button
              className="bg-[#B20003] text-white px-6 py-2 rounded-lg"
              onClick={toggleDeclineForm}
              disabled={actionLoading}
            >
              {showDeclineForm ? "Cancel Decline" : "Decline"}
            </button>
            <button
              className="text-primary border border-primary px-6 py-2 rounded-lg"
              onClick={toggleRescheduleForm}
              disabled={actionLoading}
            >
              {showRescheduleForm
                ? "Cancel Reschedule"
                : "Reschedule Appointment"}
            </button>
          </div>

          {/* Decline Form */}
          {showDeclineForm && (
            <div className="w-full max-w-sm space-y-4 mb-6">
              <div>
                <label className="block mb-1 font-medium">
                  Reason for Declining
                </label>
                <textarea
                  className="w-full border rounded px-4 py-2"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide a reason for declining"
                  rows={3}
                  required
                />
              </div>
              <button
                className="bg-[#B20003] text-white px-6 py-2 rounded-lg"
                onClick={handleDecline}
                disabled={actionLoading || !reason}
              >
                {actionLoading ? "Processing..." : "Submit Decline"}
              </button>
            </div>
          )}

          {/* Reschedule Form */}
          {showRescheduleForm && (
            <div className="w-full max-w-sm space-y-4">
              <div>
                <label className="block mb-1 font-medium">Preferred Date</label>
                <input
                  type="date"
                  className="w-full border rounded px-4 py-2"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Preferred Time</label>
                <select
                  className="w-full border rounded px-4 py-2"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    -- Select Time --
                  </option>
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Reason (Optional)
                </label>
                <textarea
                  className="w-full border rounded px-4 py-2"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide a reason for rescheduling"
                  rows={3}
                />
              </div>
              <button
                className="mt-4 bg-primary text-white px-6 py-2 rounded-lg"
                onClick={handleReschedule}
                disabled={actionLoading || !selectedDate || !selectedTime}
              >
                {actionLoading ? "Processing..." : "Submit Reschedule"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Back Button
const BackButton = ({ label }: { label: string }) => (
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

// Helpers
const getDaySuffix = (day: number) => {
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

const formatDate = (dateString?: string) => {
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

const formatTime = (time?: string) => {
  if (!time) return "-";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "pm" : "am";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes}${period}`;
};

const generateTimeOptions = () => {
  const times = [];
  const start = 7; // 8 AM
  const end = 19; // 5 PM

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

export default DoctorAppointmentDetails;
