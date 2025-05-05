import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  User,
  // Loader,
  FileText,
  StickyNote,
  Download,
  Printer,
  Calendar,
  Clock,
  Loader2,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePatientStore } from "../../store/super-admin/usePatientStore";
import Button from "../../Shared/Button";
import EditPatientModal from "../../Shared/EditPatientModal";
import { useReportStore } from "../../store/super-admin/useReoprt";
import toast from "react-hot-toast";
import { useGlobalStore } from "../../store/super-admin/useGlobal";

import Loader from "../../Shared/Loader";
import MedicalTimeline from "../../Shared/MedicalTimeline";

const DoctorPatientDetails = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("note");
  const [note, setNote] = useState("");
  const [reportNote, setReportNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [mergedData, setMergedData] = useState<
    Array<{
      date: string;
      reports: any[];
      notes: any[];
      isExpanded: boolean;
    }>
  >([]);

  const { id } = useParams();
  const { selectedPatient, getPatientByIdDoc } = usePatientStore();
  const {
    createReport,
    createNote,
    getAllReport,
    allReports,
    getMedicalNote,
    allNotes,
    isLoading,
    isCreating,
    getPharmacyStocks,
    pharmacyStocks,
  } = useReportStore();
  const { getAllRoles, roles } = useGlobalStore();
  const [query, setQuery] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<
    {
      service_item_name: string;
      id: any;
      request_pharmacy_id: any;
      attributes: {
        amount?: any;
        name?: string;
      };
      quantity: number;
      item: {
        id: number;
        item: string;
      };
    }[]
  >([]);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setItemSearch(value);
  };

  const filteredItems = pharmacyStocks?.filter((stock) =>
    stock.service_item_name?.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const handleToggleItem = (item: any) => {
    const exists = selectedItems.find(
      (i) => i.request_pharmacy_id === item.request_pharmacy_id
    );
    if (!exists) {
      setSelectedItems((prev) => [
        ...prev,
        {
          ...item,
          quantity: 1,
        },
      ]);
      toast.success(`Added ${item.service_item_name || "item"} to selection`);
    } else {
      setSelectedItems((prev) =>
        prev.filter((i) => i.request_pharmacy_id !== item.request_pharmacy_id)
      );
      toast.success(
        `Removed ${item.service_item_name || "item"} from selection`
      );
    }
  };

  const isItemSelected = (request_pharmacy_id: any) =>
    selectedItems.some(
      (item) => item.request_pharmacy_id === request_pharmacy_id
    );

  const handleQuantityChange = (
    request_pharmacy_id: any,
    action: "increase" | "decrease"
  ) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) => {
        if (item.request_pharmacy_id === request_pharmacy_id) {
          const stock = pharmacyStocks?.find(
            (s) => s.request_pharmacy_id === request_pharmacy_id
          );
          const maxAvailable = stock?.requested_quantity || 0;

          if (action === "increase") {
            // Don't exceed available stock
            return {
              ...item,
              quantity:
                item.quantity < maxAvailable
                  ? item.quantity + 1
                  : item.quantity,
            };
          } else {
            // Don't go below 1
            return {
              ...item,
              quantity: item.quantity > 1 ? item.quantity - 1 : 1,
            };
          }
        }
        return item;
      })
    );
  };

  const handleQuantityInput = (request_pharmacy_id: any, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    setSelectedItems((prevItems) =>
      prevItems.map((item) => {
        if (item.request_pharmacy_id === request_pharmacy_id) {
          const stock = pharmacyStocks?.find(
            (s) => s.request_pharmacy_id === request_pharmacy_id
          );
          const maxAvailable = stock?.quantity || 0;

          // Ensure quantity is between 1 and max available
          const quantity = Math.min(Math.max(1, numValue), maxAvailable);
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  // Group data by date utility function
  const groupByDate = (data: any[]) => {
    return data.reduce((acc: { [key: string]: any[] }, item) => {
      const rawDate = new Date(item.attributes?.created_at);
      const date = rawDate.toLocaleDateString("en-CA"); // Format: yyyy-mm-dd (ISO format but local)
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});
  };

  useEffect(() => {
    if (allReports.length > 0 || allNotes.length > 0) {
      const processData = () => {
        const groupedReports = groupByDate(allReports);
        const groupedNotes = groupByDate(allNotes);

        const allDates = Array.from(
          new Set([
            ...Object.keys(groupedReports),
            ...Object.keys(groupedNotes),
          ])
        );

        return allDates
          .map((date) => ({
            date,
            reports: groupedReports[date] || [],
            notes: groupedNotes[date] || [],
            isExpanded: true, // Set initially expanded
          }))
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
      };

      setMergedData(processData());
    }
  }, [allReports, allNotes]);

  useEffect(() => {
    getAllRoles();
    getPharmacyStocks();
  }, [getAllRoles, getPharmacyStocks]);

  useEffect(() => {
    if (id) {
      getPatientByIdDoc(id);
      getAllReport(id);
      getMedicalNote(id, "doctor");
    }
  }, [id, getPatientByIdDoc, getAllReport, getMedicalNote]);

  const handleReportSubmit = async () => {
    if (!selectedDepartment) {
      toast.error("Please select a department");
      return;
    }

    const departmentId = roles[selectedDepartment]?.id;
    if (!departmentId) {
      return;
    }

    try {
      // Base report data structure
      let reportData: {
        patient_id: string;
        note: string;
        department_id: number;
        parent_id: null;
        file: File | null;
        status: string;
        role: string;
        pharmacy_stocks?: { id: any; quantity: number }[];
      } = {
        patient_id: id ?? "",
        note: reportNote,
        department_id: departmentId,
        parent_id: null,
        file,
        status: "pending",
        role: selectedDepartment,
      };

      // If sending to pharmacy, include the pharmacy_stocks array
      if (selectedDepartment === "pharmacist" && selectedItems.length > 0) {
        // Create pharmacy_stocks array with id and quantity for each selected item
        const pharmacyStocksArray = selectedItems.map((item) => ({
          id: item.request_pharmacy_id,
          quantity: item.quantity,
        }));

        // Add pharmacy_stocks array to the report data
        reportData = {
          ...reportData,
          pharmacy_stocks: pharmacyStocksArray,
        };
      }

      // Send a single report with all data
      const response = await createReport(reportData);

      if (response) {
        setReportNote("");
        setFile(null);
        setSelectedDepartment("");
        setSelectedItems([]);
        getAllReport(id);
        toast.success("Report sent successfully");
      }
    } catch (error) {
      // Error handling is done in the toast already
    }
  };

  const handleNoteSubmit = async () => {
    if (!note.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    try {
      const response = await createNote({
        note: note,
        patient_id: id ?? "",
      });

      if (response) {
        setNote("");
        getMedicalNote(id, "doctor");
      }
    } catch (error) {
      // Error handling is done in the toast already
    }
  };

  const toggleDateExpansion = (index: number) => {
    const updatedData = [...mergedData];
    updatedData[index].isExpanded = !updatedData[index].isExpanded;
    setMergedData(updatedData);
  };

  if (!selectedPatient) return <Loader />;

  const patient = selectedPatient.attributes;

  return (
    <div className="px-2 sm:px-0">
      <div className="bg-white rounded-lg custom-shadow mb-6">
        <div className="p-4 sm:p-6">
          {/*  */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
            {/* Back button */}
            <Link
              to="/dashboard/patients"
              className="flex items-center text-gray-600 hover:text-primary"
            >
              <ChevronLeft size={16} />
              <span className="ml-1">Patients</span>
            </Link>
          </div>

          {/* Patient information card */}
          <div className="grid gap-6">
            {/* Patient Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              <InfoRow label="First Name" value={patient.first_name} />
              <InfoRow label="Last Name" value={patient.last_name} />
              <InfoRow label="Patient ID" value={patient.card_id} />
              <InfoRow label="Age" value={patient.age?.toString()} />
              <InfoRow label="Gender" value={patient.gender} />
              <InfoRow label="Patient type" value={patient.patient_type} />
              <InfoRow
                label="CLinical Department"
                value={patient.clinical_department?.name}
              />
              <InfoRow label="Branch" value={patient.branch} />
              <InfoRow label="Occupation" value={patient.occupation} />
              <InfoRow label="Religion" value={patient.religion} />
              <InfoRow label="Phone" value={patient.phone_number} />
              <InfoRow
                className="sm:col-span-2 md:col-span-3 lg:col-span-4"
                label="Address"
                value={patient.address}
              />
            </div>
            {/*  */}
            <hr className="text-[#979797]" />
            {/* Next of Kin */}
            <div className="">
              <div className="">
                <h3 className="text-sm font-medium text-gray-800 mb-4">
                  Next of Kin
                </h3>
                {patient.next_of_kin?.map((kin: any, index: any) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4"
                  >
                    <InfoRow label="First Name" value={kin.name} />
                    <InfoRow label="Last Name" value={kin.last_name} />
                    <InfoRow label="Gender" value={kin.gender} />
                    <InfoRow label="Occupation" value={kin.occupation} />
                    <InfoRow label="Phone" value={kin.phone} />
                    <InfoRow label="Relationship" value={kin.relationship} />
                    <InfoRow
                      className="sm:col-span-2 md:col-span-3 lg:col-span-4"
                      label="Address"
                      value={kin.address}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report & Note */}
      <div className="bg-white rounded-lg custom-shadow mb-6 p-4 sm:p-6">
        {/* Tabs */}
        <div className="flex gap-6 mb-4 text-sm font-medium text-[#667185]">
          <button
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition ${
              activeTab === "note"
                ? "text-primary bg-[#F0F4FF]"
                : "hover:text-primary"
            }`}
            onClick={() => setActiveTab("note")}
          >
            <StickyNote size={16} />
            Add Doctor's Note
          </button>
          <button
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition ${
              activeTab === "report"
                ? "text-primary bg-[#F0F4FF]"
                : "hover:text-primary"
            }`}
            onClick={() => setActiveTab("report")}
          >
            <FileText size={16} />
            Add Doctor's Report
          </button>
        </div>

        {/* Content */}
        {activeTab === "note" && (
          <div className="space-y-4">
            <textarea
              rows={5}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter doctor's note..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleNoteSubmit}
              disabled={!!isCreating}
              className={`bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition flex items-center justify-center
                 ${isCreating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isCreating ? (
                <>
                  Adding
                  <Loader2 className="size-6 mr-2 animate-spin" />
                </>
              ) : (
                <>Add note</>
              )}
            </button>
          </div>
        )}
        {activeTab === "report" && (
          <div className="space-y-4">
            {/* Department Tabs */}
            <div className="flex gap-2 mb-4">
              {roles && Object.keys(roles).length > 0 ? (
                <>
                  {roles["pharmacist"] && (
                    <button
                      type="button"
                      onClick={() => setSelectedDepartment("pharmacist")}
                      className={`px-4 py-2 rounded-lg transition ${
                        selectedDepartment === "pharmacist"
                          ? "bg-primary text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      Pharmacy
                    </button>
                  )}
                  {roles["laboratory"] && (
                    <button
                      type="button"
                      onClick={() => setSelectedDepartment("laboratory")}
                      className={`px-4 py-2 rounded-lg transition ${
                        selectedDepartment === "laboratory"
                          ? "bg-primary text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      Laboratory
                    </button>
                  )}
                </>
              ) : (
                <div className="flex items-center text-gray-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading departments...
                </div>
              )}
            </div>

            {activeTab === "report" && selectedDepartment === "pharmacist" && (
              <div>
                <h1 className="text-lg font-medium mb-2">Pharmacy Store</h1>
                <h2 className="text-sm text-gray-600 mb-4">
                  Check and select drugs from pharmacy for the patient here
                </h2>

                {/* Custom Select Component */}
                <div className="relative mb-4">
                  <div
                    className="border border-[#D0D5DD] rounded-lg p-3 flex items-center justify-between cursor-pointer"
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                  >
                    <div className="flex-1">
                      {selectedItems.length === 0 ? (
                        <span className="text-gray-500">Select items...</span>
                      ) : (
                        <span>{selectedItems.length} item(s) selected</span>
                      )}
                    </div>
                    <div
                      className={`transform transition-transform ${
                        isSelectOpen ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        width="12"
                        height="8"
                        viewBox="0 0 12 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L6 6L11 1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                  {/*  */}
                  {isSelectOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-[#D0D5DD] rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      <div className="p-2 sticky top-0 bg-white border-b border-[#D0D5DD]">
                        <input
                          type="search"
                          name="itemSearch"
                          value={itemSearch}
                          onChange={handleChange}
                          placeholder="Search items..."
                          className="w-full border border-[#D0D5DD] p-2 rounded outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <ul className="divide-y">
                        {filteredItems?.length > 0 ? (
                          filteredItems.map((item) => (
                            <li
                              key={item.request_pharmacy_id}
                              onClick={() => handleToggleItem(item)}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                            >
                              <div>
                                <p className="font-medium">
                                  {item.service_item_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Available: {item.requested_quantity}
                                </p>
                              </div>
                              <div
                                className={`w-5 h-5 rounded border flex items-center justify-center ${
                                  isItemSelected(item.request_pharmacy_id)
                                    ? "bg-blue-500 border-blue-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {isItemSelected(item.request_pharmacy_id) && (
                                  <Check className="h-4 w-4 text-white" />
                                )}
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-3 text-gray-500">
                            No items found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Selected Items with Quantity Controls */}
                {selectedItems.length > 0 && (
                  <div className="mt-4 border border-[#D0D5DD] rounded-lg p-4">
                    <h3 className="font-medium mb-3">Selected Items</h3>
                    <ul className="divide-y">
                      {selectedItems.map((item) => {
                        const stock = pharmacyStocks?.find(
                          (s) =>
                            s.request_pharmacy_id === item.request_pharmacy_id
                        );
                        const maxQuantity = stock?.requested_quantity || 0;

                        return (
                          <li
                            key={item.request_pharmacy_id}
                            className="py-3 flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium">
                                {item.service_item_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {maxQuantity} available
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.request_pharmacy_id,
                                    "decrease"
                                  )
                                }
                                className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                max={maxQuantity}
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityInput(
                                    item.request_pharmacy_id,
                                    e.target.value
                                  )
                                }
                                className="w-12 text-center border border-gray-300 rounded-md p-1"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.request_pharmacy_id,
                                    "increase"
                                  )
                                }
                                className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                                disabled={item.quantity >= maxQuantity}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Report Textarea */}
            <textarea
              rows={5}
              value={reportNote}
              onChange={(e) => setReportNote(e.target.value)}
              placeholder="Enter doctor's report..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary"
            />

            {/* File Input */}
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
            />

            {/* Submit Button */}
            <button
              onClick={handleReportSubmit}
              className={`bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition flex items-center justify-center
                ${
                  isCreating || !selectedDepartment
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              disabled={isCreating || !selectedDepartment}
            >
              {isCreating ? (
                <>
                  Adding
                  <Loader2 className="size-6 mr-2 animate-spin" />
                </>
              ) : (
                `Send Report to ${
                  selectedDepartment
                    ? selectedDepartment === "pharmacist"
                      ? "Pharmacy"
                      : "Laboratory"
                    : "..."
                }`
              )}
            </button>
          </div>
        )}
      </div>

      {/* Merged EMR Timeline */}
      {id && (
        <MedicalTimeline
          patientId={id}
          patient={patient}
          showDownloadCompleteButton={false}
        />
      )}

      <EditPatientModal
        isLoading={false}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        patientData={patient}
        onSave={function (data: any): void {
          throw new Error("Function not implemented.");
        }}
      />
    </div>
  );
};

// Reusable InfoRow Component
const InfoRow = ({ label, value, className = "" }: any) => (
  <div className={className}>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium">{value || "N/A"}</p>
  </div>
);

export default DoctorPatientDetails;
