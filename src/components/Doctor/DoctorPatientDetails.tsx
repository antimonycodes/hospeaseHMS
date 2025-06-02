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

// Laboratory investigation parameters
const LAB_PARAMETERS = [
  {
    name: "Hematology",
    parameters: [
      "Full Blood Count (FBC)",
      "Complete Blood Count (CBC)",
      "Hemoglobin (Hb)",
      "Hematocrit (HCT)",
      "White Blood Cell Count (WBC)",
      "Platelet Count",
      "ESR (Erythrocyte Sedimentation Rate)",
      "Bleeding Time",
      "Clotting Time",
      "Prothrombin Time (PT)",
      "Partial Thromboplastin Time (PTT)",
    ],
  },
  {
    name: "Biochemistry",
    parameters: [
      "Fasting Blood Sugar (FBS)",
      "Random Blood Sugar (RBS)",
      "HbA1c (Glycated Hemoglobin)",
      "Lipid Profile",
      "Total Cholesterol",
      "HDL Cholesterol",
      "LDL Cholesterol",
      "Triglycerides",
      "Liver Function Tests (LFTs)",
      "Kidney Function Tests (KFTs)",
      "Urea",
      "Creatinine",
      "Electrolytes (Na, K, Cl)",
      "Total Protein",
      "Albumin",
      "Bilirubin (Total & Direct)",
    ],
  },
  {
    name: "Immunology",
    parameters: [
      "HIV Screening",
      "Hepatitis B Surface Antigen (HBsAg)",
      "Hepatitis C Antibody",
      "Thyroid Function Tests (TFTs)",
      "TSH (Thyroid Stimulating Hormone)",
      "Free T3",
      "Free T4",
      "C-Reactive Protein (CRP)",
      "Rheumatoid Factor (RF)",
      "Anti-Nuclear Antibody (ANA)",
    ],
  },
  {
    name: "Microbiology",
    parameters: [
      "Urine Culture & Sensitivity",
      "Blood Culture",
      "Stool Culture",
      "Sputum Culture",
      "Wound Swab Culture",
      "Gram Stain",
      "AFB (Acid Fast Bacilli)",
      "Malaria Parasite (MP)",
      "Widal Test",
      "VDRL (Syphilis Test)",
    ],
  },
  {
    name: "Radiology",
    parameters: [
      "Chest X-Ray",
      "Abdominal X-Ray",
      "Pelvic X-Ray",
      "Ultrasound Abdomen",
      "Ultrasound Pelvis",
      "CT Scan Head",
      "CT Scan Chest",
      "CT Scan Abdomen",
      "MRI Brain",
      "Echocardiogram",
      "ECG (Electrocardiogram)",
    ],
  },
  {
    name: "Others",
    parameters: [
      "Urinalysis",
      "Stool Analysis",
      "Pregnancy Test",
      "Pap Smear",
      "Biopsy",
      "Endoscopy",
      "Colonoscopy",
      "Spirometry",
      "Audiometry",
    ],
  },
  // { name: "Malaria Test", parameters: ["RDT", "Microscopy"] },
  // { name: "HIV Test", parameters: ["Rapid Test", "ELISA", "Western Blot"] },
  // {
  //   name: "Hepatitis B",
  //   parameters: ["HBsAg", "Anti-HBs", "HBeAg", "Anti-HBe", "Anti-HBc"],
  // },
  // { name: "Hepatitis C", parameters: ["Anti-HCV", "HCV RNA"] },
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
  const [selectedItems, setSelectedItems] = useState<
    {
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

  const groupByDate = (data: any[]) => {
    return data.reduce((acc: { [key: string]: any[] }, item) => {
      const rawDate = new Date(item.attributes?.created_at);
      const date = rawDate.toLocaleDateString("en-CA");
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});
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
    if (allReports.length > 0 || allNotes.length > 0) {
      const processData = () => {
        const groupedReports = groupByDate(allReports);
        const groupedNotes = groupByDate(allNotes);

        const allDates = Array.from(
          new Set([
            ...Object.keys(groupedReports),
            ...Object.keys(groupedNotes),
          ])
        );

        return allDates
          .map((date) => ({
            date,
            reports: groupedReports[date] || [],
            notes: groupedNotes[date] || [],
            isExpanded: true,
          }))
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
      };

      setMergedData(processData());
    }
  }, [allReports, allNotes]);

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

  const toggleDateExpansion = (index: number) => {
    const updatedData = [...mergedData];
    updatedData[index].isExpanded = !updatedData[index].isExpanded;
    setMergedData(updatedData);
  };

  if (!selectedPatient) return <Loader />;

  const patient = selectedPatient.attributes;

  return (
    <div className="px-2 sm:px-0">
      <div className="bg-white rounded-lg custom-shadow mb-6">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
            <Link
              to="/dashboard/patients"
              className="flex items-center text-gray-600 hover:text-primary"
            >
              <ChevronLeft size={16} />
              <span className="ml-1">Patients</span>
            </Link>
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

            {activeTab === "report" && selectedDepartment === "pharmacist" && (
              <div>
                <h1 className="text-lg font-medium mb-2">Pharmacy Store</h1>
                <h2 className="text-sm text-gray-600 mb-4">
                  Check and select drugs from pharmacy for the patient here
                </h2>

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

            {activeTab === "report" && selectedDepartment === "laboratory" && (
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
                          <span className="text-gray-500">Select tests...</span>
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

                {/* Investigation Parameters */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">
                    Investigation Parameters
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Add specific parameters to investigate for each test
                  </p>

                  <div className="space-y-4">
                    {LAB_PARAMETERS.map((test) => (
                      <div key={test.name} className="border rounded-lg p-3">
                        <div className="font-medium mb-2">{test.name}</div>
                        <div className="flex flex-wrap gap-2">
                          {test.parameters.map((param) => {
                            const paramKey = `${test.name}: ${param}`;
                            const isSelected =
                              selectedParameters.includes(paramKey);

                            return (
                              <button
                                key={param}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedParameters((prev) =>
                                      prev.filter((p) => p !== paramKey)
                                    );
                                  } else {
                                    setSelectedParameters((prev) => [
                                      ...prev,
                                      paramKey,
                                    ]);
                                  }
                                }}
                                className={`px-3 py-1 text-sm rounded-full border transition ${
                                  isSelected
                                    ? "bg-primary text-white border-primary"
                                    : "border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {param}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
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
