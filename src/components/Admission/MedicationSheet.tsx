import { Edit2, Plus, X } from "lucide-react";
import { useState } from "react";

const MedicationSheet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);

  const [entries, setEntries] = useState<any>([
    {
      id: 1,
      date: "2020-07-21",
      time: "18:00",
      name: "Metformin",
      dosage: "10mg",
      route: "Oral",
      prescribedBy: " Doctor James",
      recordedBy: "Nurse Titi",
    },
    {
      id: 2,
      date: "2020-07-21",
      time: "18:00",
      name: "Insulin Glargine",
      dosage: "10mg",
      route: "Oral",
      prescribedBy: " Doctor James",
      recordedBy: "Adeola Becker",
    },
    {
      id: 3,
      date: "2020-07-21",
      time: "18:00",
      name: "Lisinopril",
      dosage: "10mg",
      route: "IV",
      prescribedBy: " Doctor James",
      recordedBy: "Adeola Becker",
    },
    {
      id: 4,
      date: "2020-07-21",
      time: "18:00",
      name: "Lisinopril",
      dosage: "10mg",
      route: "IV",
      prescribedBy: " Doctor James",
      recordedBy: "Adeola Becker",
    },
    {
      id: 5,
      date: "2025-06-02",
      time: "18:00",
      name: "Lisinopril",
      dosage: "10mg",
      route: "IV",
      prescribedBy: " Doctor James",
      recordedBy: "Adeola Becker",
    },
  ]);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    name: "",
    dosage: "",
    route: "",
    prescribedBy: " Doctor James",
    recordedBy: "",
  });

  const typeOptions = [
    "IV",
    "Oral",
    "IM",
    "Subcutaneous",
    "Topical",
    "Inhalation",
    "Sublingual",
    "Rectal",
    "Nasal",
    "Ophthalmic",
    "Otic",
  ];
  const resetForm = () => {
    setFormData({
      date: "",
      time: "",
      name: "",
      dosage: "",
      route: "",
      prescribedBy: " Doctor James",
      recordedBy: "",
    });
  };
  const openModal = (entry: any | null = null) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        date: entry.date,
        time: entry.time,
        name: entry.name.toString(),
        dosage: entry.dosage.toString(),
        route: entry.route,
        prescribedBy: entry.prescribedBy,
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
  const handleInputChange = (field: any, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Stats calculations
  const totalMedications = entries.length;

  // Unique medications count
  const uniqueMedications = new Set(entries.map((entry: any) => entry.name))
    .size;

  // Today's medications (using current date)
  const today = new Date().toISOString().split("T")[0];
  const todaysMedications = entries.filter(
    (entry: any) => entry.date === today
  ).length;

  // Most prescribed drug
  const medicationStats = entries.reduce((acc: any, entry: any) => {
    acc[entry.name] = (acc[entry.name] || 0) + 1;
    return acc;
  }, {});
  const mostPrescribedDrug =
    Object.keys(medicationStats).length > 0
      ? Object.keys(medicationStats).reduce((a, b) =>
          medicationStats[a] > medicationStats[b] ? a : b
        )
      : "None";

  // Most active prescriber
  const prescriberStats = entries.reduce((acc: any, entry: any) => {
    acc[entry.prescribedBy] = (acc[entry.prescribedBy] || 0) + 1;
    return acc;
  }, {});
  const mostActivePrescriber =
    Object.keys(prescriberStats).length > 0
      ? Object.keys(prescriberStats).reduce((a, b) =>
          prescriberStats[a] > prescriberStats[b] ? a : b
        )
      : "None";

  return (
    <div className=" space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">MEDICATION SHEET</h1>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md "
        >
          <Plus size={16} />
          Add Entry
        </button>
      </div>

      {/*  Summary Cards  */}
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 text-center">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm  ">
            <div className="text-sm text-gray-600">Total Medications</div>
            <div className="text-2xl font-bold text-blue-600">
              {totalMedications}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm ">
            <div className="text-sm text-gray-600">Unique Medications</div>
            <div className="text-2xl font-bold text-green-600">
              {uniqueMedications}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm ">
            <div className="text-sm text-gray-600">Today's Medications</div>
            <div className="text-2xl font-bold text-purple-600">
              {todaysMedications}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm ">
            <div className="text-sm text-gray-600">Most Prescribed Drug</div>
            <div className="text-xl font-bold text-gray-900">
              {mostPrescribedDrug}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm ">
            <div className="text-sm text-gray-600">Most Active Prescriber</div>
            <div className="text-xl  font-bold text-gray-900">
              {mostActivePrescriber}
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
                  Medication
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dosage
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prescribed By
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recorded By
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry: any, index: any) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-900">
                    {entry.date} {entry.time}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {entry.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {entry.dosage}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {entry.route}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {entry.prescribedBy}
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
                {/* Name*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      handleInputChange("ivInput", e.target.value)
                    }
                    placeholder="Drug name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/*Dosag */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) =>
                      handleInputChange("oralInput", e.target.value)
                    }
                    placeholder=""
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/*Route */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Route
                  </label>
                  <select
                    value={formData.route}
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
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  //   onClick={handleSubmit}
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

export default MedicationSheet;
