import { useEffect, useState } from "react";
import {
  Edit,
  Eye,
  X,
  Plus,
  Calendar,
  User,
  Clock,
  History,
} from "lucide-react";
import { useCombinedStore } from "../../../store/super-admin/useCombinedStore";

interface DiagnosisData {
  type: string;
  id: number;
  attributes: {
    recorded_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    patient: {
      id: number;
      first_name: string;
      last_name: string;
    };
    diagnosis: string;
    created_at: string;
  };
}

interface PatientDiagnosisProps {
  patientId: number;
}

const PatientDiagnosis: React.FC<PatientDiagnosisProps> = ({ patientId }) => {
  const { allDiagnosis, createDiagnosis, diagnosis } = useCombinedStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] =
    useState<DiagnosisData | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    patient_id: patientId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patientId) {
      allDiagnosis(patientId);
    }
  }, [allDiagnosis, patientId]);

  // Use the array as-is (assuming API returns in chronological order)
  // and get the last item as current diagnosis
  const diagnoses = diagnosis || [];
  const hasDiagnosis = diagnoses.length > 0;
  const currentDiagnosis = hasDiagnosis
    ? diagnoses[diagnoses.length - 1]
    : null;

  // For history, reverse the array to show most recent first
  const historyDiagnoses = [...diagnoses].reverse();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateDiagnosis = async () => {
    if (!formData.description.trim()) {
      alert("Please enter a diagnosis description");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      patient_id: patientId,
      description: formData.description,
    };

    try {
      const success = await createDiagnosis(payload);
      if (success) {
        setIsCreateModalOpen(false);
        setFormData({ description: "", patient_id: patientId });
        // Refresh diagnosis data
        await allDiagnosis(patientId);
      }
    } catch (error) {
      console.error("Error creating diagnosis:", error);
      alert("Failed to create diagnosis. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      description: "",
      patient_id: patientId,
    });
    setIsCreateModalOpen(true);
  };

  const openViewModal = (diagnosisData: DiagnosisData) => {
    setSelectedDiagnosis(diagnosisData);
    setIsViewModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      // If it's already a formatted date like "Jun 27, 2025", return as-is
      if (dateString.includes(",")) {
        return dateString;
      }
      // Otherwise, try to format it
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Diagnosis Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Current Diagnosis
          </h3>
          <div className="flex gap-2">
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-md  text-sm font-medium"
              aria-label="Add new diagnosis"
            >
              <Plus size={16} />
              Add Diagnosis
            </button>
            {hasDiagnosis && (
              <button
                onClick={() => setIsHistoryModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
                aria-label="View diagnosis history"
              >
                <History size={16} />
                History ({diagnoses.length})
              </button>
            )}
          </div>
        </div>

        {hasDiagnosis ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-lg font-medium text-red-500 mb-2">
                  {currentDiagnosis?.attributes.diagnosis}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(currentDiagnosis?.attributes.created_at || "")}
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    {currentDiagnosis?.attributes.recorded_by.first_name}{" "}
                    {currentDiagnosis?.attributes.recorded_by.last_name}
                  </div>
                </div>
              </div>
              <button
                onClick={() =>
                  currentDiagnosis && openViewModal(currentDiagnosis)
                }
                className="p-2 text-primary hover:bg-blue-100 rounded-full"
                aria-label="View diagnosis details"
              >
                <Eye size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-2">
              <Clock size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 mb-4">
              No diagnosis recorded for this patient
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md  font-medium"
            >
              <Plus size={16} />
              Create First Diagnosis
            </button>
          </div>
        )}
      </div>

      {/* Create Diagnosis Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-[#1E1E1E40]  flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add New Diagnosis</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Diagnosis Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Enter detailed diagnosis description..."
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateDiagnosis}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Creating..." : "Create Diagnosis"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Diagnosis Modal */}
      {isViewModalOpen && selectedDiagnosis && (
        <div className="fixed inset-0 bg-[#1E1E1E40]  flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Diagnosis Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Diagnosis Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed">
                    {selectedDiagnosis.attributes.diagnosis}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">
                    Patient
                  </h4>
                  <p className="text-blue-900">
                    {selectedDiagnosis.attributes.patient.first_name}{" "}
                    {selectedDiagnosis.attributes.patient.last_name}
                  </p>
                  <p className="text-sm text-blue-600">
                    ID: {selectedDiagnosis.attributes.patient.id}
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-800 mb-2">
                    Recorded By
                  </h4>
                  <p className="text-green-900">
                    {selectedDiagnosis.attributes.recorded_by.first_name}{" "}
                    {selectedDiagnosis.attributes.recorded_by.last_name}
                  </p>
                  <p className="text-sm text-green-600">
                    ID: {selectedDiagnosis.attributes.recorded_by.id}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-800 mb-2">
                  Created Date
                </h4>
                <p className="text-gray-900">
                  {formatDate(selectedDiagnosis.attributes.created_at)}
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    openCreateModal();
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary"
                >
                  Add New Diagnosis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diagnosis History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-[#1E1E1E40]  flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Diagnosis History</h2>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {historyDiagnoses.map((diagnosisItem, index) => (
                  <div
                    key={diagnosisItem.id}
                    className={`border rounded-lg p-4 ${
                      index === 0
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {index === 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Current
                            </span>
                          )}
                          <span className="text-sm text-gray-500">
                            #{diagnosisItem.id}
                          </span>
                        </div>
                        <p className="text-gray-900 font-medium mb-2">
                          {diagnosisItem.attributes.diagnosis}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(diagnosisItem.attributes.created_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            {
                              diagnosisItem.attributes.recorded_by.first_name
                            }{" "}
                            {diagnosisItem.attributes.recorded_by.last_name}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => openViewModal(diagnosisItem)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
                        aria-label={`View diagnosis #${diagnosisItem.id}`}
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsHistoryModalOpen(false);
                    openCreateModal();
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary"
                >
                  Add New Diagnosis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDiagnosis;
