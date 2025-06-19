import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  User,
  FileText,
  StickyNote,
  Download,
  Printer,
  Calendar,
  Clock,
  Loader2,
  Check,
  Plus,
  Minus,
  Banknote,
  X,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePatientStore } from "../../store/super-admin/usePatientStore";
import Button from "../../Shared/Button";
import EditPatientModal from "../../Shared/EditPatientModal";
import { useReportStore } from "../../store/super-admin/useReoprt";
import toast from "react-hot-toast";
import { useGlobalStore } from "../../store/super-admin/useGlobal";
import Loader from "../../Shared/Loader";
import MedicalTimeline from "../../Shared/MedicalTimeline";
import AdmitPatientModal from "../../Shared/AdmitPatientModal";
import Input from "../../Shared/Input";
import { useFinanceStore } from "../../store/staff/useFinanceStore";
import DoctorBillForm from "./DoctorBillForm";

export const CLINICAL_COMPLAINTS_GROUPED = [
  {
    category: "General Symptoms",
    complaints: [
      "Fever",
      "Chills",
      "Fatigue",
      "Night sweats",
      "Weight loss",
      "Weight gain",
      "Loss of appetite",
    ],
  },
  {
    category: "Pain & Discomfort",
    complaints: [
      "Headache",
      "Chest pain",
      "Abdominal pain",
      "Back pain",
      "Joint pain",
      "Muscle pain",
      "Earache",
      "Sore throat",
    ],
  },
  {
    category: "Respiratory",
    complaints: [
      "Cough",
      "Shortness of breath",
      "Wheezing",
      "Chest tightness",
      "Sputum production",
      "Snoring",
    ],
  },
  {
    category: "Cardiovascular",
    complaints: [
      "Palpitations",
      "Leg swelling",
      "Dizziness",
      "Syncope (fainting)",
      "Exercise intolerance",
    ],
  },
  {
    category: "Gastrointestinal",
    complaints: [
      "Nausea",
      "Vomiting",
      "Diarrhea",
      "Constipation",
      "Heartburn",
      "Difficulty swallowing",
      "Blood in stool",
    ],
  },
  {
    category: "Neurological",
    complaints: [
      "Memory problems",
      "Confusion",
      "Seizures",
      "Weakness",
      "Numbness",
      "Tingling",
      "Vision changes",
      "Speech difficulties",
    ],
  },
  {
    category: "Skin & Appearance",
    complaints: [
      "Rash",
      "Itching",
      "Skin lesions",
      "Hair loss",
      "Nail changes",
      "Excessive sweating",
      "Swelling",
    ],
  },
  {
    category: "Urinary",
    complaints: [
      "Frequent urination",
      "Painful urination",
      "Blood in urine",
      "Difficulty urinating",
      "Incontinence",
      "Kidney pain",
    ],
  },
  {
    category: "Reproductive",
    complaints: [
      "Irregular periods",
      "Heavy menstrual bleeding",
      "Pelvic pain",
      "Vaginal discharge",
      "Hot flashes",
      "Breast pain",
      "Erectile dysfunction",
      "Testicular pain",
    ],
  },
  {
    category: "Psychological",
    complaints: [
      "Anxiety",
      "Depression",
      "Sleep disturbances",
      "Mood changes",
      "Difficulty concentrating",
      "Panic attacks",
    ],
  },
];

const DoctorPatientDetails = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("note");
  const [note, setNote] = useState("");
  const [reportNote, setReportNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  // State for complaint durations
  const [complaintDurations, setComplaintDurations] = useState<{
    [key: string]: { value: number; unit: string };
  }>({});

  // State for lab modal
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);

  const [mergedData, setMergedData] = useState<
    Array<{
      date: string;
      reports: any[];
      notes: any[];
      isExpanded: boolean;
    }>
  >([]);

  const { id } = useParams();
  const { selectedPatient, getPatientByIdDoc } = usePatientStore();
  const {
    createReport,
    createNote,
    getAllReport,
    allReports,
    getMedicalNote,
    allNotes,
    isLoading,
    isCreating,
    getPharmacyStocks,
    pharmacyStocks,
    getLaboratoryItems,
    labItems,
  } = useReportStore();
  const { getAllRoles, roles } = useGlobalStore();
  const [itemSearch, setItemSearch] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<
    {
      requested_quantity: string | number | undefined;
      service_item_price: string;
      service_item_name: string;
      id: any;
      request_pharmacy_id: any;
      attributes: {
        amount?: any;
        name?: string;
      };
      quantity: number;
      item: {
        id: number;
        item: string;
      };
    }[]
  >([]);
  const [labTestSearch, setLabTestSearch] = useState("");
  const [isLabSelectOpen, setIsLabSelectOpen] = useState(false);
  const [selectedLabTests, setSelectedLabTests] = useState<
    {
      id: number;
      name: string;
      amount: string;
      quantity: number;
    }[]
  >([]);

  // State for prescription modal
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [prescriptionItems, setPrescriptionItems] = useState<{
    [key: string]: { dosage: string; quantity: number };
  }>({});

  // Calculate total cost
  const totalCost = selectedItems.reduce((total, item) => {
    const price = parseFloat(item.service_item_price) || 0;
    return total + price * item.quantity;
  }, 0);

  const handleAddComplaintWithDuration = (complaint: string) => {
    setSelectedComplaints((prev) => {
      if (prev.includes(complaint)) {
        const updated = prev.filter((c) => c !== complaint);
        const { [complaint]: _, ...restDurations } = complaintDurations;
        setComplaintDurations(restDurations);
        return updated;
      } else {
        setComplaintDurations((prevDurations) => ({
          ...prevDurations,
          [complaint]: { value: 1, unit: "days" },
        }));
        return [...prev, complaint];
      }
    });
  };

  // Handle duration change
  const handleDurationChange = (
    complaint: string,
    field: string,
    value: any
  ) => {
    setComplaintDurations((prev) => ({
      ...prev,
      [complaint]: {
        ...prev[complaint],
        [field]: value,
      },
    }));
  };

  // Option 1: Each complaint on its own line (Recommended)
  const addComplaintsToNote = () => {
    const complaintsText = selectedComplaints
      .map((complaint) => {
        const duration = complaintDurations[complaint];
        return duration
          ? `${complaint}: ${duration.value} ${duration.unit}`
          : `${complaint}: Not specified`;
      })
      .join("\n");

    const formattedComplaints = `PATIENT COMPLAINTS:\n${complaintsText}`;

    setNote((prev) =>
      prev ? `${prev}\n\n${formattedComplaints}` : formattedComplaints
    );
    setSelectedComplaints([]);
    setComplaintDurations({});
  };

  // Handle prescription change
  const handlePrescriptionChange = (id: string, field: string, value: any) => {
    setPrescriptionItems((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { dosage: "", quantity: 1 }),
        [field]: value,
      },
    }));
  };

  // Add prescription to report
  const addPrescriptionToReport = () => {
    let prescriptionText = "";

    selectedItems.forEach((item) => {
      const dosage =
        prescriptionItems[item.request_pharmacy_id]?.dosage ||
        "No dosage specified";
      prescriptionText += `- ${item.service_item_name}: ${dosage} (Qty: ${item.quantity})\n`;
    });

    if (prescriptionText) {
      // Remove existing prescription section if any
      let updatedNote = reportNote.replace(/\n\nPrescription:[\s\S]*?$/, "");

      // Add new prescription section
      setReportNote(`${updatedNote}\n\nPrescription:\n${prescriptionText}`);
    }

    setIsPrescriptionModalOpen(false);
  };

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
      setSelectedItems((prev) => [
        ...prev,
        {
          ...item,
          quantity: 1,
        },
      ]);
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
      setSelectedLabTests((prev) => [
        ...prev,
        {
          ...test,
          quantity: 1,
        },
      ]);
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

  useEffect(() => {
    getAllRoles();
    getPharmacyStocks();
    getLaboratoryItems();
  }, [getAllRoles, getPharmacyStocks, getLaboratoryItems]);

  console.log(id);
  useEffect(() => {
    if (id) {
      getPatientByIdDoc(id);
      getAllReport(id);
      getMedicalNote(id, "doctor");
    }
  }, [id, getPatientByIdDoc, getAllReport, getMedicalNote]);

  console.log(selectedPatient, "Select");

  const handleReportSubmit = async () => {
    if (!selectedDepartment) {
      toast.error("Please select a department");
      return;
    }

    const departmentId = roles[selectedDepartment]?.id;
    if (!departmentId) {
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
        patient_id: id,
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
        getAllReport(id);
      }
    } catch (error) {
      // Error handling is done in the toast already
    }
  };

  const handleNoteSubmit = async () => {
    if (!note.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    try {
      const response = await createNote({
        note: note,
        patient_id: id ?? "",
      });

      if (response) {
        setNote("");
        getMedicalNote(id, "doctor");
      }
    } catch (error) {
      // Error handling is done in the toast already
    }
  };

  const patient = selectedPatient?.attributes;
  const selectedPatientId = selectedPatient?.id;
  console.log(patient);

  if (!selectedPatient) return <Loader />;

  return (
    <div className="px-2 sm:px-0">
      <div className="bg-white rounded-lg custom-shadow mb-6">
        <div className="p-4 sm:p-6">
          <div className=" flex items-center justify-between">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
              <Link
                to="/dashboard/patients"
                className="flex items-center text-gray-600 hover:text-primary"
              >
                <ChevronLeft size={16} />
                <span className="ml-1">Patients</span>
              </Link>
            </div>
            {/*  */}
            {patient.is_admitted !== true ? (
              <Button onClick={() => setIsAdmitModalOpen((prev) => !prev)}>
                Admit Patient
              </Button>
            ) : (
              <h1 className=" bg-primary p-2 rounded-full text-white">
                Admitted
              </h1>
            )}
          </div>

          <div className="grid gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              <InfoRow label="First Name" value={patient.first_name} />
              <InfoRow label="Last Name" value={patient.last_name} />
              <InfoRow label="Patient ID" value={patient.card_id} />
              <InfoRow label="Age" value={patient.age?.toString()} />
              <InfoRow label="Gender" value={patient.gender} />
              <InfoRow label="Patient type" value={patient.patient_type} />
              <InfoRow
                label="CLinical Department"
                value={patient.clinical_department?.name}
              />
              <InfoRow label="Branch" value={patient.branch} />
              <InfoRow label="Occupation" value={patient.occupation} />
              <InfoRow label="Religion" value={patient.religion} />
              <InfoRow label="Phone" value={patient.phone_number} />
              <InfoRow
                className="sm:col-span-2 md:col-span-3 lg:col-span-4"
                label="Address"
                value={patient.address}
              />
            </div>
            <hr className="text-[#979797]" />
            <div className="">
              <div className="">
                <h3 className="text-sm font-medium text-gray-800 mb-4">
                  Next of Kin
                </h3>
                {patient.next_of_kin?.map((kin: any, index: any) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4"
                  >
                    <InfoRow label="First Name" value={kin.name} />
                    <InfoRow label="Last Name" value={kin.last_name} />
                    <InfoRow label="Gender" value={kin.gender} />
                    <InfoRow label="Occupation" value={kin.occupation} />
                    <InfoRow label="Phone" value={kin.phone} />
                    <InfoRow label="Relationship" value={kin.relationship} />
                    <InfoRow
                      className="sm:col-span-2 md:col-span-3 lg:col-span-4"
                      label="Address"
                      value={kin.address}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg custom-shadow mb-6 p-4 sm:p-6">
        <div className="flex flex-wrap gap-6 mb-4 text-sm font-medium text-[#667185]">
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
            <div>
              <h4 className="text-sm font-medium mb-2">Common Complaints</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {CLINICAL_COMPLAINTS_GROUPED.map((group) => (
                  <div
                    key={group.category}
                    className="bg-gray-50 p-3 rounded-lg"
                  >
                    <h5 className="font-medium text-gray-700 mb-2">
                      {group.category}
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {group.complaints.map((complaint) => {
                        const isSelected =
                          selectedComplaints.includes(complaint);
                        const duration = complaintDurations[complaint];

                        return (
                          <div
                            key={complaint}
                            className={`flex flex-col gap-1 ${
                              isSelected ? "bg-blue-50 p-1 rounded" : ""
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleAddComplaintWithDuration(complaint)
                              }
                              className={`px-3 py-1 text-sm rounded-full border transition ${
                                isSelected
                                  ? "bg-primary text-white border-primary"
                                  : "bg-white border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {complaint}
                            </button>

                            {isSelected && (
                              <div className="flex gap-1">
                                <input
                                  type="number"
                                  min="1"
                                  value={duration?.value || 1}
                                  onChange={(e) =>
                                    handleDurationChange(
                                      complaint,
                                      "value",
                                      parseInt(e.target.value) || 1
                                    )
                                  }
                                  className="w-12 border border-gray-300 rounded px-1 py-1 text-sm"
                                />
                                <select
                                  value={duration?.unit || "days"}
                                  onChange={(e) =>
                                    handleDurationChange(
                                      complaint,
                                      "unit",
                                      e.target.value
                                    )
                                  }
                                  className="border border-gray-300 rounded px-1 py-1 text-sm"
                                >
                                  <option value="hours">Hours</option>
                                  <option value="days">Days</option>
                                  <option value="weeks">Weeks</option>
                                  <option value="months">Months</option>
                                  <option value="years">Years</option>
                                </select>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* {selectedComplaints.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-700 mb-3">
                  Selected Complaints
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedComplaints.map((complaint) => (
                    <div key={complaint} className="flex items-center gap-2">
                      <span className="font-medium">{complaint}</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          value={complaintDurations[complaint]?.value || 1}
                          onChange={(e) =>
                            handleDurationChange(
                              complaint,
                              "value",
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-12 border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <select
                          value={complaintDurations[complaint]?.unit || "days"}
                          onChange={(e) =>
                            handleDurationChange(
                              complaint,
                              "unit",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            <textarea
              rows={5}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter doctor's note..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary"
            />

            <div className="flex gap-3">
              <button
                onClick={addComplaintsToNote}
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

            {activeTab === "report" && selectedDepartment === "laboratory" && (
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Laboratory Requests
                </h3>

                {/* Laboratory Test Selection (Existing Functionality) */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-sm text-gray-600">
                        Request laboratory tests for this patient
                      </h2>
                    </div>
                    <Button onClick={() => setIsLabModalOpen(true)}>
                      {selectedLabTests.length > 0
                        ? "Edit Lab Tests"
                        : "Add Lab Tests"}
                    </Button>
                  </div>

                  {selectedLabTests.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Selected Tests</h3>
                        <span className="font-bold text-primary">
                          Total: ₦
                          {selectedLabTests
                            .reduce(
                              (total, test) =>
                                total + parseFloat(test.amount) * test.quantity,
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </div>
                      <ul className="divide-y">
                        {selectedLabTests.map((test) => (
                          <li key={test.id} className="py-3">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">{test.name}</p>
                                <p className="text-sm text-gray-600">
                                  Quantity: {test.quantity}
                                </p>
                              </div>
                              <p className="font-medium text-primary">
                                ₦
                                {(
                                  parseFloat(test.amount) * test.quantity
                                ).toFixed(2)}
                              </p>
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

            {activeTab === "report" && selectedDepartment === "pharmacist" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h1 className="text-lg font-medium">
                      Pharmacy Prescription
                    </h1>
                    <h2 className="text-sm text-gray-600">
                      Create prescriptions for pharmacy items
                    </h2>
                  </div>
                  <Button onClick={() => setIsPrescriptionModalOpen(true)}>
                    {selectedItems.length > 0
                      ? "Edit Prescription"
                      : "Add Prescription"}
                  </Button>
                </div>

                {selectedItems.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Prescription Items</h3>
                      <span className="font-bold text-primary">
                        Total: ₦{totalCost.toFixed(2)}
                      </span>
                    </div>
                    <ul className="divide-y">
                      {selectedItems.map((item) => (
                        <li key={item.request_pharmacy_id} className="py-3">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">
                                {item.service_item_name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {prescriptionItems[item.request_pharmacy_id]
                                  ?.dosage || "No dosage specified"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                ₦{item.service_item_price} × {item.quantity}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Prescription Modal */}
            {isPrescriptionModalOpen && (
              <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">Create Prescription</h3>
                      <button
                        onClick={() => setIsPrescriptionModalOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex-1 overflow-auto">
                    <div className="mb-4">
                      <input
                        type="search"
                        placeholder="Search pharmacy items..."
                        value={itemSearch}
                        onChange={(e) => setItemSearch(e.target.value)}
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Available Items</h4>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <ul className="divide-y max-h-[300px] overflow-y-auto">
                            {filteredItems?.map((item) => (
                              <li
                                key={item.request_pharmacy_id}
                                className={`p-3 cursor-pointer hover:bg-blue-50 ${
                                  isItemSelected(item.request_pharmacy_id)
                                    ? "bg-blue-100"
                                    : ""
                                }`}
                                onClick={() => handleToggleItem(item)}
                              >
                                <div className="flex justify-between">
                                  <div>
                                    <p className="font-medium">
                                      {item.service_item_name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Available: {item.requested_quantity}
                                    </p>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium text-primary mr-2">
                                      ₦{item.service_item_price}
                                    </span>
                                    <div
                                      className={`w-5 h-5 rounded border flex items-center justify-center ${
                                        isItemSelected(item.request_pharmacy_id)
                                          ? "bg-primary border-primary"
                                          : "border-gray-300"
                                      }`}
                                    >
                                      {isItemSelected(
                                        item.request_pharmacy_id
                                      ) && (
                                        <Check className="h-4 w-4 text-white" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">
                          Prescription Details
                        </h4>
                        <div className="border border-gray-200 rounded-lg p-3 overflow-y-auto h-[400px]">
                          {selectedItems.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                              Select items to add to prescription
                            </p>
                          ) : (
                            <ul className="space-y-3">
                              {selectedItems.map((item) => (
                                <li
                                  key={item.request_pharmacy_id}
                                  className="border border-gray-200 rounded p-3"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium">
                                        {item.service_item_name}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        ₦{item.service_item_price} ×{" "}
                                        {item.quantity}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => handleToggleItem(item)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>

                                  <div className="mt-2">
                                    <label className="block text-sm font-medium mb-1">
                                      Dosage Instructions
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="e.g., 1 tablet twice daily"
                                      value={
                                        prescriptionItems[
                                          item.request_pharmacy_id
                                        ]?.dosage || ""
                                      }
                                      onChange={(e) =>
                                        handlePrescriptionChange(
                                          item.request_pharmacy_id,
                                          "dosage",
                                          e.target.value
                                        )
                                      }
                                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    />
                                  </div>

                                  <div className="mt-2 flex items-center gap-2">
                                    <label className="text-sm">Quantity:</label>
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.request_pharmacy_id,
                                          "decrease"
                                        )
                                      }
                                      className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                    <input
                                      type="number"
                                      min="1"
                                      max={item.requested_quantity}
                                      value={item.quantity}
                                      onChange={(e) =>
                                        handleQuantityInput(
                                          item.request_pharmacy_id,
                                          e.target.value
                                        )
                                      }
                                      className="w-12 text-center border border-gray-300 rounded-md px-1 py-1 text-sm"
                                    />
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.request_pharmacy_id,
                                          "increase"
                                        )
                                      }
                                      className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </button>
                                    <span className="text-sm text-gray-600 ml-1">
                                      of {item.requested_quantity}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                          {selectedItems.length > 0 && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                              <span className="font-medium">Total Cost:</span>
                              <span className="font-bold text-primary text-lg">
                                ₦{totalCost.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsPrescriptionModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={addPrescriptionToReport}>
                      Add to Report
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {/* Lab Test Modal */}
            {isLabModalOpen && (
              <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">
                        Select Laboratory Tests
                      </h3>
                      <button
                        onClick={() => setIsLabModalOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex-1 overflow-auto">
                    <div className="mb-4">
                      <input
                        type="search"
                        placeholder="Search laboratory tests..."
                        value={labTestSearch}
                        onChange={(e) => setLabTestSearch(e.target.value)}
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Available Tests</h4>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <ul className="divide-y max-h-[300px] overflow-y-auto">
                            {filteredLabTests?.map((test) => (
                              <li
                                key={test.id}
                                className={`p-3 cursor-pointer hover:bg-blue-50 ${
                                  isLabTestSelected(test.id)
                                    ? "bg-blue-100"
                                    : ""
                                }`}
                                onClick={() => handleToggleLabTest(test)}
                              >
                                <div className="flex justify-between">
                                  <div>
                                    <p className="font-medium">{test.name}</p>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium text-primary mr-2">
                                      ₦{test.amount}
                                    </span>
                                    <div
                                      className={`w-5 h-5 rounded border flex items-center justify-center ${
                                        isLabTestSelected(test.id)
                                          ? "bg-primary border-primary"
                                          : "border-gray-300"
                                      }`}
                                    >
                                      {isLabTestSelected(test.id) && (
                                        <Check className="h-4 w-4 text-white" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Selected Tests</h4>
                        <div className="border border-gray-200 rounded-lg p-3 overflow-y-auto h-[400px]">
                          {selectedLabTests.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                              No tests selected
                            </p>
                          ) : (
                            <ul className="space-y-3">
                              {selectedLabTests.map((test) => (
                                <li
                                  key={test.id}
                                  className="border border-gray-200 rounded p-3"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium">{test.name}</p>
                                      <p className="text-primary font-medium">
                                        ₦{test.amount}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => handleToggleLabTest(test)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>

                                  <div className="mt-2 flex items-center gap-2">
                                    <label className="text-sm">Quantity:</label>
                                    <button
                                      onClick={() =>
                                        setSelectedLabTests((prev) =>
                                          prev.map((t) =>
                                            t.id === test.id
                                              ? {
                                                  ...t,
                                                  quantity: Math.max(
                                                    1,
                                                    t.quantity - 1
                                                  ),
                                                }
                                              : t
                                          )
                                        )
                                      }
                                      className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                    <input
                                      type="number"
                                      min="1"
                                      value={test.quantity}
                                      onChange={(e) => {
                                        const value =
                                          parseInt(e.target.value) || 1;
                                        setSelectedLabTests((prev) =>
                                          prev.map((t) =>
                                            t.id === test.id
                                              ? {
                                                  ...t,
                                                  quantity: Math.max(1, value),
                                                }
                                              : t
                                          )
                                        );
                                      }}
                                      className="w-12 text-center border border-gray-300 rounded-md px-1 py-1 text-sm"
                                    />
                                    <button
                                      onClick={() =>
                                        setSelectedLabTests((prev) =>
                                          prev.map((t) =>
                                            t.id === test.id
                                              ? {
                                                  ...t,
                                                  quantity: t.quantity + 1,
                                                }
                                              : t
                                          )
                                        )
                                      }
                                      className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                          {selectedLabTests.length > 0 && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                              <span className="font-medium">Total:</span>
                              <span className="font-bold text-primary text-lg">
                                ₦
                                {selectedLabTests
                                  .reduce(
                                    (total, test) =>
                                      total +
                                      parseFloat(test.amount) * test.quantity,
                                    0
                                  )
                                  .toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsLabModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => setIsLabModalOpen(false)}>
                      Save Tests
                    </Button>
                  </div>
                </div>
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
          // <div>
          //   <div className="space-y-4 mb-4">
          //     <label htmlFor="">Description</label>
          //     <Input name="description" value="" onChange="" />
          //   </div>
          //   <div className="space-y-4 mb-4">
          //     <label htmlFor="">Amount</label>
          //     <Input name="amount" value="" onChange="" />
          //   </div>
          //   <div className=" flex justify-end">
          //     <Button>Add Doctor's Bill</Button>
          //   </div>{" "}
          // </div>
          <DoctorBillForm patient={patient} selectedPatient={selectedPatient} />
        )}
      </div>

      {id && (
        <MedicalTimeline
          patientId={id}
          patient={patient}
          showDownloadCompleteButton={false}
        />
      )}

      <EditPatientModal
        isLoading={false}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        patientData={patient}
        onSave={function (data: any): void {
          throw new Error("Function not implemented.");
        }}
      />

      {isAdmitModalOpen && (
        <AdmitPatientModal
          setIsAdmitModalOpen={setIsAdmitModalOpen}
          patientId={id ? Number(id) : 0}
        />
      )}
    </div>
  );
};

const InfoRow = ({ label, value, className = "" }: any) => (
  <div className={className}>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium">{value || "N/A"}</p>
  </div>
);

export default DoctorPatientDetails;

const departmentLabels: Record<string, string> = {
  pharmacist: "Pharmacy",
  laboratory: "Laboratory",
  nurse: "Nurse",
};
