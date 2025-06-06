import React, { useState, useEffect } from "react";
import { ArrowLeft, Edit2, X, Loader2 } from "lucide-react";
import FluidBalance from "./FluidBalance";
import MedicationSheet from "./MedicationSheet";
import TPRSheet from "./TPRSheet";
import VitalSigns from "./VitalSigns";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmissionStore } from "../../store/super-admin/useAdmissionStore";
import Loader from "../../Shared/Loader";
import { useRole } from "../../hooks/useRole";
import MedicalTimeline from "../../Shared/MedicalTimeline";

const AdmissionDetails: React.FC = () => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Clinical History");

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    isLoading,
    currentAdmission,
    getAdmissionById,
    updateAdmissionStatus,
    dischargePatient,
    updateRecoveryStatus,
  } = useAdmissionStore();

  const tabs = [
    "Clinical History",
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

  const role = useRole();

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
            {(role === "nurse" || role === "doctor" || role === "admin") && (
              <Button
                disabled={status === "discharged"}
                onClick={handleDischarge}
              >
                Discharge Patient
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
        {activeTab === "Clinical History" && (
          <div>
            {patient?.id && (
              <MedicalTimeline
                patientId={patient.id.toString()}
                patient={selectedP}
                showDownloadCompleteButton={false}
              />
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
    </div>
  );
};

export default AdmissionDetails;
