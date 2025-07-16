// import { Edit2, Loader2, Plus, X } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useAdmissionStore } from "../../store/super-admin/useAdmissionStore";
// import { useDoctorStore } from "../../store/super-admin/useDoctorStore";
// import { useFinanceStore } from "../../store/staff/useFinanceStore";
// import { useRole } from "../../hooks/useRole";
// import { useReportStore } from "../../store/super-admin/useReoprt";
// import Select from "react-select";

// const MedicationSheet = ({ admissionId }: any) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingEntry, setEditingEntry] = useState<any | null>(null);
//   // const { isLoading, createMedication } = useAdmissionStore();
//   const { getAllDoctors, doctors } = useFinanceStore();
//   const { getPharmacyStocks, pharmacyStocks } = useReportStore();
//   const baseEndpoint = "/medical-reports/all-doctors";

//   useEffect(() => {
//     getAllDoctors();
//     getPharmacyStocks();
//   }, [getAllDoctors, getPharmacyStocks]);

//   console.log(pharmacyStocks, "pharmacyStocks");

//   const {
//     isLoading,
//     createMedication,
//     medicationEntries,
//     extractMedicationHistory,
//   } = useAdmissionStore();

//   useEffect(() => {
//     const medicationData =
//       medicationEntries.length > 0 ? medicationEntries : [];

//     // Transform API data to component format
//     const transformedEntries = medicationData.map((medication, index) => ({
//       id: medication.id,

//       time: medication.attributes.created_at,
//       name: medication.attributes.drug_name,
//       dosage: medication.attributes.dosage,
//       route: medication.attributes.route,
//       prescribedBy: `${medication.attributes.recorded_by.first_name} ${medication.attributes.recorded_by.last_name}`,
//       recordedBy: `${medication.attributes.recorded_by.first_name} ${medication.attributes.recorded_by.last_name}`,
//     }));

//     setEntries(transformedEntries);
//   }, [medicationEntries]);

//   // console.log(medicationEntries, "medd");

//   const [entries, setEntries] = useState<any[]>([]);

//   const [formData, setFormData] = useState({
//     manual_time_stamp: "",
//     name: "",
//     dosage: "",
//     route: "",
//     prescribedBy: "",
//   });

//   const typeOptions = [
//     "IV",
//     "Oral",
//     "IM",
//     "Subcutaneous",
//     "Topical",
//     "Inhalation",
//     "Sublingual",
//     "Rectal",
//     "Nasal",
//     "Ophthalmic",
//     "Otic",
//   ];

//   const resetForm = () => {
//     setFormData({
//       manual_time_stamp: "",

//       name: "",
//       dosage: "",
//       route: "",
//       prescribedBy: "",
//     });
//   };

//   const openModal = (entry: any | null = null) => {
//     if (entry) {
//       setEditingEntry(entry);
//       setFormData({
//         manual_time_stamp: entry.created_at,
//         name: entry.name.toString(),
//         dosage: entry.dosage.toString(),
//         route: entry.route,
//         prescribedBy: entry.prescribedBy,
//       });
//     } else {
//       setEditingEntry(null);
//       resetForm();
//     }
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setEditingEntry(null);
//     resetForm();
//   };
//   const medicationOptions = pharmacyStocks.map((stock: any) => ({
//     value: stock?.service_item_name,
//     label: stock?.service_item_name,
//   }));

//   // Update the handleInputChange to handle Select changes
//   const handleInputChange = (field: any, value: any) => {
//     // Special handling for Select component
//     if (field === "name" && value && value.value) {
//       setFormData((prev) => ({
//         ...prev,
//         [field]: value.value,
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [field]: value,
//       }));
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       // Validate required fields
//       if (
//         !formData.name ||
//         !formData.dosage ||
//         !formData.route ||
//         !formData.prescribedBy
//       ) {
//         toast("Please fill in all required fields");
//         return;
//       }

//       const medicationData = {
//         manual_time_stamp: formData.manual_time_stamp,
//         admission_id: admissionId,
//         drug_name: formData.name,
//         dosage: formData.dosage,
//         route: formData.route,
//         prescribed_by: formData.prescribedBy, // This should be the user_id
//       };

//       const success = await createMedication(medicationData);

//       if (success) {
//         // Add to local state for immediate UI update
//         const newEntry = {
//           id: Date.now(), // Temporary ID
//           ...formData,
//           prescribedBy: getDoctorName(formData.prescribedBy), // Display name for UI
//         };

//         if (editingEntry) {
//           setEntries(
//             entries.map((entry: any) =>
//               entry.id === editingEntry.id
//                 ? { ...newEntry, id: editingEntry.id }
//                 : entry
//             )
//           );
//         } else {
//           setEntries([...entries, newEntry]);
//         }

//         closeModal();
//       }
//     } catch (error) {
//       console.error("Error creating medication:", error);
//     }
//   };

//   // Helper function to get doctor's display name
//   const getDoctorName = (userId: string) => {
//     const doctor = doctors.find(
//       (doc: any) => doc.attributes.user_id.toString() === userId
//     );
//     return doctor
//       ? `${doctor.attributes.first_name} ${doctor.attributes.last_name}`
//       : "Unknown Doctor";
//   };

//   // Stats calculations
//   const totalMedications = entries.length;
//   const uniqueMedications = new Set(entries.map((entry: any) => entry.name))
//     .size;
//   const today = new Date().toISOString().split("T")[0];
//   const todaysMedications = entries.filter(
//     (entry: any) => entry.date === today
//   ).length;

//   const medicationStats = entries.reduce((acc: any, entry: any) => {
//     acc[entry.name] = (acc[entry.name] || 0) + 1;
//     return acc;
//   }, {});
//   const mostPrescribedDrug =
//     Object.keys(medicationStats).length > 0
//       ? Object.keys(medicationStats).reduce((a, b) =>
//           medicationStats[a] > medicationStats[b] ? a : b
//         )
//       : "None";

//   const prescriberStats = entries.reduce((acc: any, entry: any) => {
//     acc[entry.prescribedBy] = (acc[entry.prescribedBy] || 0) + 1;
//     return acc;
//   }, {});
//   const mostActivePrescriber =
//     Object.keys(prescriberStats).length > 0
//       ? Object.keys(prescriberStats).reduce((a, b) =>
//           prescriberStats[a] > prescriberStats[b] ? a : b
//         )
//       : "None";

//   const role = useRole();

//   return (
//     <div className=" space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-md md:text-2xl font-bold text-gray-900">
//           MEDICATION SHEET
//         </h1>
//         {(role === "nurse" || role === "admin" || role === "matron") && (
//           <button
//             onClick={() => openModal()}
//             className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md "
//           >
//             <Plus size={16} />
//             Add Entry
//           </button>
//         )}
//       </div>

//       {/*  Summary Cards  */}
//       <div className="">
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 text-center">
//           <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm  ">
//             <div className="text-sm text-gray-600">Total Medications</div>
//             <div className="text-2xl font-bold text-blue-600">
//               {totalMedications}
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm ">
//             <div className="text-sm text-gray-600">Unique Medications</div>
//             <div className="text-2xl font-bold text-green-600">
//               {uniqueMedications}
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm ">
//             <div className="text-sm text-gray-600">Today's Medications</div>
//             <div className="text-2xl font-bold text-purple-600">
//               {todaysMedications}
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm ">
//             <div className="text-sm text-gray-600">Most Prescribed Drug</div>
//             <div className="text-xl font-bold text-gray-900">
//               {mostPrescribedDrug}
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm ">
//             <div className="text-sm text-gray-600">Most Active Prescriber</div>
//             <div className="text-xl  font-bold text-gray-900">
//               {mostActivePrescriber}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   S/N
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date & Time
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Medication
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Dosage
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Route
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Prescribed By
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Recorded By
//                 </th>
//                 {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th> */}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {entries.map((entry: any, index: any) => (
//                 <tr key={entry.id} className="hover:bg-gray-50">
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {index + 1}
//                   </td>
//                   <td className="px-4 text-nowrap py-3 text-sm text-gray-900">
//                     {entry.time}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {entry.name}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {entry.dosage}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {entry.route}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {entry.prescribedBy}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {entry.recordedBy}
//                   </td>
//                   {/* <td className="px-4 py-3">
//                     <button
//                       onClick={() => openModal(entry)}
//                       className="text-primary p-1 rounded hover:bg-blue-50 transition-colors"
//                       title="Edit entry"
//                     >
//                       <Edit2 size={16} />
//                     </button>
//                   </td> */}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg custom-shadow w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between p-6 border-b border-gray-300">
//               <h2 className="text-xl font-bold text-gray-900">
//                 {editingEntry ? "Edit Entry" : "Add New Entry"}
//               </h2>
//               <button
//                 onClick={closeModal}
//                 className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Time */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Date & Time
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.manual_time_stamp}
//                     onChange={(e) =>
//                       handleInputChange("manual_time_stamp", e.target.value)
//                     }
//                     // placeholder="0"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//                 {/* Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Medication Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => handleInputChange("name", e.target.value)}
//                     placeholder="e.g., Paracetamol, Ibuprofen"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   />
//                   {/* <Select
//                     options={medicationOptions}
//                     value={
//                       formData.name
//                         ? {
//                             value: formData.name,
//                             label: formData.name,
//                           }
//                         : null
//                     }
//                     onChange={(selectedOption) =>
//                       handleInputChange("name", selectedOption)
//                     }
//                     placeholder="Search medication..."
//                     isSearchable
//                     required
//                     className="react-select-container"
//                     classNamePrefix="react-select"
//                     styles={{
//                       control: (provided) => ({
//                         ...provided,
//                         minHeight: "42px",
//                         borderColor: "#d1d5db",
//                         "&:hover": {
//                           borderColor: "#d1d5db",
//                         },
//                       }),
//                     }}
//                   /> */}
//                 </div>

//                 {/* Dosage */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Dosage <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.dosage}
//                     onChange={(e) =>
//                       handleInputChange("dosage", e.target.value)
//                     }
//                     placeholder="e.g., 10mg, 2 tablets"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   />
//                 </div>

//                 {/* Route */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Route <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.route}
//                     onChange={(e) => handleInputChange("route", e.target.value)}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Select route</option>
//                     {typeOptions.map((option) => (
//                       <option key={option} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Prescribed By */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Prescribed By <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.prescribedBy}
//                     onChange={(e) =>
//                       handleInputChange("prescribedBy", e.target.value)
//                     }
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Select doctor</option>
//                     {doctors.map((doctor: any) => (
//                       <option key={doctor.id} value={doctor.attributes.user_id}>
//                         {doctor.attributes.first_name}{" "}
//                         {doctor.attributes.last_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Submit Buttons */}
//               <div className="flex items-center justify-end gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   disabled={isLoading}
//                   className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : editingEntry ? (
//                     "Update Entry"
//                   ) : (
//                     "Add Entry"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MedicationSheet;
import {
  Edit2,
  Loader2,
  Plus,
  X,
  PlusCircle,
  Trash2,
  Copy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAdmissionStore } from "../../store/super-admin/useAdmissionStore";
import { useDoctorStore } from "../../store/super-admin/useDoctorStore";
import { useFinanceStore } from "../../store/staff/useFinanceStore";
import { useRole } from "../../hooks/useRole";
import { useReportStore } from "../../store/super-admin/useReoprt";
import Select from "react-select";
import toast from "react-hot-toast";

const MedicationSheet = ({ admissionId }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);
  const [uploadMode, setUploadMode] = useState<"single" | "multiple">("single");
  const { getAllDoctors, doctors } = useFinanceStore();
  const { getPharmacyStocks, pharmacyStocks } = useReportStore();
  const baseEndpoint = "/medical-reports/all-doctors";

  useEffect(() => {
    getAllDoctors();
    getPharmacyStocks();
  }, [getAllDoctors, getPharmacyStocks]);

  const {
    isLoading,
    createMedication,
    medicationEntries,
    extractMedicationHistory,
  } = useAdmissionStore();

  useEffect(() => {
    const medicationData =
      medicationEntries.length > 0 ? medicationEntries : [];

    const transformedEntries = medicationData.map((medication, index) => ({
      id: medication.id,
      time: medication.attributes.created_at,
      name: medication.attributes.drug_name,
      dosage: medication.attributes.dosage,
      route: medication.attributes.route,
      prescribedBy: `${medication.attributes.recorded_by.first_name} ${medication.attributes.recorded_by.last_name}`,
      recordedBy: `${medication.attributes.recorded_by.first_name} ${medication.attributes.recorded_by.last_name}`,
    }));

    setEntries(transformedEntries);
  }, [medicationEntries]);

  const [entries, setEntries] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Single upload form data
  const [formData, setFormData] = useState({
    manual_time_stamp: "",
    name: "",
    dosage: "",
    route: "",
    prescribedBy: "",
  });

  // Multiple upload form data
  const [multipleFormData, setMultipleFormData] = useState({
    manual_time_stamp: "",
    prescribedBy: "",
    medications: [
      {
        id: 1,
        name: "",
        dosage: "",
        route: "",
      },
    ],
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
      manual_time_stamp: "",
      name: "",
      dosage: "",
      route: "",
      prescribedBy: "",
    });
    setMultipleFormData({
      manual_time_stamp: "",
      prescribedBy: "",
      medications: [
        {
          id: 1,
          name: "",
          dosage: "",
          route: "",
        },
      ],
    });
  };

  const openModal = (entry: any | null = null) => {
    if (entry) {
      setEditingEntry(entry);
      setUploadMode("single");
      setFormData({
        manual_time_stamp: entry.created_at,
        name: entry.name.toString(),
        dosage: entry.dosage.toString(),
        route: entry.route,
        prescribedBy: entry.prescribedBy,
      });
    } else {
      setEditingEntry(null);
      setUploadMode("single");
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
    setUploadMode("single");
    resetForm();
  };

  const medicationOptions = pharmacyStocks.map((stock: any) => ({
    value: stock?.service_item_name,
    label: stock?.service_item_name,
  }));

  // Single upload handlers
  const handleInputChange = (field: any, value: any) => {
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

  // Multiple upload handlers
  const handleMultipleInputChange = (field: string, value: any) => {
    setMultipleFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMedicationChange = (index: number, field: string, value: any) => {
    const updatedMedications = [...multipleFormData.medications];
    if (field === "name" && value && value.value) {
      updatedMedications[index] = {
        ...updatedMedications[index],
        [field]: value.value,
      };
    } else {
      updatedMedications[index] = {
        ...updatedMedications[index],
        [field]: value,
      };
    }
    setMultipleFormData((prev) => ({
      ...prev,
      medications: updatedMedications,
    }));
  };

  const addMedication = () => {
    const newId =
      Math.max(...multipleFormData.medications.map((m) => m.id)) + 1;
    setMultipleFormData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          id: newId,
          name: "",
          dosage: "",
          route: "",
        },
      ],
    }));
  };

  const removeMedication = (id: number) => {
    if (multipleFormData.medications.length > 1) {
      setMultipleFormData((prev) => ({
        ...prev,
        medications: prev.medications.filter((med) => med.id !== id),
      }));
    }
  };

  const duplicateMedication = (index: number) => {
    const medicationToDuplicate = multipleFormData.medications[index];
    const newId =
      Math.max(...multipleFormData.medications.map((m) => m.id)) + 1;
    const duplicatedMedication = {
      ...medicationToDuplicate,
      id: newId,
    };

    setMultipleFormData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications.slice(0, index + 1),
        duplicatedMedication,
        ...prev.medications.slice(index + 1),
      ],
    }));
  };

  const handleSingleSubmit = async () => {
    try {
      if (
        !formData.name ||
        !formData.dosage ||
        !formData.route ||
        !formData.prescribedBy
      ) {
        toast("Please fill in all required fields");
        return;
      }

      const medicationData = {
        manual_time_stamp: formData.manual_time_stamp,
        admission_id: admissionId,
        drug_name: formData.name,
        dosage: formData.dosage,
        route: formData.route,
        prescribed_by: formData.prescribedBy,
      };

      const success = await createMedication(medicationData);

      if (success) {
        const newEntry = {
          id: Date.now(),
          ...formData,
          prescribedBy: getDoctorName(formData.prescribedBy),
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

  const handleMultipleSubmit = async () => {
    try {
      // Validate required fields
      if (!multipleFormData.prescribedBy) {
        toast("Please select a prescriber");
        return;
      }

      const incompleteMedications = multipleFormData.medications.filter(
        (med) => !med.name || !med.dosage || !med.route
      );

      if (incompleteMedications.length > 0) {
        toast(
          "Please fill in all medication details (name, dosage, and route)"
        );
        return;
      }

      setIsSubmitting(true);

      // Submit each medication
      const results = await Promise.allSettled(
        multipleFormData.medications.map(async (medication) => {
          const medicationData = {
            manual_time_stamp: multipleFormData.manual_time_stamp,
            admission_id: admissionId,
            drug_name: medication.name,
            dosage: medication.dosage,
            route: medication.route,
            prescribed_by: multipleFormData.prescribedBy,
          };

          return await createMedication(medicationData);
        })
      );

      const successfulSubmissions = results.filter(
        (result) => result.status === "fulfilled" && result.value
      ).length;

      const failedSubmissions = results.length - successfulSubmissions;

      if (successfulSubmissions > 0) {
        // Update local state for successful submissions
        const newEntries = multipleFormData.medications.map((med, index) => ({
          id: Date.now() + index,
          time: multipleFormData.manual_time_stamp,
          name: med.name,
          dosage: med.dosage,
          route: med.route,
          prescribedBy: getDoctorName(multipleFormData.prescribedBy),
          recordedBy: getDoctorName(multipleFormData.prescribedBy),
        }));

        setEntries([...entries, ...newEntries]);
      }

      if (failedSubmissions > 0) {
        toast(
          `${successfulSubmissions} medications added successfully. ${failedSubmissions} failed to add.`
        );
      } else {
        toast(`All ${successfulSubmissions} medications added successfully!`);
      }

      if (successfulSubmissions > 0) {
        closeModal();
      }
    } catch (error) {
      console.error("Error creating multiple medications:", error);
      toast("An error occurred while adding medications. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-md md:text-2xl font-bold text-gray-900">
          MEDICATION SHEET
        </h1>
        {(role === "nurse" || role === "admin" || role === "matron") && (
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            Add Medication
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 text-center">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-600">Total Medications</div>
          <div className="text-2xl font-bold text-blue-600">
            {totalMedications}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-600">Unique Medications</div>
          <div className="text-2xl font-bold text-green-600">
            {uniqueMedications}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-600">Today's Medications</div>
          <div className="text-2xl font-bold text-purple-600">
            {todaysMedications}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-600">Most Prescribed Drug</div>
          <div className="text-xl font-bold text-gray-900">
            {mostPrescribedDrug}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-600">Most Active Prescriber</div>
          <div className="text-xl font-bold text-gray-900">
            {mostActivePrescriber}
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry: any, index: any) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 text-nowrap py-3 text-sm text-gray-900">
                    {entry.time}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingEntry ? "Edit Medication" : "Add Medication"}
                </h2>
                {!editingEntry && (
                  <div className="flex bg-white rounded-lg p-1 shadow-sm border">
                    <button
                      onClick={() => setUploadMode("single")}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        uploadMode === "single"
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Single
                    </button>
                    <button
                      onClick={() => setUploadMode("multiple")}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        uploadMode === "multiple"
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Multiple
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {uploadMode === "single" ? (
                // Single Upload Form
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date & Time
                      </label>
                      <input
                        type="text"
                        value={formData.manual_time_stamp}
                        onChange={(e) =>
                          handleInputChange("manual_time_stamp", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Medication Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="e.g., Paracetamol, Ibuprofen"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Route <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.route}
                        onChange={(e) =>
                          handleInputChange("route", e.target.value)
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select route</option>
                        {typeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prescribed By <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.prescribedBy}
                        onChange={(e) =>
                          handleInputChange("prescribedBy", e.target.value)
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select doctor</option>
                        {doctors.map((doctor: any) => (
                          <option
                            key={doctor.id}
                            value={doctor.attributes.user_id}
                          >
                            {doctor.attributes.first_name}{" "}
                            {doctor.attributes.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSingleSubmit}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      {editingEntry ? "Update Medication" : "Add Medication"}
                    </button>
                  </div>
                </div>
              ) : (
                // Multiple Upload Form
                <div className="space-y-6">
                  {/* Common Fields */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Common Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date & Time
                        </label>
                        <input
                          type="text"
                          value={multipleFormData.manual_time_stamp}
                          onChange={(e) =>
                            handleMultipleInputChange(
                              "manual_time_stamp",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prescribed By <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={multipleFormData.prescribedBy}
                          onChange={(e) =>
                            handleMultipleInputChange(
                              "prescribedBy",
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option value="">Select doctor</option>
                          {doctors.map((doctor: any) => (
                            <option
                              key={doctor.id}
                              value={doctor.attributes.user_id}
                            >
                              {doctor.attributes.first_name}{" "}
                              {doctor.attributes.last_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Medications List */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Medications
                      </h3>
                      <button
                        onClick={addMedication}
                        className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
                      >
                        <PlusCircle size={16} />
                        Add Medication
                      </button>
                    </div>

                    <div className="space-y-4">
                      {multipleFormData.medications.map((medication, index) => (
                        <div
                          key={medication.id}
                          className="bg-white border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">
                              Medication {index + 1}
                            </h4>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => duplicateMedication(index)}
                                className="p-1 text-gray-500 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"
                                title="Duplicate this medication"
                              >
                                <Copy size={16} />
                              </button>
                              {multipleFormData.medications.length > 1 && (
                                <button
                                  onClick={() =>
                                    removeMedication(medication.id)
                                  }
                                  className="p-1 text-gray-500 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                                  title="Remove this medication"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={medication.name}
                                onChange={(e) =>
                                  handleMedicationChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., Paracetamol"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Dosage <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={medication.dosage}
                                onChange={(e) =>
                                  handleMedicationChange(
                                    index,
                                    "dosage",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., 10mg"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Route <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={medication.route}
                                onChange={(e) =>
                                  handleMedicationChange(
                                    index,
                                    "route",
                                    e.target.value
                                  )
                                }
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              >
                                <option value="">Select route</option>
                                {typeOptions.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-700">
                        Total medications to add:{" "}
                        <span className="font-semibold">
                          {multipleFormData.medications.length}
                        </span>
                      </span>
                      <span className="text-blue-700">
                        Prescribed by:{" "}
                        <span className="font-semibold">
                          {multipleFormData.prescribedBy
                            ? getDoctorName(multipleFormData.prescribedBy)
                            : "Not selected"}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleMultipleSubmit}
                      disabled={isSubmitting}
                      className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Adding Medications...
                        </>
                      ) : (
                        <>
                          <Plus size={16} />
                          Add {multipleFormData.medications.length} Medication
                          {multipleFormData.medications.length > 1 ? "s" : ""}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationSheet;
