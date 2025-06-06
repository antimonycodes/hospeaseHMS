import { Edit2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAdmissionStore } from "../../store/super-admin/useAdmissionStore";
import { useRole } from "../../hooks/useRole";

type VitalSignsEntry = {
  time: any;
  date: any;
  id: any;

  temperature: any; // in °C
  pulse: any; // bpm
  respiration: any; // breaths per minute
  systolicBP: any; // mmHg
  diastolicBP: any; // mmHg
  oxygenSat: any; // %
  painScore: any; // 0-10
  recordedBy: string;
};

const VitalSigns = ({ admissionId }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);
  const { isLoading, createVitals, extractVitals, vitalsEntries } =
    useAdmissionStore();

  console.log(vitalsEntries, "vits");
  useEffect(() => {
    const vitasData = vitalsEntries.length > 0 ? vitalsEntries : [];

    // Transform API data to component format
    const transformedEntries = vitasData.map((vital, index) => ({
      id: vital.id,
      date: new Date(vital.attributes.created_at).toISOString().split("T")[0],
      time: new Date(vital.attributes.created_at).toLocaleTimeString("en-NG", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature: vital.attributes.temperature,
      pulse: vital.attributes.pulse,
      respiration: vital.attributes.respiration_rate,
      systolicBP: vital.attributes.systolic_bp,
      diastolicBP: vital.attributes.diastolic_bp,
      comment: vital.attributes.comment,
      oxygenSat: vital.attributes.oxygen_saturation,
      painScore: vital.attributes.pain_score,
      // comment: vital.attributes.comment,

      recordedBy: `${vital.attributes.recorded_by.first_name} ${vital.attributes.recorded_by.last_name}`,
    }));

    setEntries(transformedEntries);
  }, [vitalsEntries]);
  const [entries, setEntries] = useState<VitalSignsEntry[]>([]);

  const [formData, setFormData] = useState({
    temperature: "",
    pulse: "",
    respiration: "",
    systolicBP: "",
    diastolicBP: "",
    oxygenSat: "",
    painScore: "",
  });

  const resetForm = () => {
    setFormData({
      temperature: "",
      pulse: "",
      respiration: "",
      systolicBP: "",
      diastolicBP: "",
      oxygenSat: "",
      painScore: "",
    });
  };

  const openModal = (entry: any | null = null) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        temperature: entry.temperature.toString(),
        pulse: entry.pulse.toString(),
        respiration: entry.respiration.toString(),
        systolicBP: entry.systolicBP.toString(),
        diastolicBP: entry.diastolicBP.toString(),
        oxygenSat: entry.oxygenSat.toString(),
        painScore: entry.painScore.toString(),
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

  const handleSubmit = async () => {
    const newEntry = {
      admission_id: admissionId,
      temperature: formData.temperature,
      pulse: formData.pulse,
      respiration_rate: formData.respiration,
      systolic_bp: formData.systolicBP,
      diastolic_bp: formData.diastolicBP,
      oxygen_saturation: formData.oxygenSat,
      pain_score: formData.painScore,
    };

    const success = await createVitals(newEntry);

    if (editingEntry) {
      setEntries(
        entries.map((entry: any) =>
          entry.id === editingEntry.id
            ? {
                ...entry,
                temperature: Number(formData.temperature),
                pulse: Number(formData.pulse),
                respiration: Number(formData.respiration),
                systolicBP: Number(formData.systolicBP),
                diastolicBP: Number(formData.diastolicBP),
                oxygenSat: Number(formData.oxygenSat),
                painScore: Number(formData.painScore),
              }
            : entry
        )
      );
    } else {
      const now = new Date();
      setEntries([
        ...entries,
        {
          id: Math.random().toString(36).substr(2, 9), // Temporary ID
          date: now.toISOString().split("T")[0],
          time: now.toLocaleTimeString("en-NG", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
          temperature: Number(formData.temperature),
          pulse: Number(formData.pulse),
          respiration: Number(formData.respiration),
          systolicBP: Number(formData.systolicBP),
          diastolicBP: Number(formData.diastolicBP),
          oxygenSat: Number(formData.oxygenSat),
          painScore: Number(formData.painScore),
          recordedBy: "You", // Or get from user context if available
        },
      ]);
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
    entries.reduce((sum, entry) => sum + Number(entry.temperature || 0), 0) /
    (entries.length || 1);

  const avgPulse =
    entries.reduce((sum, entry) => sum + Number(entry.pulse || 0), 0) /
    (entries.length || 1);
  const avgRespiration =
    entries.reduce((sum, entry) => sum + Number(entry.respiration || 0), 0) /
    entries.length;
  const avgOxygenSat =
    entries.reduce((sum, entry) => sum + Number(entry.oxygenSat || 0), 0) /
    entries.length;

  // Last recorded vital signs
  const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null;
  const lastBP = lastEntry
    ? `${lastEntry.systolicBP}/${lastEntry.diastolicBP}`
    : "N/A";

  const role = useRole();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-md lg:text-2xl font-bold text-gray-900">
          VITAL SIGNS MONITORING
        </h1>
        {(role === "nurse" || role === "admin") && (
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md"
          >
            <Plus size={16} />
            Add Entry
          </button>
        )}
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
                    {entry.temperature}
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
                  {/* <td className="px-4 py-3">
                    <button
                      onClick={() => openModal(entry)}
                      className="text-primary p-1 rounded hover:bg-blue-50 transition-colors"
                      title="Edit entry"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td> */}
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
