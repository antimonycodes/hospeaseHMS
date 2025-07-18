import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit2,
  X,
  Loader2,
  FileText,
  Plus,
  Check,
  Trash2,
  Minus,
} from "lucide-react";
import FluidBalance from "./FluidBalance";
import MedicationSheet from "./MedicationSheet";
import TPRSheet from "./TPRSheet";
import VitalSigns from "./VitalSigns";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmissionStore } from "../../store/super-admin/useAdmissionStore";
import Loader from "../../Shared/Loader";
import { useRole } from "../../hooks/useRole";
import MedicalTimeline from "../../Shared/MedicalTimeline";
import DoctorReportSystem from "./DoctorReportSystem";
import { useReportStore } from "../../store/super-admin/useReoprt";
import PatientDiagnosis from "../Doctor/diagnosis/PatientDiagnosis";
import toast from "react-hot-toast";

const AdmissionDetails: React.FC = () => {
  const [reportNote, setReportNote] = useState("");

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Medical timeline");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pharStatus, setPharStatus] = useState("");

  const {
    deptCreateReport,
    isCreating,
    getAllReport,
    getPharmacyStocks,
    pharmacyStocks,
  } = useReportStore();
  useEffect(() => {
    getPharmacyStocks();
  }, [getPharmacyStocks]);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const role = useRole();
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

  const {
    isLoading,
    currentAdmission,
    getAdmissionById,
    updateAdmissionStatus,
    dischargePatient,
    updateRecoveryStatus,
  } = useAdmissionStore();
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  // const [status, setStatus] = useState("In Progress");
  const [file, setFile] = useState<File | null>(null);
  // const [departmentId, setDepartmentId] = useState<any>(null);

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
  const [prescriptionItems, setPrescriptionItems] = useState<{
    [key: string]: { dosage: string; quantity: number };
  }>({});
  const [itemSearch, setItemSearch] = useState("");

  // Calculate total cost
  const totalCost = selectedItems.reduce((total, item) => {
    const price = parseFloat(item.service_item_price) || 0;
    return total + price * item.quantity;
  }, 0);

  const tabs = [
    "Medical timeline",
    "Fluid Balance",
    "Medications",
    "TPR",
    "Vital Signs",
  ];

  const statusOptions = [
    {
      name: "Critically ill",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      name: "Recovering",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      name: "Stable",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      name: "Under Observation",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      name: "Ready for Discharge",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
  ];

  useEffect(() => {
    if (id) {
      getAdmissionById(parseInt(id));
    }
  }, [id, getAdmissionById]);

  const handleStatusUpdate = async (newStatus: string) => {
    const data = {
      admission_id: id,
      status: newStatus,
    };
    if (id) {
      const success = await updateRecoveryStatus(data);
      if (success) {
        setShowStatusModal(false);
        getAdmissionById(parseInt(id));
      }
    }
  };

  const handleDischarge = async () => {
    const data = {
      admission_id: id,
      status: "discharged",
    };
    if (id) {
      const success = await dischargePatient(data);
      if (success) {
        setShowStatusModal(false);
      }
    }
  };

  const getCurrentStatusColor = () => {
    if (!currentAdmission) return "text-red-600";
    const status = statusOptions.find(
      (s) => s.name === currentAdmission.attributes.status
    );
    return status ? status.color : "text-red-600";
  };

  const Button: React.FC<{
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    onClick?: () => void;
    disabled?: boolean;
  }> = ({ children, variant = "primary", onClick, disabled = false }) => {
    const baseClasses =
      "px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses =
      variant === "primary"
        ? "bg-primary text-white hover:bg-green-700 disabled:hover:bg-primary"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100";

    return (
      <button
        className={`${baseClasses} ${variantClasses}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };

  if (isLoading && !currentAdmission) {
    return <Loader />;
  }

  if (!currentAdmission) {
    return;
  }

  const {
    patient,
    clinical_department,
    bed_number,
    diagnosis,
    status,
    recommended_by,
    recorded_by,
    created_at,
  } = currentAdmission.attributes;
  const nextOfKin = patient.attributes.next_of_kin[0] || {};

  const selectedP = patient.attributes;
  console.log(selectedP, "ert");

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

  // Filter pharmacy items
  const filteredItems = pharmacyStocks?.filter((stock) =>
    stock.service_item_name?.toLowerCase().includes(itemSearch.toLowerCase())
  );

  // Toggle item selection
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

  // Check if item is selected
  const isItemSelected = (request_pharmacy_id: any) =>
    selectedItems.some(
      (item) => item.request_pharmacy_id === request_pharmacy_id
    );

  // Handle quantity change
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

  // Handle quantity input
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

  // Add prescription to report (close modal)
  const addPrescriptionToReport = () => {
    setIsPrescriptionModalOpen(false);
    toast.success("Prescription items added to report");
  };

  const handleReportSubmit = async () => {
    const response = await deptCreateReport({
      patient_id: patient.id ?? null,
      note: reportNote,
      file: null,
      status: "completed",
      department_id: departmentId,
      role: "nurse",
    });
    if (response) {
      setReportNote("");

      await getAllReport(patient.id.toString());
    }
    console.log("Report submitted successfully:", response);
  };

  const handlePharmacyReportSubmit = async () => {
    setIsSubmitting(true);

    const reportData = {
      patient_id: patient.id ?? null,
      note: reportText.trim(),
      file,
      status: "completed",
      role: "pharmacist",
      department_id: departmentId,
      pharmacy_stocks: selectedItems.map((item) => ({
        id: item.request_pharmacy_id,
        quantity: item.quantity,
      })),
    };
    const deptResponse = await deptCreateReport(reportData);
    if (deptResponse) {
      await getAllReport(patient.id.toString());
      setIsSubmitting(false);
      setReportText("");
      setPharStatus("In Progress");
      setFile(null);
      setSelectedItems([]);
      setPrescriptionItems({});
      setItemSearch("");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white border border-[#EAECF0] custom-shadow rounded-lg p-6 space-y-12">
        {/* Patient Information Card */}
        <div className="">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            {(role === "nurse" ||
              role === "doctor" ||
              role === "matron" ||
              role === "admin" ||
              role === "medical-director") && (
              <Button
                disabled={status === "discharged"}
                onClick={handleDischarge}
              >
                {status === "discharged" ? " Discharged" : "Discharge Patient"}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                First Name
              </label>
              <p className="text-gray-900 font-medium">
                {patient.attributes.first_name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Last Name
              </label>
              <p className="text-gray-900 font-medium">
                {patient.attributes.last_name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Patient ID
              </label>
              <p className="text-gray-900 font-medium">
                {patient.attributes.card_id}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Age
              </label>
              <p className="text-gray-900 font-medium">
                {patient.attributes.age || "N/A"}
              </p>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"> */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Gender
              </label>
              <p className="text-gray-900 font-medium capitalize">
                {patient.attributes.gender}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Branch
              </label>
              <p className="text-gray-900 font-medium">
                {patient.attributes.branch}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Occupation
              </label>
              <p className="text-gray-900 font-medium">
                {patient.attributes.occupation}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Religion
              </label>
              <p className="text-gray-900 font-medium">
                {patient.attributes.religion}
              </p>
            </div>
            {/* </div> */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Phone
              </label>
              <p className="text-gray-900 font-medium">
                {patient.attributes.phone_number}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                House Address
              </label>
              <p className="text-gray-900 font-medium">
                {patient.attributes.address}
              </p>
            </div>
            {/* </div> */}
          </div>
        </div>
        <hr className="text-[#979797]" />

        {/* Next of Kin */}
        <div className="bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Next of Kin
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                First Name
              </label>
              <p className="text-gray-900 font-medium">
                {nextOfKin.name || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Last Name
              </label>
              <p className="text-gray-900 font-medium">
                {nextOfKin.last_name || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Gender
              </label>
              <p className="text-gray-900 font-medium capitalize">
                {nextOfKin.gender || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Occupation
              </label>
              <p className="text-gray-900 font-medium">
                {nextOfKin.occupation || "N/A"}
              </p>
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Religion
              </label>
              <p className="text-gray-900 font-medium">
                {nextOfKin.religion || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Phone
              </label>
              <p className="text-gray-900 font-medium">
                {nextOfKin.phone || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Relationship with Patient
              </label>
              <p className="text-gray-900 font-medium capitalize">
                {nextOfKin.relationship || "N/A"}
              </p>
            </div>
            {/* </div> */}
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                House Address
              </label>
              <p className="text-gray-900 font-medium">
                {nextOfKin.address || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <PatientDiagnosis patientId={id ? Number(patient?.id) : 0} />

        <hr className="text-[#979797]" />

        {/* Admission Details */}
        <div className="">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Admission</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Department
              </label>
              <p className="text-gray-900 font-medium">
                {clinical_department.name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Diagnosis
              </label>
              <p className="text-gray-900 font-medium">{diagnosis}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Ward
              </label>
              <p className="text-gray-900 font-medium">
                {bed_number.split("-")[0]}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Bed
              </label>
              <p className="text-gray-900 font-medium">
                {bed_number.split("-")[1]}
              </p>
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"> */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Admitted By
              </label>
              <p className="text-gray-900 font-medium">
                Dr. {recommended_by.first_name} {recommended_by.last_name}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Admission Date
              </label>
              <p className="text-gray-900 font-medium">{created_at}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                Primary Diagnosis
              </h4>
              <p className="text-gray-900">{diagnosis}</p>
            </div>
            {/* </div> */}
          </div>

          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Status
              </label>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${getCurrentStatusColor()}`}>
                  {status}
                </span>
                {(role === "nurse" ||
                  role === "doctor" ||
                  role === "matron" ||
                  role === "medical-director" ||
                  role === "admin") && (
                  <button
                    onClick={() => setShowStatusModal(true)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    disabled={status === "Discharged"}
                  >
                    <Edit2 size={16} className="text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
          {/*  */}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={` py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "Medical timeline" && (
          <div>
            {patient?.id && (
              <>
                {(role === "admin" ||
                  role === "doctor" ||
                  role === "medical-director") && (
                  <DoctorReportSystem patientId={patient.id.toString()} />
                )}

                {role === "nurse" && (
                  <>
                    {/* nurse report */}
                    <div className="bg-white rounded-lg custom-shadow mb-6 p-4 sm:p-6">
                      <button
                        className={`flex mb-4 text-primary items-center gap-1 px-3 py-1 rounded-md transition
             `}
                      >
                        <FileText size={16} />
                        Add Nurse's Report
                      </button>

                      <div className="space-y-4">
                        <textarea
                          // disabled
                          rows={8}
                          value={reportNote}
                          onChange={(e) => setReportNote(e.target.value)}
                          placeholder="Add reports."
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {/* <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                        /> */}

                        <button
                          onClick={handleReportSubmit}
                          className={`bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition flex items-center justify-center
              ${isCreating ? "opacity-50 cursor-not-allowed" : ""}
              `}
                          disabled={isCreating}
                        >
                          {isCreating ? (
                            <>
                              Adding
                              <Loader2 className=" size-6 mr-2 animate-spin" />
                            </>
                          ) : (
                            "Add Report"
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <MedicalTimeline
                  patientId={patient.id.toString()}
                  patient={selectedP}
                  showDownloadCompleteButton={false}
                />
              </>
            )}
            {role == "pharmacist" && (
              <div className="bg-white rounded-md shadow-sm mb-4 p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h1 className="text-lg font-medium">
                      Pharmacy Prescription
                    </h1>
                    <h2 className="text-sm text-gray-600">
                      Create prescriptions for pharmacy items (Optional)
                    </h2>
                  </div>
                  <Button onClick={() => setIsPrescriptionModalOpen(true)}>
                    {selectedItems.length > 0
                      ? "Edit Prescription"
                      : "Add Prescription"}
                  </Button>
                </div>

                {/* Selected Items Preview */}
                {selectedItems.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">
                        Selected Prescription Items
                      </h3>
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
                              {/* <p className="text-sm text-gray-600">
                        {prescriptionItems[item.request_pharmacy_id]?.dosage ||
                          "No dosage specified"}
                      </p> */}
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
          </div>
        )}
        {activeTab === "Fluid Balance" && (
          <FluidBalance admissionId={currentAdmission.id} />
        )}
        {activeTab === "Medications" && (
          <MedicationSheet admissionId={currentAdmission.id} />
        )}
        {activeTab === "TPR" && <TPRSheet admissionId={currentAdmission.id} />}
        {activeTab === "Vital Signs" && (
          <VitalSigns admissionId={currentAdmission.id} />
        )}
      </div>
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
                {/* Available Items */}
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
                                {isItemSelected(item.request_pharmacy_id) && (
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

                {/* Prescription Details */}
                <div>
                  <h4 className="font-medium mb-2">Prescription Details</h4>
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
                                  ₦{item.service_item_price} × {item.quantity}
                                </p>
                              </div>
                              <button
                                onClick={() => handleToggleItem(item)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            {/* 
                                  <div className="mt-2">
                                    <label className="block text-sm font-medium mb-1">
                                      Dosage Instructions
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="e.g., 1 tablet twice daily"
                                      value={
                                        prescriptionItems[item.request_pharmacy_id]
                                          ?.dosage || ""
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
                                  </div> */}

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
                variant="secondary"
                onClick={() => setIsPrescriptionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={addPrescriptionToReport}>
                {selectedItems.length > 0 ? "Update Prescription" : "Close"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Update Patient Status
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-2">
              {statusOptions.map((statusOption) => (
                <button
                  key={statusOption.name}
                  onClick={() => handleStatusUpdate(statusOption.name)}
                  disabled={isLoading}
                  className={`w-full text-left p-3 rounded-lg border transition-colors disabled:opacity-50 ${
                    status === statusOption.name
                      ? `${statusOption.borderColor} ${statusOption.bgColor} ${statusOption.color} border-2`
                      : `border-gray-200 hover:${statusOption.bgColor} hover:${statusOption.borderColor} text-gray-700 hover:${statusOption.color}`
                  }`}
                >
                  <span
                    className={
                      status === statusOption.name
                        ? statusOption.color
                        : `hover:${statusOption.color}`
                    }
                  >
                    {statusOption.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowStatusModal(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {role === "pharmacist" && (
        <div className="bg-white rounded-md shadow-sm mb-4 p-6">
          <h3 className="font-medium mb-4 text-primary">Pharmacy Report</h3>
          <textarea
            className="w-full border border-primary rounded-md p-3 h-24 mb-4"
            placeholder="Type your pharmacy report here..."
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
          />

          {/* Only show status dropdown if no prescription items */}
          {selectedItems.length === 0 && (
            <div className="mb-4">
              <h4 className="text-gray-600 text-sm mb-2">Progress Status</h4>
              <select
                className="w-full appearance-none bg-white border border-gray-300 rounded-md p-2 pr-8"
                value={status}
                onChange={(e) => setPharStatus(e.target.value)}
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          )}

          {/* File input */}
          <div className="mb-4">
            <input
              type="file"
              className="w-full border border-gray-300 rounded-md p-2"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>

          {/* Submit Button */}
          <button
            className={`bg-primary text-white py-2 px-4 rounded-md flex items-center justify-center w-full
                    ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handlePharmacyReportSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                {selectedItems.length > 0
                  ? "Dispensing Prescription..."
                  : "Submitting Report..."}
                <Loader2 className="size-6 ml-2 animate-spin" />
              </>
            ) : selectedItems.length > 0 ? (
              "Dispense Prescription & Complete Case"
            ) : (
              "Submit Report"
            )}
          </button>

          {/* Info text */}
          <p className="text-sm text-gray-600 mt-2 text-center">
            {selectedItems.length > 0
              ? "This will dispense the prescription and mark the case as completed"
              : "Submit your pharmacy report for this case"}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdmissionDetails;
