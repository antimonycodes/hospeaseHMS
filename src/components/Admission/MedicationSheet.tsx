import { Edit2, Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAdmissionStore } from "../../store/super-admin/useAdmissionStore";
import { useDoctorStore } from "../../store/super-admin/useDoctorStore";
import { useFinanceStore } from "../../store/staff/useFinanceStore";
import { useRole } from "../../hooks/useRole";
import { useReportStore } from "../../store/super-admin/useReoprt";
import Select from "react-select";

const MedicationSheet = ({ admissionId }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);
  // const { isLoading, createMedication } = useAdmissionStore();
  const { getAllDoctors, doctors } = useFinanceStore();
  const { getPharmacyStocks, pharmacyStocks } = useReportStore();
  const baseEndpoint = "/medical-reports/all-doctors";

  useEffect(() => {
    getAllDoctors();
    getPharmacyStocks();
  }, [getAllDoctors, getPharmacyStocks]);

  console.log(pharmacyStocks, "pharmacyStocks");

  const {
    isLoading,
    createMedication,
    medicationEntries,
    extractMedicationHistory,
  } = useAdmissionStore();

  useEffect(() => {
    const medicationData =
      medicationEntries.length > 0 ? medicationEntries : [];

    // Transform API data to component format
    const transformedEntries = medicationData.map((medication, index) => ({
      id: medication.id,
      date: new Date(medication.attributes.created_at)
        .toISOString()
        .split("T")[0],
      time: new Date(medication.attributes.created_at).toLocaleTimeString(
        "en-NG",
        {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
      name: medication.attributes.drug_name,
      dosage: medication.attributes.dosage,
      route: medication.attributes.route,
      prescribedBy: `${medication.attributes.recorded_by.first_name} ${medication.attributes.recorded_by.last_name}`,
      recordedBy: `${medication.attributes.recorded_by.first_name} ${medication.attributes.recorded_by.last_name}`,
    }));

    setEntries(transformedEntries);
  }, [medicationEntries]);

  // console.log(medicationEntries, "medd");

  const [entries, setEntries] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    route: "",
    prescribedBy: "",
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
      name: "",
      dosage: "",
      route: "",
      prescribedBy: "",
    });
  };

  const openModal = (entry: any | null = null) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        name: entry.name.toString(),
        dosage: entry.dosage.toString(),
        route: entry.route,
        prescribedBy: entry.prescribedBy,
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
  const medicationOptions = pharmacyStocks.map((stock: any) => ({
    value: stock?.service_item_name,
    label: stock?.service_item_name,
  }));

  // Update the handleInputChange to handle Select changes
  const handleInputChange = (field: any, value: any) => {
    // Special handling for Select component
    if (field === "name" && value && value.value) {
      setFormData((prev) => ({
        ...prev,
        [field]: value.value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.dosage ||
        !formData.route ||
        !formData.prescribedBy
      ) {
        alert("Please fill in all required fields");
        return;
      }

      const medicationData = {
        admission_id: admissionId,
        drug_name: formData.name,
        dosage: formData.dosage,
        route: formData.route,
        prescribed_by: formData.prescribedBy, // This should be the user_id
      };

      const success = await createMedication(medicationData);

      if (success) {
        // Add to local state for immediate UI update
        const newEntry = {
          id: Date.now(), // Temporary ID
          ...formData,
          prescribedBy: getDoctorName(formData.prescribedBy), // Display name for UI
        };

        if (editingEntry) {
          setEntries(
            entries.map((entry: any) =>
              entry.id === editingEntry.id
                ? { ...newEntry, id: editingEntry.id }
                : entry
            )
          );
        } else {
          setEntries([...entries, newEntry]);
        }

        closeModal();
      }
    } catch (error) {
      console.error("Error creating medication:", error);
    }
  };

  // Helper function to get doctor's display name
  const getDoctorName = (userId: string) => {
    const doctor = doctors.find(
      (doc: any) => doc.attributes.user_id.toString() === userId
    );
    return doctor
      ? `${doctor.attributes.first_name} ${doctor.attributes.last_name}`
      : "Unknown Doctor";
  };

  // Stats calculations
  const totalMedications = entries.length;
  const uniqueMedications = new Set(entries.map((entry: any) => entry.name))
    .size;
  const today = new Date().toISOString().split("T")[0];
  const todaysMedications = entries.filter(
    (entry: any) => entry.date === today
  ).length;

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

  const role = useRole();

  return (
    <div className=" space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-md md:text-2xl font-bold text-gray-900">
          MEDICATION SHEET
        </h1>
        {(role === "nurse" || role === "admin" || role === "matron") && (
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md "
          >
            <Plus size={16} />
            Add Entry
          </button>
        )}
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
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry: any, index: any) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 text-nowrap py-3 text-sm text-gray-900">
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
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medication Name <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={medicationOptions}
                    value={
                      formData.name
                        ? {
                            value: formData.name,
                            label: formData.name,
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      handleInputChange("name", selectedOption)
                    }
                    placeholder="Search medication..."
                    isSearchable
                    required
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        minHeight: "42px",
                        borderColor: "#d1d5db",
                        "&:hover": {
                          borderColor: "#d1d5db",
                        },
                      }),
                    }}
                  />
                </div>

                {/* Dosage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dosage <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) =>
                      handleInputChange("dosage", e.target.value)
                    }
                    placeholder="e.g., 10mg, 2 tablets"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Route */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Route <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.route}
                    onChange={(e) => handleInputChange("route", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select route</option>
                    {typeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prescribed By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prescribed By <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.prescribedBy}
                    onChange={(e) =>
                      handleInputChange("prescribedBy", e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select doctor</option>
                    {doctors.map((doctor: any) => (
                      <option key={doctor.id} value={doctor.attributes.user_id}>
                        {doctor.attributes.first_name}{" "}
                        {doctor.attributes.last_name}
                      </option>
                    ))}
                  </select>
                </div>
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
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : editingEntry ? (
                    "Update Entry"
                  ) : (
                    "Add Entry"
                  )}
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
