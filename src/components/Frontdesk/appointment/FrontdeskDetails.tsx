import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppointmentStore } from "../../../store/staff/useAppointmentStore";

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
const FrontdeskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedAppointment, getAppointmentById } = useAppointmentStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState("");
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const timeOptions = generateTimeOptions();

  useEffect(() => {
    if (id) {
      getAppointmentById(id)
        .then(() => setIsLoading(false))
        .catch((error) => {
          console.error("Error fetching appointment:", error);
          setIsLoading(false);
        });
    }
  }, [id, getAppointmentById]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const attributes = selectedAppointment.attributes || {};
  const patient = attributes.patient?.attributes || {};
  const appointment = attributes.appointment?.attributes || {};
  const nextOfKin =
    patient.next_of_kin && patient.next_of_kin.length > 0
      ? patient.next_of_kin[0]
      : {};

  const formattedDate = formatDate(attributes.date);
  const formattedTime = formatTime(attributes.time);

  return (
    <div className="">
      <BackButton label="Patients" />

      {/* Patient Info */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <InfoRow
          items={[
            { label: "First Name", value: patient.first_name },
            { label: "Last Name", value: patient.last_name },
            { label: "Patient ID", value: patient.card_id },
            { label: "Age", value: patient.age },
          ]}
        />
        <InfoRow
          items={[
            { label: "Gender", value: patient.gender },
            { label: "Branch", value: patient.branch },
            { label: "Occupation", value: patient.occupation },
            { label: "Religion", value: "Christian" }, // hardcoded
          ]}
        />
        <InfoRow
          columns="grid-cols-2 md:grid-cols-4"
          items={[
            { label: "Phone", value: patient.phone_number },
            { label: "House Address", value: patient.address },
          ]}
        />

        {/* Next of Kin */}
        <hr className="my-6 border-gray-200" />
        <h3 className="font-semibold mb-4">Next of Kin</h3>
        <InfoRow
          items={[
            { label: "First Name", value: nextOfKin.name },
            { label: "Last Name", value: nextOfKin.last_name },
            { label: "Gender", value: nextOfKin.gender },
            { label: "Occupation", value: nextOfKin.occupation },
          ]}
        />
        <InfoRow
          items={[
            { label: "Religion", value: "Christian" },
            { label: "Phone", value: nextOfKin.phone },
            {
              label: "Relationship with Patient",
              value: nextOfKin.relationship,
            },
            { label: "House Address", value: nextOfKin.address },
          ]}
        />
      </div>

      {/* Appointment Details */}
      <div className="bg-white rounded-lg shadow-sm p-6 text-[#667085]">
        <h3 className="font-semibold mb-4">Appointment Details</h3>
        <div className="mb-4">
          <p className="mb-1">Date: {formattedDate}</p>
          <p>Time: {formattedTime}</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button className="bg-primary text-white px-6 py-2 rounded-lg">
            Approve
          </button>
          <button className="bg-[#B20003] text-white px-6 py-2 rounded-lg">
            Decline
          </button>
          <button
            className="text-primary border border-primary px-6 py-2 rounded-lg"
            onClick={() => setShowRescheduleForm(!showRescheduleForm)}
          >
            {showRescheduleForm
              ? "Cancel Reschedule"
              : "Reschedule Appointment"}
          </button>
        </div>

        {/* Reschedule Form */}
        {showRescheduleForm && (
          <div className="w-full max-w-sm space-y-4">
            <div>
              <label className="block mb-1 font-medium">Preferred Date</label>
              <input type="date" className="w-full border rounded px-4 py-2" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Preferred Time</label>
              <select
                className="w-full border rounded px-4 py-2"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
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
            <button className="mt-4 bg-primary text-white px-6 py-2 rounded-lg">
              Submit Reschedule
            </button>
          </div>
        )}
      </div>
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

export default FrontdeskDetails;
