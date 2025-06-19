import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import { useReportStore } from "../../../store/super-admin/useReoprt";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import Loader from "../../../Shared/Loader";
import {
  FileText,
  StickyNote,
  Loader2,
  Check,
  Plus,
  Minus,
  ChevronLeft,
  Banknote,
} from "lucide-react";
import toast from "react-hot-toast";
import MedicalTimeline from "../../../Shared/MedicalTimeline";
import DoctorBillForm from "../DoctorBillForm";
import Button from "../../../Shared/Button";
import AdmitPatientModal from "../../../Shared/AdmitPatientModal";
import DoctorReportSystem from "../../Admission/DoctorReportSystem";

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
    <Link
      to="/dashboard/appointments"
      className="flex items-center text-gray-600"
    >
      <ChevronLeft />
      {label}
    </Link>
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

const formatTime = (time: string) => {
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
    case "medical-director":
      fetchEndpoint = "/medical-director/my-appointments";
      manageEndpoint = "/medical-director/manage-appointment";
      break;
    default:
      console.warn(`Unknown role: ${role}, using doctor endpoints as fallback`);
      fetchEndpoint = "/doctor/my-appointments";
      manageEndpoint = "/doctor/manage-appointment";
  }

  return { fetchEndpoint, manageEndpoint };
};

const DoctorAppointmentDetails = () => {
  const { id } = useParams();
  const {
    selectedAppointment,
    getAppointmentById,
    manageAppointment,
    isLoading,
  } = usePatientStore();

  const { getAllRoles, roles } = useGlobalStore();
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"note" | "report" | "bill">(
    "note"
  );
  const [note, setNote] = useState("");
  const [reportNote, setReportNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);

  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<
    {
      service_item_name: string;
      id: any;
      request_pharmacy_id: any;
      attributes: { amount?: any; name?: string };
      quantity: number;
    }[]
  >([]);
  const [labTestSearch, setLabTestSearch] = useState("");
  const [isLabSelectOpen, setIsLabSelectOpen] = useState(false);
  const [selectedLabTests, setSelectedLabTests] = useState<
    { id: number; name: string; amount: string; quantity: number }[]
  >([]);

  const timeOptions = generateTimeOptions();
  const { fetchEndpoint, manageEndpoint } = getEndpoints(role);

  // Load role and fetch initial data
  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "";
    setRole(storedRole);
    getAllRoles();
    // getPharmacyStocks();
    // getLaboratoryItems();
  }, [getAllRoles]);
  const patientId = useMemo(
    () => selectedAppointment?.attributes?.patient?.id?.toString(),
    [selectedAppointment]
  );

  // Fetch appointment data
  useEffect(() => {
    if (id && role) {
      getAppointmentById(id, fetchEndpoint);
    }
  }, [id, role, fetchEndpoint, getAppointmentById]);

  // Fetch reports and notes when appointment is approved
  // useEffect(() => {
  //   if (id && selectedAppointment?.attributes?.status === "accepted") {
  //     const patientId =
  //       selectedAppointment?.attributes?.patient?.id;
  //     if (patientId) {
  //       getAllReport(patientId);
  //       getMedicalNote(patientId, "doctor");
  //     }
  //   }
  // }, [selectedAppointment, id, getAllReport, getMedicalNote]);

  // Show temporary messages
  const showMessage = (type: string, message: string) => {
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
      const result = await manageAppointment(
        id,
        { status: "accepted" },
        manageEndpoint
      );
      if (result) {
        showMessage("success", "Appointment approved successfully");
        getAppointmentById(id, fetchEndpoint);
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
      const result = await manageAppointment(
        id,
        { status: "rejected", reason },
        manageEndpoint
      );
      if (result) {
        setReason("");
        setShowDeclineForm(false);
        showMessage("success", "Appointment declined successfully");
        getAppointmentById(id, fetchEndpoint);
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
      const payload = {
        status: "reschedule",
        reason: reason || undefined,
        reschedule_data: {
          date: selectedDate,
          time: selectedTime,
        },
      };
      const result = await manageAppointment(id, payload, manageEndpoint);
      if (result) {
        setSelectedDate("");
        setSelectedTime("");
        setReason("");
        setShowRescheduleForm(false);
        showMessage("success", "Appointment rescheduled successfully");
        getAppointmentById(id, fetchEndpoint);
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

  // Toggle form displays
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

  // Handle loading state
  if (!selectedAppointment) {
    return <Loader />;
  }

  const appointmentData = Array.isArray(selectedAppointment)
    ? selectedAppointment[0]
    : selectedAppointment;
  const attributes = appointmentData?.attributes || {};
  const status = attributes?.status || "pending";
  const patient = attributes?.patient?.attributes || {};
  const doctor = attributes?.doctor?.attributes || {};
  const nextOfKin =
    patient?.next_of_kin?.length > 0 ? patient.next_of_kin[0] : {};
  const formattedDate = formatDate(attributes?.date);
  const formattedTime = formatTime(attributes?.time);

  return (
    <div>
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
      <div className=" flex items-center justify-between mb-4">
        <BackButton label="Patients" />

        {patient.is_admitted !== true ? (
          <Button onClick={() => setIsAdmitModalOpen((prev) => !prev)}>
            Admit Patient
          </Button>
        ) : (
          <h1 className=" bg-primary p-2 rounded-full text-white">Admitted</h1>
        )}
      </div>
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
            { label: "Religion", value: "Christian" },
          ]}
        />
        <InfoRow
          columns="grid-cols-2 md:grid-cols-4"
          items={[
            { label: "Phone", value: patient?.phone_number },
            { label: "House Address", value: patient?.address },
          ]}
        />
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

      {/* Appointment Details */}
      {status !== "accepted" && (
        <div className="bg-white rounded-lg shadow-sm p-6 text-[#667085] mb-6">
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

      {/* Consultation Section */}
      {status === "accepted" &&
        selectedAppointment?.attributes?.patient?.id && (
          <DoctorReportSystem
            patientId={selectedAppointment?.attributes?.patient?.id}
          />
        )}

      {id && (
        <MedicalTimeline
          patientId={selectedAppointment?.attributes?.patient?.id}
          patient={patient}
          showDownloadCompleteButton={false}
        />
      )}

      {isAdmitModalOpen && (
        <AdmitPatientModal
          setIsAdmitModalOpen={setIsAdmitModalOpen}
          patientId={selectedAppointment?.attributes?.patient?.id}
        />
      )}
    </div>
  );
};

const departmentLabels: Record<string, string> = {
  pharmacist: "Pharmacy",
  laboratory: "Laboratory",
  nurse: "Nurse",
};

export default DoctorAppointmentDetails;
