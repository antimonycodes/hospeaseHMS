import { Edit2, Plus, X } from "lucide-react";
import { useState } from "react";

type VitalSignsEntry = {
  id: number;
  date: string;
  time: string;
  temperature: number; // in °C
  pulse: number; // bpm
  respiration: number; // breaths per minute
  systolicBP: number; // mmHg
  diastolicBP: number; // mmHg
  oxygenSat: number; // %
  painScore: number; // 0-10
  recordedBy: string;
};

const VitalSigns = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<VitalSignsEntry | null>(
    null
  );

  const [entries, setEntries] = useState<VitalSignsEntry[]>([
    {
      id: 1,
      date: "2025-06-01",
      time: "08:00",
      temperature: 36.8,
      pulse: 72,
      respiration: 16,
      systolicBP: 120,
      diastolicBP: 80,
      oxygenSat: 98,
      painScore: 0,
      recordedBy: "Nurse Titi",
    },
    {
      id: 2,
      date: "2025-06-01",
      time: "12:00",
      temperature: 37.1,
      pulse: 68,
      respiration: 18,
      systolicBP: 118,
      diastolicBP: 76,
      oxygenSat: 97,
      painScore: 1,
      recordedBy: "Nurse Adeola",
    },
    {
      id: 3,
      date: "2025-06-01",
      time: "16:00",
      temperature: 37.3,
      pulse: 75,
      respiration: 17,
      systolicBP: 122,
      diastolicBP: 82,
      oxygenSat: 96,
      painScore: 2,
      recordedBy: "Nurse Titi",
    },
    {
      id: 4,
      date: "2025-06-02",
      time: "08:00",
      temperature: 36.9,
      pulse: 70,
      respiration: 16,
      systolicBP: 119,
      diastolicBP: 78,
      oxygenSat: 99,
      painScore: 0,
      recordedBy: "Nurse Adeola",
    },
  ]);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    temperature: "",
    pulse: "",
    respiration: "",
    systolicBP: "",
    diastolicBP: "",
    oxygenSat: "",
    painScore: "",
    recordedBy: "",
  });

  const resetForm = () => {
    setFormData({
      date: "",
      time: "",
      temperature: "",
      pulse: "",
      respiration: "",
      systolicBP: "",
      diastolicBP: "",
      oxygenSat: "",
      painScore: "",
      recordedBy: "",
    });
  };

  const openModal = (entry: VitalSignsEntry | null = null) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        date: entry.date,
        time: entry.time,
        temperature: entry.temperature.toString(),
        pulse: entry.pulse.toString(),
        respiration: entry.respiration.toString(),
        systolicBP: entry.systolicBP.toString(),
        diastolicBP: entry.diastolicBP.toString(),
        oxygenSat: entry.oxygenSat.toString(),
        painScore: entry.painScore.toString(),
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
      date: formData.date,
      time: formData.time,
      temperature: parseFloat(formData.temperature) || 0,
      pulse: parseInt(formData.pulse) || 0,
      respiration: parseInt(formData.respiration) || 0,
      systolicBP: parseInt(formData.systolicBP) || 0,
      diastolicBP: parseInt(formData.diastolicBP) || 0,
      oxygenSat: parseInt(formData.oxygenSat) || 0,
      painScore: parseInt(formData.painScore) || 0,
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Stats calculations
  const totalEntries = entries.length;

  // Today's entries
  const today = new Date().toISOString().split("T")[0];
  const todaysEntries = entries.filter((entry) => entry.date === today).length;

  // Average calculations
  const avgTemperature =
    entries.reduce((sum, entry) => sum + entry.temperature, 0) / entries.length;
  const avgPulse =
    entries.reduce((sum, entry) => sum + entry.pulse, 0) / entries.length;
  const avgRespiration =
    entries.reduce((sum, entry) => sum + entry.respiration, 0) / entries.length;
  const avgOxygenSat =
    entries.reduce((sum, entry) => sum + entry.oxygenSat, 0) / entries.length;

  // Last recorded vital signs
  const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null;
  const lastBP = lastEntry
    ? `${lastEntry.systolicBP}/${lastEntry.diastolicBP}`
    : "N/A";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          VITAL SIGNS MONITORING
        </h1>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md"
        >
          <Plus size={16} />
          Add Entry
        </button>
      </div>

      {/* Stats Cards */}
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="text-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Total Entries</div>
            <div className="text-2xl font-bold text-blue-600">
              {totalEntries}
            </div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Today's Entries</div>
            <div className="text-2xl font-bold text-green-600">
              {todaysEntries}
            </div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Avg. Temp (°C)</div>
            <div className="text-2xl font-bold text-purple-600">
              {avgTemperature.toFixed(1)}
            </div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Avg. Pulse (bpm)</div>
            <div className="text-2xl font-bold text-red-600">
              {avgPulse.toFixed(0)}
            </div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Avg. Resp. Rate</div>
            <div className="text-2xl font-bold text-orange-600">
              {avgRespiration.toFixed(0)}
            </div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Avg. O₂ Sat (%)</div>
            <div className="text-2xl font-bold text-indigo-600">
              {avgOxygenSat.toFixed(0)}
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
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Temp (°C)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pulse (bpm)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resp. Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BP (mmHg)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  O₂ Sat (%)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pain Score
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
                    {entry.date} {entry.time}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-medium ${
                      entry.temperature > 37.5
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    {entry.temperature.toFixed(1)}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-medium ${
                      entry.pulse > 100 || entry.pulse < 60
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    {entry.pulse}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-medium ${
                      entry.respiration > 20 || entry.respiration < 12
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    {entry.respiration}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-medium ${
                      entry.systolicBP > 140 || entry.diastolicBP > 90
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    {entry.systolicBP}/{entry.diastolicBP}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-medium ${
                      entry.oxygenSat < 95 ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {entry.oxygenSat}%
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-medium ${
                      entry.painScore >= 4 ? "text-orange-600" : "text-gray-900"
                    }`}
                  >
                    {entry.painScore}/10
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
                {editingEntry ? "Edit Vital Signs" : "Record New Vital Signs"}
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
                    Temperature (°C) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="35"
                    max="42"
                    value={formData.temperature}
                    onChange={(e) =>
                      handleInputChange("temperature", e.target.value)
                    }
                    required
                    placeholder="36.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Pulse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pulse (bpm) *
                  </label>
                  <input
                    type="number"
                    min="40"
                    max="200"
                    value={formData.pulse}
                    onChange={(e) => handleInputChange("pulse", e.target.value)}
                    required
                    placeholder="72"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Respiration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Respiration Rate *
                  </label>
                  <input
                    type="number"
                    min="8"
                    max="40"
                    value={formData.respiration}
                    onChange={(e) =>
                      handleInputChange("respiration", e.target.value)
                    }
                    required
                    placeholder="16"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Blood Pressure */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Systolic BP (mmHg) *
                    </label>
                    <input
                      type="number"
                      min="70"
                      max="250"
                      value={formData.systolicBP}
                      onChange={(e) =>
                        handleInputChange("systolicBP", e.target.value)
                      }
                      required
                      placeholder="120"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diastolic BP (mmHg) *
                    </label>
                    <input
                      type="number"
                      min="40"
                      max="150"
                      value={formData.diastolicBP}
                      onChange={(e) =>
                        handleInputChange("diastolicBP", e.target.value)
                      }
                      required
                      placeholder="80"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Oxygen Saturation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Oxygen Saturation (%) *
                  </label>
                  <input
                    type="number"
                    min="70"
                    max="100"
                    value={formData.oxygenSat}
                    onChange={(e) =>
                      handleInputChange("oxygenSat", e.target.value)
                    }
                    required
                    placeholder="98"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Pain Score */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pain Score (0-10) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.painScore}
                    onChange={(e) =>
                      handleInputChange("painScore", e.target.value)
                    }
                    required
                    placeholder="0"
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

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md transition-colors"
                >
                  {editingEntry ? "Update Entry" : "Record Vital Signs"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalSigns;
