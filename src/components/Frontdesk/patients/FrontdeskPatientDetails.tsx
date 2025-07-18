import { useNavigate, useParams } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import { useEffect, useState } from "react";
import Loader from "../../../Shared/Loader";
import {
  ChevronLeft,
  StickyNoteIcon,
  FileText,
  Check,
  Plus,
  Minus,
  Loader2,
  Banknote,
  X,
  Trash2,
} from "lucide-react";
import MedicalTimeline from "../../../Shared/MedicalTimeline";
import { useStickyNoteStore } from "../../../store/super-admin/useStickyNote";
import { useReportStore } from "../../../store/super-admin/useReoprt";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import toast from "react-hot-toast";
import Button from "../../../Shared/Button";
import EditPatientModal from "../../../Shared/EditPatientModal";
import { useRole } from "../../../hooks/useRole";
import DoctorBillForm from "../../Doctor/DoctorBillForm";

interface InfoRowItem {
  label: string;
  value: string | number | null;
}
interface NextOfKin {
  name: string;
  last_name: string;
  gender: string;
  phone: string;
  occupation: string;
  address: string;
  relationship: string;
}

interface PatientAttributes {
  id?: number;
  first_name: string;
  last_name: string;
  card_id: string;
  phone_number: string | null;
  occupation: string;
  gender: string;
  address: string;
  age: number;
  branch: string | null;
  next_of_kin: NextOfKin[];
}

const FrontdeskPatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedPatient, getFdeskPatientById, updatePatient, isLoading } =
    usePatientStore();
  const navigate = useNavigate();
  const { show } = useStickyNoteStore();
  const [activeTab, setActiveTab] = useState("report");
  const [reportNote, setReportNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  // State for prescription modal
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [prescriptionItems, setPrescriptionItems] = useState<{
    [key: string]: { dosage: string; quantity: number };
  }>({});

  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Pharmacy related states
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [itemSearch, setItemSearch] = useState("");

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

  // Laboratory related states
  const [labTestSearch, setLabTestSearch] = useState("");
  const [isLabSelectOpen, setIsLabSelectOpen] = useState(false);
  const [selectedLabTests, setSelectedLabTests] = useState<
    {
      id: number;
      name: string;
      amount: string;
      quantity: number;
    }[]
  >([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    createReport,
    isCreating,
    getPharmacyStocks,
    pharmacyStocks,
    getLaboratoryItems,
    labItems,
  } = useReportStore();

  const { getAllRoles, roles } = useGlobalStore();

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    if (name === "itemSearch") {
      setItemSearch(value);
    } else if (name === "labTestSearch") {
      setLabTestSearch(value);
    }
  };

  // Pharmacy related functions
  const filteredItems = pharmacyStocks?.filter((stock) =>
    stock.service_item_name?.toLowerCase().includes(itemSearch.toLowerCase())
  );

  // Add prescription to report
  const addPrescriptionToReport = () => {
    let prescriptionText = "-";

    if (prescriptionText) {
      // Remove existing prescription section if any

      // Add new prescription section
      setReportNote("-");
    }
    setReportNote("-");

    setIsPrescriptionModalOpen(false);
  };

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
  // Calculate total cost
  const totalCost = selectedItems.reduce((total, item) => {
    const price = parseFloat(item.service_item_price) || 0;
    return total + price * item.quantity;
  }, 0);

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

  // Laboratory related functions
  const filteredLabTests = labItems?.filter((test) =>
    test.name?.toLowerCase().includes(labTestSearch.toLowerCase())
  );

  const handleToggleLabTest = (test: any) => {
    const exists = selectedLabTests.find((t) => t.id === test.id);
    if (!exists) {
      setSelectedLabTests((prev) => [
        ...prev,
        {
          ...test,
          quantity: 1,
        },
      ]);
      toast.success(`Added ${test.name || "test"} to selection`);
    } else {
      setSelectedLabTests((prev) => prev.filter((t) => t.id !== test.id));
      toast.success(`Removed ${test.name || "test"} from selection`);
    }
  };

  const isLabTestSelected = (id: any) =>
    selectedLabTests.some((test) => test.id === id);
  const handlePrescriptionChange = (id: string, field: string, value: any) => {
    setPrescriptionItems((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { dosage: "", quantity: 1 }),
        [field]: value,
      },
    }));
  };

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
      let reportData: {
        patient_id: string;
        note: string;
        department_id: number;
        parent_id: null;
        file: File | null;
        status: string;
        role: string;
        pharmacy_stocks?: { id: any; quantity: number }[];
        laboratory_service_charge?: { id: any; quantity: number }[];
      } = {
        patient_id: id ?? "",
        note: reportNote ?? "-",
        department_id: departmentId,
        parent_id: null,
        file,
        status: "sent",
        role: selectedDepartment,
      };

      if (selectedDepartment === "pharmacist" && selectedItems.length > 0) {
        const pharmacyStocksArray = selectedItems.map((item) => ({
          id: item.request_pharmacy_id,
          quantity: item.quantity,
        }));
        reportData = {
          ...reportData,
          pharmacy_stocks: pharmacyStocksArray,
        };
      }

      if (selectedDepartment === "laboratory" && selectedLabTests.length > 0) {
        const laboratoryTestsArray = selectedLabTests.map((test) => ({
          id: test.id,
          quantity: test.quantity,
        }));
        reportData = {
          ...reportData,
          laboratory_service_charge: laboratoryTestsArray,
        };
      }

      const response = await createReport(reportData);

      if (response) {
        setReportNote("");
        setFile(null);
        setSelectedDepartment("");
        setSelectedItems([]);
        setSelectedLabTests([]);
        setItemSearch("");
        setLabTestSearch("");
        // toast.success("Report sent successfully");
        getFdeskPatientById(id ?? "").catch((error) => {
          console.error("Error fetching patient:", error);
        });
      }
    } catch (error) {
      // Error handling is done in the toast already
    }
  };

  const role = useRole();

  const updateEndpoint =
    role === "admin" ? "/admin/patient/update" : "/front-desk/patient/update";

  const handleSavePatient = async (updatedPatientData: any) => {
    if (!id) return;

    // setIsLoading(true);
    try {
      await updatePatient(id, updatedPatientData, updateEndpoint);
      // toast.success("Patient information updated successfully");
      setIsEditModalOpen(false);
      getFdeskPatientById(id);
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error("Failed to update patient information");
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllRoles();
    getPharmacyStocks();
    getLaboratoryItems();
  }, [getAllRoles, getPharmacyStocks, getLaboratoryItems]);

  useEffect(() => {
    if (id) {
      console.log("Fetching patient with ID:", id);

      getFdeskPatientById(id).catch((error) => {
        console.error("Error fetching patient:", error);
      });
    }
  }, [id, getFdeskPatientById]);

  if (isLoading) {
    return <Loader />;
  }

  if (!selectedPatient || !selectedPatient.attributes) {
    return <div>No patient data found.</div>;
  }

  const patient: PatientAttributes = selectedPatient.attributes;
  const nextOfKinList: NextOfKin[] = patient.next_of_kin || [];

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 relative">
        {/* <div className="absolute top-0 right-8">
          <div className="absolute top-4 right-6 z-[99999] flex items-center justify-between">
            <button
              onClick={show}
              className="bg-yellow-200 hover:bg-yellow-300 p-2 rounded-full shadow-md"
              title="Open Sticky Note"
            >
              <StickyNoteIcon className="w-5 h-5 text-yellow-800" />
            </button>
          </div>
        </div> */}
        {/* Back button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
          <div
            className="flex items-center text-gray-600 hover:text-primary mb-5"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={16} />
            <span className="ml-1">Patients</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="edit"
              rounded="lg"
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs sm:text-sm flex-1 sm:flex-none"
            >
              Edit Patient
            </Button>
          </div>
        </div>

        <div className="grid gap-6 relative">
          <div>
            <h2 className="text-lg font-semibold mb-4">Patient Details</h2>
            <InfoRow
              items={[
                { label: "First Name", value: patient.first_name },
                { label: "Last Name", value: patient.last_name },
                { label: "Patient ID", value: patient.card_id },
                { label: "Age", value: patient.age },
              ]}
            />
            <InfoRow
              items={[
                { label: "Gender", value: patient.gender },
                { label: "Branch", value: patient.branch },
                { label: "Occupation", value: patient.occupation },
                { label: "Phone", value: patient.phone_number },
              ]}
            />
            <InfoRow
              columns="grid-cols-1"
              items={[{ label: "House Address", value: patient.address }]}
            />
          </div>

          <hr className="text-[#979797]" />
          <div>
            <h3 className="font-semibold mb-4">Next of Kin</h3>
            {nextOfKinList.length > 0 ? (
              nextOfKinList.map((kin, index) => (
                <div key={index} className="mb-6 p-4">
                  <InfoRow
                    items={[
                      { label: "First Name", value: kin.name },
                      { label: "Last Name", value: kin.last_name },
                      { label: "Gender", value: kin.gender },
                      { label: "Occupation", value: kin.occupation },
                    ]}
                  />
                  <InfoRow
                    items={[
                      { label: "Phone", value: kin.phone },
                      { label: "Relationship", value: kin.relationship },
                    ]}
                  />
                  <InfoRow
                    columns="grid-cols-1"
                    items={[{ label: "Address", value: kin.address }]}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No next of kin information available.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Report Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex gap-6 mb-4 text-sm font-medium text-[#667185]">
          <button
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition text-primary bg-[#F0F4FF]`}
            onClick={() => setActiveTab("report")}
          >
            <FileText size={16} />
            Add Report
          </button>
          {/* <button
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition ${
              activeTab === "bill"
                ? "text-primary bg-[#F0F4FF]"
                : "hover:text-primary"
            }`}
            onClick={() => setActiveTab("bill")}
          >
            <Banknote size={16} />
            Add Doctor's Bill
          </button> */}
        </div>

        {activeTab === "report" && (
          <div className="space-y-4">
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
                  {/* {roles["nurse"] && (
                    <button
                      type="button"
                      onClick={() => setSelectedDepartment("nurse")}
                      className={`px-4 py-2 rounded-lg transition ${
                        selectedDepartment === "nurse"
                          ? "bg-primary text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      Nurse
                    </button>
                  )} */}
                </>
              ) : (
                <div className="flex items-center text-gray-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading departments...
                </div>
              )}
            </div>

            {activeTab === "report" && selectedDepartment === "laboratory" && (
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Laboratory Requests
                </h3>

                {/* Laboratory Test Selection (Existing Functionality) */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-sm text-gray-600">
                        Request laboratory tests for this patient
                      </h2>
                    </div>
                    <Button onClick={() => setIsLabModalOpen(true)}>
                      {selectedLabTests.length > 0
                        ? "Edit Lab Tests"
                        : "Add Lab Tests"}
                    </Button>
                  </div>

                  {selectedLabTests.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Selected Tests</h3>
                        <span className="font-bold text-primary">
                          Total: ₦
                          {selectedLabTests
                            .reduce(
                              (total, test) =>
                                total + parseFloat(test.amount) * test.quantity,
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </div>
                      <ul className="divide-y">
                        {selectedLabTests.map((test) => (
                          <li key={test.id} className="py-3">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">{test.name}</p>
                                <p className="text-sm text-gray-600">
                                  Quantity: {test.quantity}
                                </p>
                              </div>
                              <p className="font-medium text-primary">
                                ₦
                                {(
                                  parseFloat(test.amount) * test.quantity
                                ).toFixed(2)}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Rest of your existing code... */}
              </div>
            )}

            {activeTab === "report" && selectedDepartment === "pharmacist" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h1 className="text-lg font-medium">Pharmacy</h1>
                    <h2 className="text-sm text-gray-600">
                      Select Pharmacy items for patient
                    </h2>
                  </div>
                  <Button onClick={() => setIsPrescriptionModalOpen(true)}>
                    {selectedItems.length > 0 ? "Edit Items" : "Add Items"}
                  </Button>
                </div>

                {selectedItems.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Prescription Items</h3>
                      <span className="font-bold text-primary">
                        Total: ₦{totalCost.toFixed(2)}
                      </span>
                    </div>
                    <ul className="divide-y">
                      {selectedItems.map((item) => (
                        <li key={item.request_pharmacy_id} className="py-3">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">
                                {item.service_item_name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {prescriptionItems[item.request_pharmacy_id]
                                  ?.dosage || "No dosage specified"}
                              </p>
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
            )}

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
                                      {isItemSelected(
                                        item.request_pharmacy_id
                                      ) && (
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

                      <div>
                        <h4 className="font-medium mb-2">Pharmacy</h4>
                        <div className="border border-gray-200 rounded-lg p-3 overflow-y-auto h-[400px]">
                          {selectedItems.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                              Select pharmacy items for patient
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
                                        ₦{item.service_item_price} ×{" "}
                                        {item.quantity}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => handleToggleItem(item)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>

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
                      Add to Report
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {/* Lab Test Modal */}
            {isLabModalOpen && (
              <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">
                        Select Laboratory Tests
                      </h3>
                      <button
                        onClick={() => setIsLabModalOpen(false)}
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
                        placeholder="Search laboratory tests..."
                        value={labTestSearch}
                        onChange={(e) => setLabTestSearch(e.target.value)}
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Available Tests</h4>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <ul className="divide-y max-h-[300px] overflow-y-auto">
                            {filteredLabTests?.map((test) => (
                              <li
                                key={test.id}
                                className={`p-3 cursor-pointer hover:bg-blue-50 ${
                                  isLabTestSelected(test.id)
                                    ? "bg-blue-100"
                                    : ""
                                }`}
                                onClick={() => handleToggleLabTest(test)}
                              >
                                <div className="flex justify-between">
                                  <div>
                                    <p className="font-medium">{test.name}</p>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium text-primary mr-2">
                                      ₦{test.amount}
                                    </span>
                                    <div
                                      className={`w-5 h-5 rounded border flex items-center justify-center ${
                                        isLabTestSelected(test.id)
                                          ? "bg-primary border-primary"
                                          : "border-gray-300"
                                      }`}
                                    >
                                      {isLabTestSelected(test.id) && (
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

                      <div>
                        <h4 className="font-medium mb-2">Selected Tests</h4>
                        <div className="border border-gray-200 rounded-lg p-3 overflow-y-auto h-[400px]">
                          {selectedLabTests.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                              No tests selected
                            </p>
                          ) : (
                            <ul className="space-y-3">
                              {selectedLabTests.map((test) => (
                                <li
                                  key={test.id}
                                  className="border border-gray-200 rounded p-3"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium">{test.name}</p>
                                      <p className="text-primary font-medium">
                                        ₦{test.amount}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => handleToggleLabTest(test)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>

                                  <div className="mt-2 flex items-center gap-2">
                                    <label className="text-sm">Quantity:</label>
                                    <button
                                      onClick={() =>
                                        setSelectedLabTests((prev) =>
                                          prev.map((t) =>
                                            t.id === test.id
                                              ? {
                                                  ...t,
                                                  quantity: Math.max(
                                                    1,
                                                    t.quantity - 1
                                                  ),
                                                }
                                              : t
                                          )
                                        )
                                      }
                                      className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                    <input
                                      type="number"
                                      min="1"
                                      value={test.quantity}
                                      onChange={(e) => {
                                        const value =
                                          parseInt(e.target.value) || 1;
                                        setSelectedLabTests((prev) =>
                                          prev.map((t) =>
                                            t.id === test.id
                                              ? {
                                                  ...t,
                                                  quantity: Math.max(1, value),
                                                }
                                              : t
                                          )
                                        );
                                      }}
                                      className="w-12 text-center border border-gray-300 rounded-md px-1 py-1 text-sm"
                                    />
                                    <button
                                      onClick={() =>
                                        setSelectedLabTests((prev) =>
                                          prev.map((t) =>
                                            t.id === test.id
                                              ? {
                                                  ...t,
                                                  quantity: t.quantity + 1,
                                                }
                                              : t
                                          )
                                        )
                                      }
                                      className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                          {selectedLabTests.length > 0 && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                              <span className="font-medium">Total:</span>
                              <span className="font-bold text-primary text-lg">
                                ₦
                                {selectedLabTests
                                  .reduce(
                                    (total, test) =>
                                      total +
                                      parseFloat(test.amount) * test.quantity,
                                    0
                                  )
                                  .toFixed(2)}
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
                      onClick={() => setIsLabModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => setIsLabModalOpen(false)}>
                      Save Tests
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <textarea
              rows={5}
              value={reportNote}
              onChange={(e) => setReportNote(e.target.value)}
              placeholder="Enter doctor's report..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary"
            />

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
            />

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
                    ? departmentLabels[selectedDepartment] || "..."
                    : "..."
                }`
              )}
            </button>
          </div>
        )}
        {/* {activeTab == "bill" && (
          // <div>
          //   <div className="space-y-4 mb-4">
          //     <label htmlFor="">Description</label>
          //     <Input name="description" value="" onChange="" />
          //   </div>
          //   <div className="space-y-4 mb-4">
          //     <label htmlFor="">Amount</label>
          //     <Input name="amount" value="" onChange="" />
          //   </div>
          //   <div className=" flex justify-end">
          //     <Button>Add Doctor's Bill</Button>
          //   </div>{" "}
          // </div>
          <DoctorBillForm
            patient={selectedPatient?.attributes}
            selectedPatient={selectedPatient}
          />
        )} */}
      </div>

      {id && (
        <MedicalTimeline
          patientId={id}
          patient={patient}
          showDownloadCompleteButton={false}
        />
      )}
      {isEditModalOpen && (
        <EditPatientModal
          isLoading={isLoading}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          patientData={selectedPatient?.attributes}
          onSave={handleSavePatient}
        />
      )}
    </div>
  );
};

export default FrontdeskPatientDetails;

const InfoRow: React.FC<{
  items: InfoRowItem[];
  columns?: string;
}> = ({ items, columns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" }) => (
  <div className={`grid gap-4 mb-4 ${columns}`}>
    {items.map(({ label, value }, i) => (
      <div key={i}>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-medium">{value ?? "-"}</p>
      </div>
    ))}
  </div>
);

const departmentLabels: Record<string, string> = {
  pharmacist: "Pharmacy",
  laboratory: "Laboratory",
  nurse: "Nurse",
};
