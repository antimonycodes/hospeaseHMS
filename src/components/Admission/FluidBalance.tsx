import { Edit2, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAdmissionStore } from "../../store/super-admin/useAdmissionStore";
import {
  transformApiEntryToComponent,
  transformComponentToApiData,
  validateFluidBalanceForm,
  calculateFluidStats,
  FluidEntry,
} from "../../utils/fluidBalanceUtils";

const FluidBalance = ({ admissionId }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FluidEntry | null>(null);

  const {
    isLoading,
    fluidBalanceEntries,
    createFluidBalance,
    updateFluidBalance,
    getFluidBalanceEntries,
    currentAdmission,
  } = useAdmissionStore();

  const [entries, setEntries] = useState<FluidEntry[]>([]);

  const [formData, setFormData] = useState({
    type: "",
    date: "",
    time: "",
    ivInput: "",
    oralInput: "",
    urineOutput: "",
    vomitusOutput: "",
    others: "",
    comments: "",
    recordedBy: "",
  });

  const typeOptions = [
    "Daily Monitoring",
    "Diabetes",
    "Saliva",
    "Blood",
    "Medication",
    "Nutrition",
    "Other",
  ];

  // Load fluid balance entries on component mount
  useEffect(() => {
    if (admissionId) {
      loadFluidBalanceEntries();
    }
  }, [admissionId]);

  // Update local entries when store entries change
  useEffect(() => {
    const mappedEntries = fluidBalanceEntries.map((entry) => {
      const mapped = transformApiEntryToComponent(
        entry,
        currentAdmission?.attributes.recorded_by
      );
      return {
        ...mapped,
        created_at: mapped.created_at ? String(mapped.created_at) : undefined,
        updated_at: mapped.updated_at ? String(mapped.updated_at) : undefined,
      };
    });
    setEntries(mappedEntries);
  }, [fluidBalanceEntries, currentAdmission]);

  const loadFluidBalanceEntries = async () => {
    if (admissionId) {
      await getFluidBalanceEntries(admissionId);
    }
  };

  const resetForm = () => {
    setFormData({
      type: "",
      date: "",
      time: "",
      ivInput: "",
      oralInput: "",
      urineOutput: "",
      vomitusOutput: "",
      others: "",
      comments: "",
      recordedBy: "",
    });
  };

  const openModal = (entry: FluidEntry | null = null) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        type: entry.type,
        date: entry.date,
        time: entry.time,
        ivInput: entry.ivInput.toString(),
        oralInput: entry.oralInput.toString(),
        urineOutput: entry.urineOutput.toString(),
        vomitusOutput: entry.vomitusOutput.toString(),
        others: entry.others,
        comments: entry.comments,
        recordedBy: entry.recordedBy,
      });
    } else {
      setEditingEntry(null);
      resetForm();
      // Set current date and time for new entries
      const now = new Date();
      setFormData((prev) => ({
        ...prev,
        date: now.toISOString().split("T")[0],
        time: now.toTimeString().slice(0, 5),
      }));
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
    resetForm();
  };

  const handleSubmit = async () => {
    // Validate form data
    const validation = validateFluidBalanceForm(formData);
    if (!validation.isValid) {
      validation.errors.forEach((error) => toast.error(error));
      return;
    }

    let success = false;

    if (editingEntry) {
      // Update existing entry
      const updateData = transformComponentToApiData(formData, admissionId);
      delete updateData.admission_id; // Remove admission_id for updates
      success = await updateFluidBalance(editingEntry.id, updateData);
    } else {
      // Create new entry
      const createData = transformComponentToApiData(formData, admissionId);
      success = await createFluidBalance(createData);
    }

    if (success) {
      closeModal();
      // Refresh entries
      await loadFluidBalanceEntries();
    }
  };

  const handleInputChange = (field: any, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Stats calculations using utility function
  const stats = calculateFluidStats(entries);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">FLUID CHART</h1>
        <button
          onClick={() => openModal()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md disabled:opacity-50"
        >
          <Plus size={16} />
          {isLoading ? "Loading..." : "Add Entry"}
        </button>
      </div>

      {/* Stats Card */}
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="text-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Total Entries</div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalEntries}
            </div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Total Input</div>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalInput}ml
            </div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Total Output</div>
            <div className="text-2xl font-bold text-red-600">
              {stats.totalOutput}ml
            </div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Fluid Balance</div>
            <div
              className={`text-2xl font-bold ${
                stats.fluidBalance >= 0 ? "text-purple-600" : "text-red-500"
              }`}
            >
              {stats.fluidBalance > 0 ? "+" : ""}
              {stats.fluidBalance}ml
            </div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Today's Entries</div>
            <div className="text-2xl font-bold text-orange-600">
              {stats.todaysEntries}
            </div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Most Common Type</div>
            <div className="text-xl font-bold text-indigo-600">
              {stats.mostCommonType}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading fluid balance entries...</div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S/N
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IV (Input)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oral (Input)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urine (Output)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vomitus (Output)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Others
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comments
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recorded By
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {isLoading
                      ? "Loading..."
                      : "No fluid balance entries found"}
                  </td>
                </tr>
              ) : (
                entries.map((entry, index) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {entry.date} {entry.time}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {entry.ivInput}ml
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {entry.oralInput}ml
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {entry.urineOutput}ml
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {entry.vomitusOutput}ml
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {entry.others || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                      {entry.comments}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {entry.recordedBy}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openModal(entry)}
                        disabled={isLoading}
                        className="text-primary p-1 rounded hover:bg-blue-50 transition-colors disabled:opacity-50"
                        title="Edit entry"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg custom-shadow w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-300">
              <h2 className="text-xl font-bold text-gray-900">
                {editingEntry ? "Edit Entry" : "Add New Entry"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select type</option>
                    {typeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Recorded By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recorded By *
                  </label>
                  <input
                    type="text"
                    value={formData.recordedBy}
                    onChange={(e) =>
                      handleInputChange("recordedBy", e.target.value)
                    }
                    required
                    placeholder="e.g., Nurse Smith"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* IV Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IV (Input) ml
                  </label>
                  <input
                    type="number"
                    value={formData.ivInput}
                    onChange={(e) =>
                      handleInputChange("ivInput", e.target.value)
                    }
                    min="0"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Oral Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Oral (Input) ml
                  </label>
                  <input
                    type="number"
                    value={formData.oralInput}
                    onChange={(e) =>
                      handleInputChange("oralInput", e.target.value)
                    }
                    min="0"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Urine Output */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urine (Output) ml
                  </label>
                  <input
                    type="number"
                    value={formData.urineOutput}
                    onChange={(e) =>
                      handleInputChange("urineOutput", e.target.value)
                    }
                    min="0"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Vomitus Output */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vomitus (Output) ml
                  </label>
                  <input
                    type="number"
                    value={formData.vomitusOutput}
                    onChange={(e) =>
                      handleInputChange("vomitusOutput", e.target.value)
                    }
                    min="0"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Others */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Others
                </label>
                <input
                  type="text"
                  value={formData.others}
                  onChange={(e) => handleInputChange("others", e.target.value)}
                  placeholder="e.g., 100ml drainage"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comments
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) =>
                    handleInputChange("comments", e.target.value)
                  }
                  rows={3}
                  placeholder="Additional comments or observations"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {isLoading
                    ? "Saving..."
                    : editingEntry
                    ? "Update Entry"
                    : "Add Entry"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FluidBalance;
