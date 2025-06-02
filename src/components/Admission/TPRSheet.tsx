import {
  Edit2,
  Plus,
  X,
  Thermometer,
  Heart,
  Activity,
  Gauge,
} from "lucide-react";
import { useState } from "react";

const TPRSheet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  type TPREntry = {
    id: number;
    date: string;
    time: string;
    temperature: string;
    pulse: string;
    respiration: string;
    bloodPressure: string;
    comment: string;
    recordedBy: string;
  };

  const [editingEntry, setEditingEntry] = useState<TPREntry | null>(null);

  const [entries, setEntries] = useState<TPREntry[]>([
    {
      id: 1,
      date: "2024-06-01",
      time: "08:00",
      temperature: "98.6",
      pulse: "72",
      respiration: "18",
      bloodPressure: "120/80",
      comment: "Normal vitals, patient stable",
      recordedBy: "Nurse Titi",
    },
    {
      id: 2,
      date: "2024-06-01",
      time: "14:00",
      temperature: "99.2",
      pulse: "78",
      respiration: "20",
      bloodPressure: "125/82",
      comment: "Slight temperature elevation",
      recordedBy: "Adeola Becker",
    },
    {
      id: 3,
      date: "2024-06-01",
      time: "20:00",
      temperature: "98.4",
      pulse: "68",
      respiration: "16",
      bloodPressure: "118/76",
      comment: "Temperature normalized",
      recordedBy: "Adeola Becker",
    },
  ]);

  const [formData, setFormData] = useState<any>({
    date: "",
    time: "",
    temperature: "",
    pulse: "",
    respiration: "",
    bloodPressure: "",
    comment: "",
    recordedBy: "",
  });

  const resetForm = () => {
    setFormData({
      date: "",
      time: "",
      temperature: "",
      pulse: "",
      respiration: "",
      bloodPressure: "",
      comment: "",
      recordedBy: "",
    });
  };

  const openModal = (entry: any | null = null) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        date: entry.date,
        time: entry.time,
        temperature: entry.temperature,
        pulse: entry.pulse,
        respiration: entry.respiration,
        bloodPressure: entry.bloodPressure,
        comment: entry.comment,
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
    // Validate required fields
    if (!formData.date || !formData.time || !formData.recordedBy) {
      alert("Please fill in all required fields");
      return;
    }

    const newEntry = {
      id: editingEntry ? editingEntry.id : entries.length + 1,
      date: formData.date,
      time: formData.time,
      temperature: formData.temperature,
      pulse: formData.pulse,
      respiration: formData.respiration,
      bloodPressure: formData.bloodPressure,
      comment: formData.comment,
      recordedBy: formData.recordedBy,
    };

    if (editingEntry) {
      setEntries(
        entries.map((entry: any) =>
          entry.id === editingEntry.id ? newEntry : entry
        )
      );
    } else {
      setEntries([...entries, newEntry]);
    }

    closeModal();
  };

  const handleInputChange = (field: any, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getVitalStatus = (vital: any, type: any) => {
    if (!vital) return "text-gray-400";

    const value = parseFloat(vital);
    switch (type) {
      case "temperature":
        if (value >= 100.4) return "text-red-600";
        if (value <= 97.0) return "text-blue-600";
        return "text-green-600";
      case "pulse":
        if (value > 100 || value < 60) return "text-red-600";
        return "text-green-600";
      case "respiration":
        if (value > 20 || value < 12) return "text-red-600";
        return "text-green-600";
      default:
        return "text-gray-900";
    }
  };

  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="text-blue-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-900">TPR SHEET</h1>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md transition-colors"
        >
          <Plus size={16} />
          Add Entry
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Thermometer className="text-red-500" size={20} />
            <span className="text-sm font-medium text-gray-700">
              Latest Temp
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {entries[entries.length - 1]?.temperature || "--"}°F
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Heart className="text-red-500" size={20} />
            <span className="text-sm font-medium text-gray-700">
              Latest Pulse
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {entries[entries.length - 1]?.pulse || "--"} bpm
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Activity className="text-blue-500" size={20} />
            <span className="text-sm font-medium text-gray-700">
              Latest Resp
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {entries[entries.length - 1]?.respiration || "--"} /min
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Gauge className="text-purple-500" size={20} />
            <span className="text-sm font-medium text-gray-700">
              Latest B/P
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {entries[entries.length - 1]?.bloodPressure || "--"} mmHg
          </p>
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
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Thermometer size={14} />
                    Temp (°F)
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Heart size={14} />
                    Pulse (bpm)
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Activity size={14} />
                    Resp (/min)
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Gauge size={14} />
                    B/P (mmHg)
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recorded By
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry: any, index: any) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="font-medium">{entry.date}</div>
                    <div className="text-gray-500">{entry.time}</div>
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-medium ${getVitalStatus(
                      entry.temperature,
                      "temperature"
                    )}`}
                  >
                    {entry.temperature || "--"}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-medium ${getVitalStatus(
                      entry.pulse,
                      "pulse"
                    )}`}
                  >
                    {entry.pulse || "--"}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-medium ${getVitalStatus(
                      entry.respiration,
                      "respiration"
                    )}`}
                  >
                    {entry.respiration || "--"}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {entry.bloodPressure || "--"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                    <div className="truncate" title={entry.comment}>
                      {entry.comment || "--"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {entry.recordedBy}
                    </span>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingEntry ? "Edit TPR Entry" : "Add New TPR Entry"}
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
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Temperature */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                      <Thermometer size={16} className="text-red-500" />
                      Temperature (°F)
                    </div>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) =>
                      handleInputChange("temperature", e.target.value)
                    }
                    placeholder="98.6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Pulse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                      <Heart size={16} className="text-red-500" />
                      Pulse (bpm)
                    </div>
                  </label>
                  <input
                    type="number"
                    value={formData.pulse}
                    onChange={(e) => handleInputChange("pulse", e.target.value)}
                    placeholder="72"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Respiration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                      <Activity size={16} className="text-blue-500" />
                      Respiration (/min)
                    </div>
                  </label>
                  <input
                    type="number"
                    value={formData.respiration}
                    onChange={(e) =>
                      handleInputChange("respiration", e.target.value)
                    }
                    placeholder="18"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Blood Pressure */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                      <Gauge size={16} className="text-purple-500" />
                      Blood Pressure (mmHg)
                    </div>
                  </label>
                  <input
                    type="text"
                    value={formData.bloodPressure}
                    onChange={(e) =>
                      handleInputChange("bloodPressure", e.target.value)
                    }
                    placeholder="120/80"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Recorded By */}
                <div className="md:col-span-2">
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
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => handleInputChange("comment", e.target.value)}
                  rows={3}
                  placeholder="Additional observations or notes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-primaryrounded-md hover:bg-blue-700 transition-colors"
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

export default TPRSheet;
