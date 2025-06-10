import React, { useEffect, useState } from "react";
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

const COMMON_COMPLAINTS = [
  "Headache",
  "Fever",
  "Cough",
  "Sore throat",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Constipation",
  "Abdominal pain",
  "Chest pain",
  "Back pain",
  "Joint pain",
  "Fatigue",
  "Dizziness",
  "Shortness of breath",
  "Palpitations",
  "Rash",
  "Itching",
  "Swelling",
  "Weight loss",
  "Weight gain",
  "Loss of appetite",
  "Difficulty sleeping",
  "Anxiety",
  "Depression",
  "Memory problems",
  "Confusion",
  "Blurred vision",
  "Hearing loss",
  "Earache",
  "Runny nose",
  "Sneezing",
  "Muscle weakness",
  "Numbness",
  "Tingling",
  "Difficulty swallowing",
  "Frequent urination",
  "Painful urination",
  "Blood in urine",
  "Irregular periods",
  "Excessive bleeding",
  "Hot flashes",
  "Night sweats",
  "Chills",
];

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
  const {
    createReport,
    createNote,
    getAllReport,
    getMedicalNote,
    isCreating,
    getPharmacyStocks,
    pharmacyStocks,
    getLaboratoryItems,
    labItems,
  } = useReportStore();
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
    getPharmacyStocks();
    getLaboratoryItems();
  }, [getAllRoles, getPharmacyStocks, getLaboratoryItems]);

  // Fetch appointment data
  useEffect(() => {
    if (id && role) {
      getAppointmentById(id, fetchEndpoint);
    }
  }, [id, role, fetchEndpoint, getAppointmentById]);
  useEffect(() => {
    // Filter out any existing investigation section to avoid duplication
    const existingReport = reportNote.split("\n\nInvestigation:")[0].trim();

    // Only add investigation section if there are selected parameters
    const investigationSection =
      selectedParameters.length > 0
        ? `\n\nInvestigation:\n${selectedParameters.join("\n")}`
        : "";

    // Combine the existing report with the updated investigation section
    setReportNote(existingReport + investigationSection);
  }, [selectedParameters]);

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

  // Consultation logic
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    if (name === "itemSearch") {
      setItemSearch(value);
    } else if (name === "labTestSearch") {
      setLabTestSearch(value);
    }
  };

  const filteredItems = pharmacyStocks?.filter((stock) =>
    stock.service_item_name?.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const filteredLabTests = labItems?.filter((test) =>
    test.name?.toLowerCase().includes(labTestSearch.toLowerCase())
  );

  const handleToggleItem = (item: any) => {
    const exists = selectedItems.find(
      (i) => i.request_pharmacy_id === item.request_pharmacy_id
    );
    if (!exists) {
      setSelectedItems((prev) => [...prev, { ...item, quantity: 1 }]);
      toast.success(`Added ${item.service_item_name || "item"} to selection`);
    } else {
      setSelectedItems((prev) =>
        prev.filter((i) => i.request_pharmacy_id !== item.request_pharmacy_id)
      );
      toast.success(
        `Removed ${item.service_item_name || "item"} from selection`
      );
    }
  };

  const handleToggleLabTest = (test: any) => {
    const exists = selectedLabTests.find((t) => t.id === test.id);
    if (!exists) {
      setSelectedLabTests((prev) => [...prev, { ...test, quantity: 1 }]);
      toast.success(`Added ${test.name || "test"} to selection`);
    } else {
      setSelectedLabTests((prev) => prev.filter((t) => t.id !== test.id));
      toast.success(`Removed ${test.name || "test"} from selection`);
    }
  };

  const isItemSelected = (request_pharmacy_id: any) =>
    selectedItems.some(
      (item) => item.request_pharmacy_id === request_pharmacy_id
    );

  const isLabTestSelected = (id: any) =>
    selectedLabTests.some((test) => test.id === id);

  const handleQuantityChange = (
    request_pharmacy_id: any,
    action: "increase" | "decrease"
  ) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) => {
        if (item.request_pharmacy_id === request_pharmacy_id) {
          const stock = pharmacyStocks?.find(
            (s) => s.request_pharmacy_id === request_pharmacy_id
          );
          const maxAvailable = stock?.requested_quantity || 0;
          if (action === "increase") {
            return {
              ...item,
              quantity:
                item.quantity < maxAvailable
                  ? item.quantity + 1
                  : item.quantity,
            };
          } else {
            return {
              ...item,
              quantity: item.quantity > 1 ? item.quantity - 1 : 1,
            };
          }
        }
        return item;
      })
    );
  };

  const handleQuantityInput = (request_pharmacy_id: any, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    setSelectedItems((prevItems) =>
      prevItems.map((item) => {
        if (item.request_pharmacy_id === request_pharmacy_id) {
          const stock = pharmacyStocks?.find(
            (s) => s.request_pharmacy_id === request_pharmacy_id
          );
          const maxAvailable = stock?.quantity || 0;
          const quantity = Math.min(Math.max(1, numValue), maxAvailable);
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const handleReportSubmit = async () => {
    const patientId = selectedAppointment?.attributes?.patient?.id;
    if (!patientId) {
      toast.error("Patient ID is missing");
      return;
    }

    if (!selectedDepartment) {
      toast.error("Please select a department");
      return;
    }

    const departmentId = roles[selectedDepartment]?.id;
    if (!departmentId) {
      toast.error("Invalid department selected");
      return;
    }

    if (!reportNote.trim()) {
      toast.error("Report note cannot be empty");
      return;
    }

    try {
      type ReportData = {
        patient_id: any;
        note: string;
        department_id: number;
        parent_id: null;
        file: File | null;
        status: string;
        role: string;
        pharmacy_stocks?: { id: any; quantity: number }[];
        laboratory_service_charge?: { id: number; quantity: number }[];
      };

      let reportData: ReportData = {
        patient_id: patientId,
        note: reportNote, // Use the updated note with investigation
        department_id: departmentId,
        parent_id: null,
        file,
        status: "pending",
        role: selectedDepartment,
      };

      if (selectedDepartment === "pharmacist" && selectedItems.length > 0) {
        const pharmacyStocksArray = selectedItems.map((item) => ({
          id: item.request_pharmacy_id,
          quantity: item.quantity,
        }));
        reportData = { ...reportData, pharmacy_stocks: pharmacyStocksArray };
      }

      if (selectedDepartment === "laboratory" && selectedLabTests.length > 0) {
        const laboratoryTestsArray = selectedLabTests.map((test) => ({
          id: test.id,
          quantity: test.quantity,
        }));
        reportData = {
          ...reportData,
          laboratory_service_charge: laboratoryTestsArray,
        };
      }

      const response = await createReport(reportData);
      if (response) {
        setReportNote("");
        setFile(null);
        setSelectedDepartment("");
        setSelectedItems([]);
        setSelectedLabTests([]);
        setSelectedParameters([]); // Reset selected parameters
        setItemSearch("");
        setLabTestSearch("");
        getAllReport(patientId);
      }
    } catch (error) {
      toast.error("Failed to send report");
    }
  };

  const handleNoteSubmit = async () => {
    const patientId = selectedAppointment?.attributes?.patient?.id;
    if (!patientId) {
      toast.error("Patient ID is missing");
      return;
    }

    if (!note.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    try {
      const response = await createNote({
        note: note,
        patient_id: patientId,
      });
      if (response) {
        setNote("");
        getMedicalNote(patientId, "doctor");
        toast.success("Note added successfully");
      }
    } catch (error) {
      toast.error("Failed to add note");
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
  if (isLoading || !selectedAppointment) {
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
      {status === "accepted" && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-semibold mb-4">Consultation</h3>
          <div className="flex gap-6 mb-4 text-sm font-medium text-[#667185]">
            <button
              className={`flex items-center gap-1 px-3 py-1 rounded-md transition ${
                activeTab === "note"
                  ? "text-primary bg-[#F0F4FF]"
                  : "hover:text-primary"
              }`}
              onClick={() => setActiveTab("note")}
            >
              <StickyNote size={16} />
              Add Doctor's Note
            </button>
            <button
              className={`flex items-center gap-1 px-3 py-1 rounded-md transition ${
                activeTab === "report"
                  ? "text-primary bg-[#F0F4FF]"
                  : "hover:text-primary"
              }`}
              onClick={() => setActiveTab("report")}
            >
              <FileText size={16} />
              Add Doctor's Report
            </button>
            <button
              className={`flex items-center gap-1 px-3 py-1 rounded-md transition ${
                activeTab === "bill"
                  ? "text-primary bg-[#F0F4FF]"
                  : "hover:text-primary"
              }`}
              onClick={() => setActiveTab("bill")}
            >
              {/* <Bill /> */}
              <Banknote size={16} />
              {/* <BanknoteArrowDown /> */}
              Add Doctor's Bill
            </button>
          </div>
          {activeTab === "note" && (
            <div className="space-y-4">
              {/* Complaint selection */}
              <div>
                <h4 className="text-sm font-medium mb-2">Common Complaints</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {COMMON_COMPLAINTS.map((complaint) => (
                    <button
                      key={complaint}
                      type="button"
                      onClick={() => {
                        if (selectedComplaints.includes(complaint)) {
                          setSelectedComplaints(
                            selectedComplaints.filter((c) => c !== complaint)
                          );
                        } else {
                          setSelectedComplaints([
                            ...selectedComplaints,
                            complaint,
                          ]);
                        }
                      }}
                      className={`px-3 py-1 text-sm rounded-full border ${
                        selectedComplaints.includes(complaint)
                          ? "bg-primary text-white border-primary"
                          : "bg-white border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {complaint}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={5}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter doctor's note..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const complaintsText = selectedComplaints.join(", ");
                    setNote((prev) =>
                      prev
                        ? `${prev}\nComplaints: ${complaintsText}`
                        : `Complaints: ${complaintsText}`
                    );
                    setSelectedComplaints([]);
                  }}
                  disabled={selectedComplaints.length === 0}
                  className={`bg-gray-100 px-4 py-2 rounded-lg ${
                    selectedComplaints.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  }`}
                >
                  Add Complaints to Note
                </button>

                <button
                  onClick={handleNoteSubmit}
                  disabled={isCreating}
                  className={`bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition flex items-center justify-center
          ${isCreating ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isCreating ? (
                    <>
                      Adding
                      <Loader2 className="size-6 mr-2 animate-spin" />
                    </>
                  ) : (
                    <>Add note</>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "report" && (
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                {roles && Object.keys(roles).length > 0 ? (
                  <>
                    {roles["pharmacist"] && (
                      <button
                        type="button"
                        onClick={() => setSelectedDepartment("pharmacist")}
                        className={`px-4 py-2 rounded-lg transition ${
                          selectedDepartment === "pharmacist"
                            ? "bg-primary text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        Pharmacy
                      </button>
                    )}
                    {roles["laboratory"] && (
                      <button
                        type="button"
                        onClick={() => setSelectedDepartment("laboratory")}
                        className={`px-4 py-2 rounded-lg transition ${
                          selectedDepartment === "laboratory"
                            ? "bg-primary text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        Laboratory
                      </button>
                    )}
                    {roles["nurse"] && (
                      <button
                        type="button"
                        onClick={() => setSelectedDepartment("nurse")}
                        className={`px-4 py-2 rounded-lg transition ${
                          selectedDepartment === "nurse"
                            ? "bg-primary text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        Nurse
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading departments...
                  </div>
                )}
              </div>

              {selectedDepartment === "pharmacist" && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Pharmacy Store</h3>
                  <h4 className="text-sm text-gray-600 mb-4">
                    Check and select drugs from pharmacy for the patient here
                  </h4>
                  <div className="relative mb-4">
                    <div
                      className="border border-[#D0D5DD] rounded-lg p-3 flex items-center justify-between cursor-pointer"
                      onClick={() => setIsSelectOpen(!isSelectOpen)}
                    >
                      <div className="flex-1">
                        {selectedItems.length === 0 ? (
                          <span className="text-gray-500">Select items...</span>
                        ) : (
                          <span>{selectedItems.length} item(s) selected</span>
                        )}
                      </div>
                      <div
                        className={`transform transition-transform ${
                          isSelectOpen ? "rotate-180" : ""
                        }`}
                      >
                        <svg
                          width="12"
                          height="8"
                          viewBox="0 0 12 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 1L6 6L11 1"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                    {isSelectOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-[#D0D5DD] rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        <div className="p-2 sticky top-0 bg-white border-b border-[#D0D5DD]">
                          <input
                            type="search"
                            name="itemSearch"
                            value={itemSearch}
                            onChange={handleChange}
                            placeholder="Search items..."
                            className="w-full border border-[#D0D5DD] p-2 rounded outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <ul className="divide-y">
                          {filteredItems?.length > 0 ? (
                            filteredItems.map((item) => (
                              <li
                                key={item.request_pharmacy_id}
                                onClick={() => handleToggleItem(item)}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                              >
                                <div>
                                  <p className="font-medium">
                                    {item.service_item_name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Available: {item.requested_quantity}
                                  </p>
                                </div>
                                <div
                                  className={`w-5 h-5 rounded border flex items-center justify-center ${
                                    isItemSelected(item.request_pharmacy_id)
                                      ? "bg-blue-500 border-blue-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {isItemSelected(item.request_pharmacy_id) && (
                                    <Check className="h-4 w-4 text-white" />
                                  )}
                                </div>
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-3 text-gray-500">
                              No items found
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  {selectedItems.length > 0 && (
                    <div className="mt-4 border border-[#D0D5DD] rounded-lg p-4">
                      <h3 className="font-medium mb-3">Selected Items</h3>
                      <ul className="divide-y">
                        {selectedItems.map((item) => {
                          const stock = pharmacyStocks?.find(
                            (s) =>
                              s.request_pharmacy_id === item.request_pharmacy_id
                          );
                          const maxQuantity = stock?.requested_quantity || 0;
                          return (
                            <li
                              key={item.request_pharmacy_id}
                              className="py-3 flex items-center justify-between"
                            >
                              <div>
                                <p className="font-medium">
                                  {item.service_item_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {maxQuantity} available
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.request_pharmacy_id,
                                      "decrease"
                                    )
                                  }
                                  className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  max={maxQuantity}
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityInput(
                                      item.request_pharmacy_id,
                                      e.target.value
                                    )
                                  }
                                  className="w-12 text-center border border-gray-300 rounded-md p-1"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.request_pharmacy_id,
                                      "increase"
                                    )
                                  }
                                  className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                                  disabled={item.quantity >= maxQuantity}
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {selectedDepartment === "laboratory" && (
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Laboratory Requests
                  </h3>

                  {/* Laboratory Test Selection (Existing Functionality) */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-2">
                      Select Laboratory Tests
                    </h4>
                    <div className="relative mb-4">
                      <div
                        className="border border-[#D0D5DD] rounded-lg p-3 flex items-center justify-between cursor-pointer"
                        onClick={() => setIsLabSelectOpen(!isLabSelectOpen)}
                      >
                        <div className="flex-1">
                          {selectedLabTests.length === 0 ? (
                            <span className="text-gray-500">
                              Select tests...
                            </span>
                          ) : (
                            <span>
                              {selectedLabTests.length} test(s) selected
                            </span>
                          )}
                        </div>
                        <div
                          className={`transform transition-transform ${
                            isLabSelectOpen ? "rotate-180" : ""
                          }`}
                        >
                          <svg
                            width="12"
                            height="8"
                            viewBox="0 0 12 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1 1L6 6L11 1"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                      {isLabSelectOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-[#D0D5DD] rounded-lg shadow-lg max-h-64 overflow-y-auto">
                          <div className="p-2 sticky top-0 bg-white border-b border-[#D0D5DD]">
                            <input
                              type="search"
                              name="labTestSearch"
                              value={labTestSearch}
                              onChange={handleChange}
                              placeholder="Search tests..."
                              className="w-full border border-[#D0D5DD] p-2 rounded outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            />
                          </div>
                          <ul className="divide-y">
                            {filteredLabTests?.length > 0 ? (
                              filteredLabTests.map((test) => (
                                <li
                                  key={test.id}
                                  onClick={() => handleToggleLabTest(test)}
                                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                                >
                                  <div>
                                    <p className="font-medium">{test.name}</p>
                                  </div>
                                  <div
                                    className={`w-5 h-5 rounded border flex items-center justify-center ${
                                      isLabTestSelected(test.id)
                                        ? "bg-blue-500 border-blue-500"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {isLabTestSelected(test.id) && (
                                      <Check className="h-4 w-4 text-white" />
                                    )}
                                  </div>
                                </li>
                              ))
                            ) : (
                              <li className="px-4 py-3 text-gray-500">
                                No tests found
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    {selectedLabTests.length > 0 && (
                      <div className="mt-4 border border-[#D0D5DD] rounded-lg p-4 mb-6">
                        <h3 className="font-medium mb-3">Selected Tests</h3>
                        <ul className="divide-y">
                          {selectedLabTests.map((test) => (
                            <li
                              key={test.id}
                              className="py-3 flex items-center justify-between"
                            >
                              <div>
                                <p className="font-medium">{test.name}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-12 text-center border border-gray-300 rounded-md p-1">
                                  {test.quantity}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Rest of your existing code... */}
                </div>
              )}

              <textarea
                rows={5}
                value={reportNote}
                onChange={(e) => setReportNote(e.target.value)}
                placeholder="Enter doctor's report..."
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
                  ${
                    isCreating || !selectedDepartment
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                disabled={isCreating || !selectedDepartment}
              >
                {isCreating ? (
                  <>
                    Adding
                    <Loader2 className="size-6 mr-2 animate-spin" />
                  </>
                ) : (
                  `Send Report to ${
                    selectedDepartment
                      ? departmentLabels[selectedDepartment] || "..."
                      : "..."
                  }`
                )}
              </button>
            </div>
          )}
          {activeTab == "bill" && (
            <DoctorBillForm
              patient={patient}
              patientId={selectedAppointment?.attributes?.patient?.id}
            />
          )}
        </div>
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
