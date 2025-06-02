import { Edit2, Plus, X } from "lucide-react";
import { useState } from "react";

type FluidEntry = {
  id: number;
  type: string;
  date: string;
  time: string;
  ivInput: number;
  oralInput: number;
  urineOutput: number;
  vomitusOutput: number;
  others: string;
  comments: string;
  recordedBy: string;
};

const FluidBalance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FluidEntry | null>(null);
  const [entries, setEntries] = useState<FluidEntry[]>([
    {
      id: 1,
      type: "Diabetes",
      date: "2020-07-21",
      time: "18:00",
      ivInput: 55,
      oralInput: 20,
      urineOutput: 0,
      vomitusOutput: 45,
      others: "",
      comments: "consectetur sed, vitae cursus consectetur turpis risus",
      recordedBy: "Nurse Titi",
    },
    {
      id: 2,
      type: "Saliva",
      date: "2020-07-21",
      time: "18:00",
      ivInput: 40,
      oralInput: 20,
      urineOutput: 0,
      vomitusOutput: 10,
      others: "",
      comments: "lorem lorem lorem do aenq consectetur turpis lorem cursus",
      recordedBy: "Nurse Titi",
    },
    {
      id: 3,
      type: "Saliva",
      date: "2020-07-21",
      time: "18:00",
      ivInput: 10,
      oralInput: 35,
      urineOutput: 60,
      vomitusOutput: 0,
      others: "",
      comments: "lorem lorem lorem do aenq consectetur turpis lorem cursus",
      recordedBy: "Nurse Adeola",
    },
    {
      id: 4,
      type: "Diabetes",
      date: "2025-06-02",
      time: "18:00",
      ivInput: 55,
      oralInput: 20,
      urineOutput: 0,
      vomitusOutput: 45,
      others: "",
      comments: "consectetur sed, vitae cursus consectetur turpis risus",
      recordedBy: "Nurse Titi",
    },
  ]);

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
    "Diabetes",
    "Saliva",
    "Blood",
    "Medication",
    "Nutrition",
    "Other",
  ];

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
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
    resetForm();
  };

  const handleSubmit = () => {
    const newEntry = {
      id: editingEntry ? editingEntry.id : entries.length + 1,
      type: formData.type,
      date: formData.date,
      time: formData.time,
      ivInput: parseInt(formData.ivInput) || 0,
      oralInput: parseInt(formData.oralInput) || 0,
      urineOutput: parseInt(formData.urineOutput) || 0,
      vomitusOutput: parseInt(formData.vomitusOutput) || 0,
      others: formData.others,
      comments: formData.comments,
      recordedBy: formData.recordedBy,
    };

    if (editingEntry) {
      setEntries(
        entries.map((entry) =>
          entry.id === editingEntry.id ? newEntry : entry
        )
      );
    } else {
      setEntries([...entries, newEntry]);
    }

    closeModal();
  };

  const handleInputChange = (field: any, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Stats calculations
  const totalEntries = entries.length;

  // Total Input (IV + Oral)
  const totalInput = entries.reduce(
    (sum, entry) => sum + entry.ivInput + entry.oralInput,
    0
  );

  // Total Output (Urine + Vomitus)
  const totalOutput = entries.reduce(
    (sum, entry) => sum + entry.urineOutput + entry.vomitusOutput,
    0
  );

  // Fluid Balance (Input - Output)
  const fluidBalance = totalInput - totalOutput;

  // Today's entries
  const today = new Date().toISOString().split("T")[0];
  const todaysEntries = entries.filter((entry) => entry.date === today).length;

  // Most common fluid type
  const typeStats = entries.reduce((acc: any, entry) => {
    acc[entry.type] = (acc[entry.type] || 0) + 1;
    return acc;
  }, {});
  const mostCommonType =
    Object.keys(typeStats).length > 0
      ? Object.keys(typeStats).reduce((a, b) =>
          typeStats[a] > typeStats[b] ? a : b
        )
      : "None";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">FLUID CHART</h1>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md "
        >
          <Plus size={16} />
          Add Entry
        </button>
      </div>

      {/* Stats Card */}
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="text-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Total Entries</div>
            <div className="text-2xl font-bold text-blue-600">
              {totalEntries}
            </div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Total Input</div>
            <div className="text-2xl font-bold text-green-600">
              {totalInput}ml
            </div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Total Output</div>
            <div className="text-2xl font-bold text-red-600">
              {totalOutput}ml
            </div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Fluid Balance</div>
            <div
              className={`text-2xl font-bold ${
                fluidBalance >= 0 ? "text-purple-600" : "text-red-500"
              }`}
            >
              {fluidBalance > 0 ? "+" : ""}
              {fluidBalance}ml
            </div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Today's Entries</div>
            <div className="text-2xl font-bold text-orange-600">
              {todaysEntries}
            </div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Most Common Type</div>
            <div className="text-xl font-bold text-indigo-600">
              {mostCommonType}
            </div>
          </div>
        </div>
      </div>

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
              {entries.map((entry, index) => (
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
                    {entry.ivInput}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {entry.oralInput}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {entry.urineOutput}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {entry.vomitusOutput}
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
                      className="text-primary p-1 rounded hover:bg-blue-50 transition-colors"
                      title="Edit entry"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
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
                  placeholder="0"
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
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md  transition-colors"
                >
                  {editingEntry ? "Update Entry" : "Add Entry"}
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
