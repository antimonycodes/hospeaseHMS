import React, { useState } from "react";
import { ArrowLeft, Edit2, X } from "lucide-react";
import FluidBalance from "./FluidBalance";
import MedicationSheet from "./MedicationSheet";
import TPRSheet from "./TPRSheet";
import VitalSigns from "./VitalSigns";
import { useNavigate } from "react-router-dom";

const AdmissionDetails: React.FC = () => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("Critically Ill");
  const [activeTab, setActiveTab] = useState("Clinical History");

  const tabs = [
    "Clinical History",
    "Fluid Balance",
    "Medications",
    "TPR",
    "Vital Signs",
  ];

  const statusOptions = [
    {
      name: "Critically Ill",
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
    {
      name: "Discharged",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
  ];

  const handleStatusUpdate = (newStatus: string) => {
    setCurrentStatus(newStatus);
    setShowStatusModal(false);
  };

  const getCurrentStatusColor = () => {
    const status = statusOptions.find((s) => s.name === currentStatus);
    return status ? status.color : "text-red-600";
  };

  const Button: React.FC<{
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    onClick?: () => void;
  }> = ({ children, variant = "primary", onClick }) => {
    const baseClasses =
      "px-4 py-2 rounded-lg font-medium text-sm transition-colors";
    const variantClasses =
      variant === "primary"
        ? "bg-primary text-white hover:bg-green-700"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200";

    return (
      <button className={`${baseClasses} ${variantClasses}`} onClick={onClick}>
        {children}
      </button>
    );
  };

  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <div className="bg-white border border-[#EAECF0] custom-shadow rounded-lg p-6 space-y-12">
        {/* Patient Information Card */}
        <div className=" ">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <Button>Discharge Patient</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                First Name
              </label>
              <p className="text-gray-900 font-medium">Philip</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Last Name
              </label>
              <p className="text-gray-900 font-medium">Ikiriko</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Patient ID
              </label>
              <p className="text-gray-900 font-medium">0010602</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Age
              </label>
              <p className="text-gray-900 font-medium">32</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Gender
              </label>
              <p className="text-gray-900 font-medium">Male</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Branch
              </label>
              <p className="text-gray-900 font-medium">Agodi</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Occupation
              </label>
              <p className="text-gray-900 font-medium">Banker</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Religion
              </label>
              <p className="text-gray-900 font-medium">Christian</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Phone
              </label>
              <p className="text-gray-900 font-medium">+23465666954</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                House Address
              </label>
              <p className="text-gray-900 font-medium">
                5, John Ayanfe Close, Agodi, Ibadan Oyo State
              </p>
            </div>
          </div>
        </div>

        {/* Next of Kin */}
        <div className="bg-white ">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Next of Kin
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                First Name
              </label>
              <p className="text-gray-900 font-medium">Philip</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Last Name
              </label>
              <p className="text-gray-900 font-medium">Juliet</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Gender
              </label>
              <p className="text-gray-900 font-medium">Male</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Occupation
              </label>
              <p className="text-gray-900 font-medium">Banker</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Religion
              </label>
              <p className="text-gray-900 font-medium">Christian</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Phone
              </label>
              <p className="text-gray-900 font-medium">+23465666954</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Relationship with Patient
              </label>
              <p className="text-gray-900 font-medium">Sister</p>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-gray-500 mb-1 block">
              House Address
            </label>
            <p className="text-gray-900 font-medium">
              5, John Ayanfe Close, Agodi, Ibadan Oyo State
            </p>
          </div>
        </div>

        {/* Admission Details */}
        <div className=" ">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Admission</h3>
            {/* <Button variant="secondary">Admission History</Button> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Department
              </label>
              <p className="text-gray-900 font-medium">Clinical Department</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Diagnosis
              </label>
              <p className="text-gray-900 font-medium">Fever</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Ward
              </label>
              <p className="text-gray-900 font-medium">05</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Bed
              </label>
              <p className="text-gray-900 font-medium">01</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">
                Status
              </label>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${getCurrentStatusColor()}`}>
                  {currentStatus}
                </span>
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Edit2 size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
            {/* <div className="ml-auto">
              <Button variant="secondary">Discharge Patient</Button>
            </div> */}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* clinical History */}
        {activeTab === "Clinical History" && <h1>Clinical History</h1>}
        {activeTab === "Fluid Balance" && <FluidBalance />}
        {activeTab === "Medications" && <MedicationSheet />}
        {activeTab === "TPR" && <TPRSheet />}
        {activeTab === "Vital Signs" && <VitalSigns />}
      </div>

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-[#1E1E1E40]  flex items-center justify-center z-50">
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
              {statusOptions.map((status) => (
                <button
                  key={status.name}
                  onClick={() => handleStatusUpdate(status.name)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    currentStatus === status.name
                      ? `${status.borderColor} ${status.bgColor} ${status.color} border-2`
                      : `border-gray-200 hover:${status.bgColor} hover:${status.borderColor} text-gray-700 hover:${status.color}`
                  }`}
                >
                  <span
                    className={
                      currentStatus === status.name
                        ? status.color
                        : `hover:${status.color}`
                    }
                  >
                    {status.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowStatusModal(false)}
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
