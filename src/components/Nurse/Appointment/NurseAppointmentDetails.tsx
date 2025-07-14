import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Loader from "../../../Shared/Loader";
import MedicalTimeline from "../../../Shared/MedicalTimeline";
import { FileText, Loader2 } from "lucide-react";
import { useNurseStore } from "../../../store/super-admin/useNuseStore";
import { useReportStore } from "../../../store/super-admin/useReoprt";
import VitalSigns from "../../Admission/VitalSigns";
import { VitalsData } from "../patients/NurseDetail";
import TransferToDoc from "./TransferToDoc";
import Button from "../../../Shared/Button";

// Interfaces for type safety
interface Appointment {
  id: string;
  attributes: {
    date?: string;
    time?: string;
    status?: string;
    patient?: { id: string; attributes: PatientAttributes };
    doctor?: { attributes: any };
  };
}

interface PatientAttributes {
  id: string;
  first_name: string;
  last_name: string;
  card_id: string;
  age?: number;
  gender?: string;
  branch?: string;
  occupation?: string;
  phone_number?: string;
  address?: string;
  next_of_kin?: Array<{
    name: string;
    last_name: string;
    gender: string;
    occupation: string;
    phone: string;
    relationship: string;
    address: string;
  }>;
}

// InfoRow reusable component
type InfoRowItem = {
  label: string;
  value: string | null | undefined;
};
interface InfoRowProps {
  items: InfoRowItem[];
  columns?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
  items,
  columns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
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

// Back Button component
const BackButton = ({ label }: { label: string }) => (
  <div className="flex items-center mb-4">
    <Link
      to="/dashboard/appointments"
      className="flex items-center text-gray-600"
    >
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
    </Link>
  </div>
);

// Helpers for date and time formatting
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

const formatDate = (dateString: string | number | Date | undefined) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return `${date.getDate()}${getDaySuffix(date.getDate())} ${getMonthName(
      date.getMonth()
    )} ${date.getFullYear()}`;
  } catch {
    return "-";
  }
};

const formatTime = (time: string | null | undefined) => {
  if (!time || typeof time !== "string") return "-";
  const [hours, minutes] = time.split(":");
  if (!hours || !minutes) return "-";
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "pm" : "am";
  const formattedHour = hour % 12 || 12;
  const paddedMinutes = minutes.padStart(2, "0");
  return `${formattedHour}:${paddedMinutes}${period}`;
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
    default:
      console.warn(`Unknown role: ${role}, using doctor endpoints as fallback`);
      fetchEndpoint = "/doctor/my-appointments";
      manageEndpoint = "/doctor/manage-appointment";
  }

  return { fetchEndpoint, manageEndpoint };
};

const NurseAppointmentDetails = () => {
  const [openModal, setOpenModal] = useState(false);

  const { id } = useParams<{ id: string }>();
  const {
    selectedAppointment,
    getAppointmentById,
    manageAppointment,
    isLoading,
  } = usePatientStore();
  const { selectedPatient, getPatientById } = useNurseStore();
  const { deptCreateReport, isCreating, getAllReport } = useReportStore();
  const navigate = useNavigate();

  const [actionLoading, setActionLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [reportNote, setReportNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [departmentId, setDepartmentId] = useState<any>(null);

  useEffect(() => {
    const userInfoString = localStorage.getItem("user-info");
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        const id = userInfo?.attributes?.department?.id ?? null;
        setDepartmentId(id);
      } catch (error) {
        console.error("Error parsing user-info from localStorage:", error);
      }
    }
  }, []);
  // Add transfer success state
  const [transferSuccess, setTransferSuccess] = useState<any | null>(null);
  const [vitals, setVitals] = useState<VitalsData>({
    weight: "",
    height: "",
    bmi: "",
    systolic: "",
    diastolic: "",
    temperature: "",
    respiratoryRate: "",
    heartRate: "",
    urineOutput: "",
    bloodSugarF: "",
    bloodSugarR: "",
    spo2: "",
    avpu: "",
    trauma: "",
    mobility: "",
    oxygenSupplementation: "",
    intake: "",
    output: "",
    vitalTakenTime: "",
    comments: "",
  });

  const timeOptions = generateTimeOptions();
  const { fetchEndpoint, manageEndpoint } = getEndpoints(role);

  // Format vitals for report
  const formatVitalsForReport = () => {
    const vitalsEntries = Object.entries(vitals)
      .filter(([_, value]) => value.trim() !== "")
      .map(([key, value]) => {
        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())
          .replace(/Bmi/, "BMI")
          .replace(/Spo2/, "SPO2")
          .replace(/Avpu/, "AVPU");
        return `${label}: ${value}`;
      });
    return vitalsEntries.length > 0
      ? `PATIENT VITALS:\n${vitalsEntries.join("\n")}\n\n`
      : "";
  };

  // Update report note whenever vitals change
  useEffect(() => {
    const vitalsReport = formatVitalsForReport();
    setReportNote(vitalsReport);
  }, [vitals]);

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

  // Fetch patient data when appointment data is available

  // Extract appointment data with defensive checks
  const appointmentData = Array.isArray(selectedAppointment)
    ? selectedAppointment[0]
    : selectedAppointment;
  const attributes = appointmentData?.attributes || {};
  const status = attributes?.status || "pending";
  const patient = attributes?.patient?.attributes || {};
  const doctor = attributes?.doctor?.attributes || {};
  const nextOfKin =
    patient?.next_of_kin?.length > 0 ? patient.next_of_kin[0] : {};

  useEffect(() => {
    const patientId = appointmentData?.attributes?.patient?.id;
    if (patientId && !isNaN(parseInt(patientId))) {
      console.log("Fetching patient with ID:", patientId);
      getPatientById(parseInt(patientId)).catch((error) => {
        console.error("Error fetching patient:", error);
      });
    }
  }, [appointmentData?.attributes?.patient?.id, getPatientById]);

  // Show temporary messages
  const showMessage = (type: "error" | "success", message: string) => {
    if (type === "error") {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 5000);
    } else {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  };

  // Handle transfer success from modal
  const handleTransferSuccess = (successData: any) => {
    setTransferSuccess(successData);
    setOpenModal(false);
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
      const result = await manageAppointment(
        id,
        { status: "accepted" },
        manageEndpoint
      );
      if (result) {
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
      console.log(
        `Declining appointment ${id} with endpoint: ${manageEndpoint}`
      );
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

  // Toggle form displays
  const toggleDeclineForm = () => {
    setShowDeclineForm(!showDeclineForm);
    if (!showDeclineForm) setShowRescheduleForm(false);
  };

  const toggleRescheduleForm = () => {
    setShowRescheduleForm(!showRescheduleForm);
    if (!showRescheduleForm) setShowDeclineForm(false);
  };

  // Handle vitals input change
  const handleVitalsChange = (field: keyof VitalsData, value: string) => {
    setVitals((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "weight" || field === "height") {
      const updatedVitals = { ...vitals, [field]: value };
      const weight = parseFloat(updatedVitals.weight);
      const height = parseFloat(updatedVitals.height);
      if (weight > 0 && height > 0) {
        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
        setVitals((prev) => ({ ...prev, [field]: value, bmi }));
      }
    }
  };

  // Handle report submission
  const handleReportSubmit = async () => {
    const patientId = patient.id || selectedPatient?.id;
    if (!patientId) {
      showMessage("error", "Patient ID is missing");
      return;
    }
    const response = await deptCreateReport({
      patient_id: parseInt(patientId),
      note: reportNote,
      file: file,
      status: "completed",
      department_id: departmentId,
      role:"nurse"
    });
    if (response) {
      setReportNote("");
      setFile(null);
      setVitals({
        weight: "",
        height: "",
        bmi: "",
        systolic: "",
        diastolic: "",
        temperature: "",
        respiratoryRate: "",
        heartRate: "",
        urineOutput: "",
        bloodSugarF: "",
        bloodSugarR: "",
        spo2: "",
        avpu: "",
        trauma: "",
        mobility: "",
        oxygenSupplementation: "",
        intake: "",
        output: "",
        vitalTakenTime: "",
        comments: "",
      });
      await getAllReport(patientId);
      showMessage("success", "Report submitted successfully");
    } else {
      showMessage("error", "Failed to submit report");
    }
  };

  // Handle loading state
  if (isLoading || !selectedAppointment || !selectedPatient) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <BackButton label="Patients" />
      <Button onClick={() => setOpenModal(true)}>Transfer To doctor</Button>

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
            { label: "First Name", value: patient.first_name },
            { label: "Last Name", value: patient.last_name },
            { label: "Patient ID", value: patient.card_id },
            { label: "Age", value: patient.age?.toString() },
          ]}
        />
        <InfoRow
          items={[
            { label: "Gender", value: patient.gender },
            { label: "Branch", value: patient.branch },
            { label: "Occupation", value: patient.occupation },
            { label: "Religion", value: "Christian" },
          ]}
        />
        <InfoRow
          columns="grid-cols-2 md:grid-cols-4"
          items={[
            { label: "Phone", value: patient.phone_number },
            { label: "House Address", value: patient.address },
          ]}
        />
        {nextOfKin && Object.keys(nextOfKin).length > 0 && (
          <>
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
          </>
        )}
      </div>

      {/* Appointment Details */}
      {status !== "accepted" && (
        <div className="bg-white rounded-lg shadow-sm p-6 text-[#667085] mb-6">
          <h3 className="font-semibold mb-4">Appointment Details</h3>
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

      {/* Enhanced Vitals Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-lg custom-shadow mb-6 p-4 sm:p-6">
        <h3 className="col-span-full text-lg font-semibold mb-4">
          Patient Vitals
        </h3>

        {/* Basic Measurements */}
        <div className="flex flex-col gap-1">
          <label htmlFor="weight">Weight (KG)</label>
          <input
            type="number"
            id="weight"
            value={vitals.weight}
            onChange={(e) => handleVitalsChange("weight", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="70"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="height">Height (cm)</label>
          <input
            type="number"
            id="height"
            value={vitals.height}
            onChange={(e) => handleVitalsChange("height", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="170"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="bmi">BMI (kg/m²)</label>
          <input
            type="text"
            id="bmi"
            value={vitals.bmi}
            readOnly
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none bg-gray-50"
            placeholder="Auto-calculated"
          />
        </div>

        {/* Blood Pressure */}
        <div className="flex flex-col gap-1">
          <label htmlFor="systolic">Systolic B.P</label>
          <input
            type="number"
            id="systolic"
            value={vitals.systolic}
            onChange={(e) => handleVitalsChange("systolic", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="120"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="diastolic">Diastolic B.P</label>
          <input
            type="number"
            id="diastolic"
            value={vitals.diastolic}
            onChange={(e) => handleVitalsChange("diastolic", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="80"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="temperature">Temperature (°C)</label>
          <input
            type="number"
            step="0.1"
            id="temperature"
            value={vitals.temperature}
            onChange={(e) => handleVitalsChange("temperature", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="36.5"
          />
        </div>

        {/* Vital Signs */}
        <div className="flex flex-col gap-1">
          <label htmlFor="respiratoryRate">Respiratory Rate (/Min)</label>
          <input
            type="number"
            id="respiratoryRate"
            value={vitals.respiratoryRate}
            onChange={(e) =>
              handleVitalsChange("respiratoryRate", e.target.value)
            }
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="20"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="heartRate">Heart Rate (BPM)</label>
          <input
            type="number"
            id="heartRate"
            value={vitals.heartRate}
            onChange={(e) => handleVitalsChange("heartRate", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="72"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="urineOutput">Urine Output</label>
          <input
            type="text"
            id="urineOutput"
            value={vitals.urineOutput}
            onChange={(e) => handleVitalsChange("urineOutput", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="Normal"
          />
        </div>

        {/* Blood Sugar */}
        <div className="flex flex-col gap-1">
          <label htmlFor="bloodSugarF">Blood Sugar (F)</label>
          <input
            type="number"
            id="bloodSugarF"
            value={vitals.bloodSugarF}
            onChange={(e) => handleVitalsChange("bloodSugarF", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="80"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="bloodSugarR">Blood Sugar (R)</label>
          <input
            type="number"
            id="bloodSugarR"
            value={vitals.bloodSugarR}
            onChange={(e) => handleVitalsChange("bloodSugarR", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="120"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="spo2">SPO2 (%)</label>
          <input
            type="number"
            id="spo2"
            value={vitals.spo2}
            onChange={(e) => handleVitalsChange("spo2", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="98"
          />
        </div>

        {/* Assessment Fields */}
        <div className="flex flex-col gap-1">
          <label htmlFor="avpu">AVPU</label>
          <select
            id="avpu"
            value={vitals.avpu}
            onChange={(e) => handleVitalsChange("avpu", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select</option>
            <option value="Alert">Alert</option>
            <option value="Voice">Voice</option>
            <option value="Pain">Pain</option>
            <option value="Unresponsive">Unresponsive</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="trauma">Trauma</label>
          <select
            id="trauma"
            value={vitals.trauma}
            onChange={(e) => handleVitalsChange("trauma", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select</option>
            <option value="None">None</option>
            <option value="Minor">Minor</option>
            <option value="Major">Major</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="mobility">Mobility</label>
          <select
            id="mobility"
            value={vitals.mobility}
            onChange={(e) => handleVitalsChange("mobility", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select</option>
            <option value="Independent">Independent</option>
            <option value="Assisted">Assisted</option>
            <option value="Bed-bound">Bed-bound</option>
          </select>
        </div>

        {/* I/O and Support */}
        <div className="flex flex-col gap-1">
          <label htmlFor="oxygenSupplementation">Oxygen Supplementation</label>
          <select
            id="oxygenSupplementation"
            value={vitals.oxygenSupplementation}
            onChange={(e) =>
              handleVitalsChange("oxygenSupplementation", e.target.value)
            }
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select</option>
            <option value="None">None</option>
            <option value="Nasal Cannula">Nasal Cannula</option>
            <option value="Face Mask">Face Mask</option>
            <option value="Ventilator">Ventilator</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="intake">Intake (ml)</label>
          <input
            type="number"
            id="intake"
            value={vitals.intake}
            onChange={(e) => handleVitalsChange("intake", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="1500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="output">Output (ml)</label>
          <input
            type="number"
            id="output"
            value={vitals.output}
            onChange={(e) => handleVitalsChange("output", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="1200"
          />
        </div>

        <div className="col-span-full flex flex-col gap-1">
          <label htmlFor="comments">Comments</label>
          <textarea
            id="comments"
            rows={3}
            value={vitals.comments}
            onChange={(e) => handleVitalsChange("comments", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="Additional observations or notes..."
          />
        </div>
      </div>

      {/* Nurse Report */}
      <div className="bg-white rounded-lg custom-shadow mb-6 p-4 sm:p-6">
        <button className="flex mb-4 text-primary items-center gap-1 px-3 py-1 rounded-md transition">
          <FileText size={16} />
          Add Nurse's Report
        </button>
        <div className="space-y-4">
          <textarea
            rows={8}
            value={reportNote}
            onChange={(e) => setReportNote(e.target.value)}
            placeholder="Vitals will appear here automatically as you fill them above. Add additional notes if needed."
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
          />
          <button
            onClick={handleReportSubmit}
            className={`bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition flex items-center justify-center
              ${isCreating ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                Adding
                <Loader2 className="size-6 mr-2 animate-spin" />
              </>
            ) : (
              "Add Report"
            )}
          </button>
        </div>
      </div>

      <MedicalTimeline
        patientId={selectedPatient.id}
        patient={patient}
        showDownloadCompleteButton={false}
      />
      {openModal && (
        <TransferToDoc
          onClose={() => setOpenModal(false)}
          patient={selectedPatient}
          onTransferSuccess={handleTransferSuccess}
        />
      )}
    </div>
  );
};

export default NurseAppointmentDetails;
