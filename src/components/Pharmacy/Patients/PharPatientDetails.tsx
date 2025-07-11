import { useEffect, useState } from "react";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import { useParams, useNavigate } from "react-router-dom";
import { useReportStore } from "../../../store/super-admin/useReoprt";
import Loader from "../../../Shared/Loader";
import { Check, Loader2, Minus, Plus, Trash2, X } from "lucide-react";
import PharmacyMedicalTimeline from "./PharmacyMedicalTimeline";
import toast from "react-hot-toast";
import Button from "../../../Shared/Button";

const PharPatientDetails = () => {
  const { patientId, caseId } = useParams();
  const { getPharPatientById } = usePatientStore();
  const {
    isReportLoading,
    getSingleReport,
    singleReport,
    respondToReport,
    isResponding,
    getPharmacyStocks,
    pharmacyStocks,
    deptCreateReport,
  } = useReportStore();
  const selectedPatient = usePatientStore((state) => state.selectedPatient);
  const isLoading = usePatientStore((state) => state.isLoading);

  // Report states
  const [reportText, setReportText] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [file, setFile] = useState<File | null>(null);
  const [departmentId, setDepartmentId] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prescription states
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<
    {
      requested_quantity: string | number | undefined;
      service_item_price: string;
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
  const [prescriptionItems, setPrescriptionItems] = useState<{
    [key: string]: { dosage: string; quantity: number };
  }>({});
  const [itemSearch, setItemSearch] = useState("");

  // Calculate total cost
  const totalCost = selectedItems.reduce((total, item) => {
    const price = parseFloat(item.service_item_price) || 0;
    return total + price * item.quantity;
  }, 0);

  // Get user department ID
  useEffect(() => {
    const userInfoString = localStorage.getItem("user-info");
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        const id = userInfo?.attributes?.department?.id ?? null;
        setDepartmentId(id);
      } catch (error) {
        console.error("Error parsing user-info from localStorage:", error);
      }
    }
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    getPharmacyStocks();
    if (patientId) {
      getPharPatientById(patientId);
      getSingleReport(patientId);
    }
  }, [
    patientId,
    getPharPatientById,
    getSingleReport,
    caseId,
    getPharmacyStocks,
  ]);

  const patient = selectedPatient?.attributes;

  // Handle prescription change
  const handlePrescriptionChange = (id: string, field: string, value: any) => {
    setPrescriptionItems((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { dosage: "", quantity: 1 }),
        [field]: value,
      },
    }));
  };

  // Filter pharmacy items
  const filteredItems = pharmacyStocks?.filter((stock) =>
    stock.service_item_name?.toLowerCase().includes(itemSearch.toLowerCase())
  );

  // Toggle item selection
  const handleToggleItem = (item: any) => {
    const exists = selectedItems.find(
      (i) => i.request_pharmacy_id === item.request_pharmacy_id
    );
    if (!exists) {
      setSelectedItems((prev) => [...prev, { ...item, quantity: 1 }]);
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

  // Check if item is selected
  const isItemSelected = (request_pharmacy_id: any) =>
    selectedItems.some(
      (item) => item.request_pharmacy_id === request_pharmacy_id
    );

  // Handle quantity change
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
            return {
              ...item,
              quantity:
                item.quantity < maxAvailable
                  ? item.quantity + 1
                  : item.quantity,
            };
          } else {
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

  // Handle quantity input
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
          const quantity = Math.min(Math.max(1, numValue), maxAvailable);
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  // Add prescription to report (close modal)
  const addPrescriptionToReport = () => {
    setIsPrescriptionModalOpen(false);
    toast.success("Prescription items added to report");
  };

  // Main report submission handler
  const handleReportSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Scenario 1: With prescription items - call both endpoints
      if (selectedItems.length > 0) {
        // First, create department report with prescription
        const reportData = {
          patient_id: patientId ?? null,
          note: reportText.trim(),
          file,
          status: "completed",
          role: "pharmacist",
          department_id: departmentId,
          pharmacy_stocks: selectedItems.map((item) => ({
            id: item.request_pharmacy_id,
            quantity: item.quantity,
          })),
        };

        const deptResponse = await deptCreateReport(reportData);
        if (!deptResponse) {
          toast.error("Failed to create prescription report");
          return;
        }

        // Then, respond to the case report to mark it as completed
        const caseResponse = await respondToReport(caseId, {
          note: generatePrescriptionSummary(),
          status: "completed",
          file: null,
        });

        if (!caseResponse) {
          toast.error("Failed to update case status");
          return;
        }

        // toast.success("Prescription dispensed and case completed successfully");
      }
      // Scenario 2: Without prescription - only respond to report
      else {
        if (!reportText.trim()) {
          toast.error("Please add report content");
          return;
        }

        const success = await respondToReport(caseId, {
          note: reportText,
          status,
          file,
        });

        if (!success) {
          toast.error("Failed to submit report");
          return;
        }

        // toast.success("Report submitted successfully");
      }

      // Clear form after successful submission
      await getSingleReport(patientId);
      clearForm();
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("An error occurred while submitting the report");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate prescription summary for case response
  const generatePrescriptionSummary = () => {
    let summary = reportText.trim();

    if (selectedItems.length > 0) {
      summary += "\n\nPrescription Dispensed:\n";
      selectedItems.forEach((item) => {
        // const dosage =
        //   prescriptionItems[item.request_pharmacy_id]?.dosage || "";
        // summary += `- ${item.service_item_name}: ${dosage} (Qty: ${item.quantity})\n`;
      });
      summary += `\nTotal Cost: ₦${totalCost.toFixed(2)}`;
    }

    return summary;
  };

  // Clear form
  const clearForm = () => {
    setReportText("");
    setStatus("In Progress");
    setFile(null);
    setSelectedItems([]);
    setPrescriptionItems({});
    setItemSearch("");
  };

  if (isReportLoading || isLoading || !selectedPatient) return <Loader />;

  return (
    <div className="">
      {/* Back navigation */}
      <div className="flex items-center mb-4">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Patients</span>
        </div>
      </div>

      {/* Patient Basic Info Card */}
      <div className="bg-white rounded-md shadow-sm mb-4 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["First Name", patient?.first_name],
            ["Last Name", patient?.last_name],
            ["Patient ID", patient?.card_id],
            ["Age", patient?.age],
            ["Gender", patient?.gender],
            ["Region", patient?.region],
            ["Occupation", patient?.occupation],
            ["Religion", patient?.religion],
            ["Phone", patient?.phone_number],
          ].map(([label, value], idx) => (
            <div key={idx}>
              <p className="text-gray-500 text-sm">{label}</p>
              <p className="font-medium">{value || ""}</p>
            </div>
          ))}
          <div className="col-span-3">
            <p className="text-gray-500 text-sm">House Address</p>
            <p className="font-medium">{patient?.address || ""}</p>
          </div>
        </div>
      </div>

      {/* Pharmacy Medical Timeline */}
      {patient && patientId && (
        <PharmacyMedicalTimeline
          patientId={patientId}
          patient={patient}
          showDownloadCompleteButton={true}
        />
      )}

      {/* Prescription Section */}
      <div className="bg-white rounded-md shadow-sm mb-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-lg font-medium">Pharmacy Prescription</h1>
            <h2 className="text-sm text-gray-600">
              Create prescriptions for pharmacy items (Optional)
            </h2>
          </div>
          <Button onClick={() => setIsPrescriptionModalOpen(true)}>
            {selectedItems.length > 0
              ? "Edit Prescription"
              : "Add Prescription"}
          </Button>
        </div>

        {/* Selected Items Preview */}
        {selectedItems.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Selected Prescription Items</h3>
              <span className="font-bold text-primary">
                Total: ₦{totalCost.toFixed(2)}
              </span>
            </div>
            <ul className="divide-y">
              {selectedItems.map((item) => (
                <li key={item.request_pharmacy_id} className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.service_item_name}</p>
                      {/* <p className="text-sm text-gray-600">
                        {prescriptionItems[item.request_pharmacy_id]?.dosage ||
                          "No dosage specified"}
                      </p> */}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        ₦{item.service_item_price} × {item.quantity}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Prescription Modal */}
      {isPrescriptionModalOpen && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Create Prescription</h3>
                <button
                  onClick={() => setIsPrescriptionModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-auto">
              <div className="mb-4">
                <input
                  type="search"
                  placeholder="Search pharmacy items..."
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Available Items */}
                <div>
                  <h4 className="font-medium mb-2">Available Items</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <ul className="divide-y max-h-[300px] overflow-y-auto">
                      {filteredItems?.map((item) => (
                        <li
                          key={item.request_pharmacy_id}
                          className={`p-3 cursor-pointer hover:bg-blue-50 ${
                            isItemSelected(item.request_pharmacy_id)
                              ? "bg-blue-100"
                              : ""
                          }`}
                          onClick={() => handleToggleItem(item)}
                        >
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">
                                {item.service_item_name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Available: {item.requested_quantity}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium text-primary mr-2">
                                ₦{item.service_item_price}
                              </span>
                              <div
                                className={`w-5 h-5 rounded border flex items-center justify-center ${
                                  isItemSelected(item.request_pharmacy_id)
                                    ? "bg-primary border-primary"
                                    : "border-gray-300"
                                }`}
                              >
                                {isItemSelected(item.request_pharmacy_id) && (
                                  <Check className="h-4 w-4 text-white" />
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Prescription Details */}
                <div>
                  <h4 className="font-medium mb-2">Prescription Details</h4>
                  <div className="border border-gray-200 rounded-lg p-3 overflow-y-auto h-[400px]">
                    {selectedItems.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        Select items to add to prescription
                      </p>
                    ) : (
                      <ul className="space-y-3">
                        {selectedItems.map((item) => (
                          <li
                            key={item.request_pharmacy_id}
                            className="border border-gray-200 rounded p-3"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  {item.service_item_name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  ₦{item.service_item_price} × {item.quantity}
                                </p>
                              </div>
                              <button
                                onClick={() => handleToggleItem(item)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            {/* 
                            <div className="mt-2">
                              <label className="block text-sm font-medium mb-1">
                                Dosage Instructions
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., 1 tablet twice daily"
                                value={
                                  prescriptionItems[item.request_pharmacy_id]
                                    ?.dosage || ""
                                }
                                onChange={(e) =>
                                  handlePrescriptionChange(
                                    item.request_pharmacy_id,
                                    "dosage",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                              />
                            </div> */}

                            <div className="mt-2 flex items-center gap-2">
                              <label className="text-sm">Quantity:</label>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.request_pharmacy_id,
                                    "decrease"
                                  )
                                }
                                className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                max={item.requested_quantity}
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityInput(
                                    item.request_pharmacy_id,
                                    e.target.value
                                  )
                                }
                                className="w-12 text-center border border-gray-300 rounded-md px-1 py-1 text-sm"
                              />
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.request_pharmacy_id,
                                    "increase"
                                  )
                                }
                                className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                              <span className="text-sm text-gray-600 ml-1">
                                of {item.requested_quantity}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    {selectedItems.length > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                        <span className="font-medium">Total Cost:</span>
                        <span className="font-bold text-primary text-lg">
                          ₦{totalCost.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsPrescriptionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={addPrescriptionToReport}>
                {selectedItems.length > 0 ? "Update Prescription" : "Close"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Report Section */}
      <div className="bg-white rounded-md shadow-sm mb-4 p-6">
        <h3 className="font-medium mb-4 text-primary">Pharmacy Report</h3>
        <textarea
          className="w-full border border-primary rounded-md p-3 h-24 mb-4"
          placeholder="Type your pharmacy report here..."
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
        />

        {/* Only show status dropdown if no prescription items */}
        {selectedItems.length === 0 && (
          <div className="mb-4">
            <h4 className="text-gray-600 text-sm mb-2">Progress Status</h4>
            <select
              className="w-full appearance-none bg-white border border-gray-300 rounded-md p-2 pr-8"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        )}

        {/* File input */}
        <div className="mb-4">
          <input
            type="file"
            className="w-full border border-gray-300 rounded-md p-2"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
        </div>

        {/* Submit Button */}
        <button
          className={`bg-primary text-white py-2 px-4 rounded-md flex items-center justify-center w-full
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleReportSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              {selectedItems.length > 0
                ? "Dispensing Prescription..."
                : "Submitting Report..."}
              <Loader2 className="size-6 ml-2 animate-spin" />
            </>
          ) : selectedItems.length > 0 ? (
            "Dispense Prescription & Complete Case"
          ) : (
            "Submit Report"
          )}
        </button>

        {/* Info text */}
        <p className="text-sm text-gray-600 mt-2 text-center">
          {selectedItems.length > 0
            ? "This will dispense the prescription and mark the case as completed"
            : "Submit your pharmacy report for this case"}
        </p>
      </div>
    </div>
  );
};

export default PharPatientDetails;
