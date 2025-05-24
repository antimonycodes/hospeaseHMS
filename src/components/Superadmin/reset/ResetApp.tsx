import React, { useState } from "react";
import {
  AlertTriangle,
  Trash2,
  Shield,
  Info,
  CheckCircle2,
  X,
  AlertCircle,
} from "lucide-react";
import { useCombinedStore } from "../../../store/super-admin/useCombinedStore";

const ResetApp = () => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const { resetApp } = useCombinedStore();

  const dataTypes = [
    {
      id: "appointment",
      label: "Appointments",
      description: "All scheduled appointments and booking records",
      icon: "📅",
      warning: "This will permanently delete all patient appointments",
      impact: "High - Affects patient schedules and booking system",
    },
    {
      id: "patient",
      label: "Patient Records",
      description: "All patient information and medical records",
      icon: "👤",
      warning:
        "This will permanently delete all patient data and medical history",
      impact: "Critical - Cannot be recovered once deleted",
    },
    {
      id: "inventory",
      label: "Inventory Items",
      description: "Medical supplies, equipment, and stock records",
      icon: "📦",
      warning: "This will delete all inventory tracking and stock levels",
      impact: "High - Affects supply management",
    },
    {
      id: "user",
      label: "Users (Except Current Admin)",
      description: "Staff accounts and user permissions",
      icon: "👥",
      warning:
        "This will delete all user accounts except the current administrator",
      impact: "High - Staff will lose access to the system",
    },
    {
      id: "case_report",
      label: "Case Reports",
      description: "Medical case studies and reports",
      icon: "📋",
      warning: "This will delete all case reports and medical documentation",
      impact: "Medium - Affects medical documentation",
    },
    {
      id: "expenses",
      label: "Hospital Expenses",
      description: "Financial expense records and transactions",
      icon: "💰",
      warning: "This will delete all expense tracking and financial records",
      impact: "High - Affects financial reporting",
    },
    {
      id: "clinical_dept",
      label: "Clinical Departments",
      description: "Department structure and organization",
      icon: "🏥",
      warning: "This will delete all department configurations",
      impact: "Medium - Affects hospital organization",
    },
    {
      id: "service_charges",
      label: "Service Charges",
      description: "Pricing and billing information",
      icon: "💳",
      warning: "This will delete all service pricing and billing rates",
      impact: "High - Affects billing system",
    },
    {
      id: "shifts",
      label: "Staff Shifts",
      description: "Current shift assignments and schedules",
      icon: "⏰",
      warning: "This will delete all current shift assignments",
      impact: "Medium - Affects staff scheduling",
    },
    {
      id: "doctor_notes",
      label: "Doctor Notes",
      description: "Medical notes and observations",
      icon: "📝",
      warning: "This will delete all doctor notes and medical observations",
      impact: "High - Affects patient care documentation",
    },
    {
      id: "categories",
      label: "Service Categories",
      description: "Service classification and groupings",
      icon: "🏷️",
      warning: "This will delete all service category definitions",
      impact: "Low - Affects service organization",
    },
    {
      id: "finance",
      label: "Financial Records",
      description: "All financial transactions and records",
      icon: "📊",
      warning: "This will delete all financial data and transaction history",
      impact: "Critical - Cannot be recovered, affects accounting",
    },
    {
      id: "payment_source",
      label: "Payment Sources",
      description: "Payment methods and source configurations",
      icon: "💎",
      warning: "This will delete all payment source configurations",
      impact: "Medium - Affects payment processing",
    },
    {
      id: "shift_schedule",
      label: "Shift Schedules",
      description: "Staff scheduling templates and patterns",
      icon: "📆",
      warning: "This will delete all shift scheduling templates",
      impact: "Medium - Affects staff planning",
    },
    {
      id: "branches",
      label: "Hospital Branches",
      description: "Branch locations and configurations",
      icon: "🌐",
      warning: "This will delete all branch configurations under this hospital",
      impact: "High - Affects multi-location operations",
    },
  ];

  const toggleSelection = (typeId: any) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleReset = async () => {
    if (selectedTypes.length === 0) return;
    setIsResetting(true);
    try {
      const response = await resetApp({ type: selectedTypes });
      if (response) {
        setResetComplete(true);
        setShowConfirmation(false);
        setSelectedTypes([]);
      }
    } catch (error) {
      console.error("Reset failed:", error);
    } finally {
      setIsResetting(false);
    }
  };

  const getImpactColor = (impact: any) => {
    const level = impact.split(" - ")[0];
    switch (level) {
      case "Critical":
        return "text-red-700 bg-red-100 border-red-200";
      case "High":
        return "text-amber-700 bg-amber-100 border-amber-200";
      case "Medium":
        return "text-blue-700 bg-blue-100 border-blue-200";
      case "Low":
        return "text-emerald-700 bg-emerald-100 border-emerald-200";
      default:
        return "text-slate-700 bg-slate-100 border-slate-200";
    }
  };

  if (resetComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-200 p-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Reset Complete
            </h2>
            <p className="text-slate-600 text-lg mb-8">
              Selected records have been successfully reset from the system.
            </p>
            <button
              onClick={() => setResetComplete(false)}
              className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              Return to Reset Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                Data Reset Center
              </h1>
              <p className="text-slate-600 text-lg">
                Permanently remove obsolete or dummy data from the system
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-red-900 font-semibold text-lg mb-2">
                  Warning: Permanent Action
                </h3>
                <p className="text-red-800 leading-relaxed">
                  This action cannot be undone. All selected data will be
                  permanently deleted from the system. Please ensure you have
                  proper backups before proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Type Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Select Records to Reset
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {dataTypes.map((type) => {
              const isSelected = selectedTypes.includes(type.id);
              return (
                <div
                  key={type.id}
                  className={`group relative bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                    isSelected
                      ? "border-red-300 shadow-lg shadow-red-100 bg-red-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => toggleSelection(type.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl flex-shrink-0">{type.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-slate-900 text-lg">
                            {type.label}
                          </h3>
                          <div
                            className={`w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer flex items-center justify-center ${
                              isSelected
                                ? "bg-red-600 border-red-600"
                                : "border-slate-300 hover:border-slate-400"
                            }`}
                          >
                            {isSelected && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                          {type.description}
                        </p>
                        <div
                          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${getImpactColor(
                            type.impact
                          )}`}
                        >
                          <Info className="w-4 h-4 mr-2" />
                          {type.impact}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-4 p-4 bg-red-100 rounded-lg border border-red-200">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <p className="text-red-800 text-sm font-medium">
                            {type.warning}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Bar */}
        <div className="sticky bottom-4 bg-white rounded-xl shadow-xl border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-slate-600">
              {selectedTypes.length === 0 ? (
                <span className="text-lg">Select records to reset</span>
              ) : (
                <span className="text-lg font-medium">
                  <span className="text-red-600">{selectedTypes.length}</span>{" "}
                  record
                  {selectedTypes.length > 1 ? "s" : ""} selected for reset
                </span>
              )}
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => setSelectedTypes([])}
                disabled={selectedTypes.length === 0}
                className="flex-1 sm:flex-none px-6 py-3 text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Clear Selection
              </button>
              <button
                onClick={() => setShowConfirmation(true)}
                disabled={selectedTypes.length === 0}
                className="flex-1 sm:flex-none bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Reset Selected Data
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-[#1E1E1E40] backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Confirm Data Reset
                  </h3>
                </div>

                <p className="text-slate-600 text-lg mb-6">
                  You are about to permanently delete the following records:
                </p>

                <div className="bg-slate-50 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
                  <div className="space-y-3">
                    {selectedTypes.map((typeId) => {
                      const type = dataTypes.find((t) => t.id === typeId);
                      return (
                        <div
                          key={typeId}
                          className="flex items-center gap-3 p-2 bg-white rounded-lg"
                        >
                          <span className="text-2xl">{type?.icon}</span>
                          <span className="font-medium text-slate-900">
                            {type?.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-red-800 font-medium">
                      This action is irreversible. All selected data will be
                      permanently deleted.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    disabled={isResetting}
                    className="flex-1 px-6 py-3 text-slate-600 hover:text-slate-800 disabled:opacity-50 font-medium transition-colors"
                  >
                    <X className="w-4 h-4 inline mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={isResetting}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 disabled:bg-red-400 transition-all duration-200 shadow-lg font-medium flex items-center justify-center gap-2"
                  >
                    {isResetting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Resetting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        Confirm Reset
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetApp;
