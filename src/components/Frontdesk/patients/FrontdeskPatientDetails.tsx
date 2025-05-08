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
} from "lucide-react";
import MedicalTimeline from "../../../Shared/MedicalTimeline";
import { useStickyNoteStore } from "../../../store/super-admin/useStickyNote";
import { useReportStore } from "../../../store/super-admin/useReoprt";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import toast from "react-hot-toast";

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
  const { selectedPatient, getFdeskPatientById, isLoading } = usePatientStore();
  const navigate = useNavigate();
  const { show } = useStickyNoteStore();
  const [activeTab, setActiveTab] = useState("report");
  const [reportNote, setReportNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Pharmacy related states
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [itemSearch, setItemSearch] = useState("");
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
        note: reportNote,
        department_id: departmentId,
        parent_id: null,
        file,
        status: "pending",
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
        toast.success("Report sent successfully");
      }
    } catch (error) {
      // Error handling is done in the toast already
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
        <div className="absolute top-0 right-8">
          <div className="absolute top-4 right-6 z-[99999] flex items-center justify-between">
            <button
              onClick={show}
              className="bg-yellow-200 hover:bg-yellow-300 p-2 rounded-full shadow-md"
              title="Open Sticky Note"
            >
              <StickyNoteIcon className="w-5 h-5 text-yellow-800" />
            </button>
          </div>
        </div>
        {/* Back button */}
        <div
          className="flex items-center text-gray-600 hover:text-primary mb-5"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={16} />
          <span className="ml-1">Patients</span>
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
          >
            <FileText size={16} />
            Add Report
          </button>
        </div>

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
              </>
            ) : (
              <div className="flex items-center text-gray-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading departments...
              </div>
            )}
          </div>

          {selectedDepartment === "pharmacist" && (
            <div>
              <h1 className="text-lg font-medium mb-2">Pharmacy Store</h1>
              <h2 className="text-sm text-gray-600 mb-4">
                Check and select drugs from pharmacy for the patient here
              </h2>

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

          {selectedDepartment === "laboratory" && (
            <div>
              <h1 className="text-lg font-medium mb-2">Laboratory Tests</h1>
              <h2 className="text-sm text-gray-600 mb-4">
                Check and select tests from laboratory for the patient here
              </h2>

              <div className="relative mb-4">
                <div
                  className="border border-[#D0D5DD] rounded-lg p-3 flex items-center justify-between cursor-pointer"
                  onClick={() => setIsLabSelectOpen(!isLabSelectOpen)}
                >
                  <div className="flex-1">
                    {selectedLabTests.length === 0 ? (
                      <span className="text-gray-500">Select tests...</span>
                    ) : (
                      <span>{selectedLabTests.length} test(s) selected</span>
                    )}
                  </div>
                  <div
                    className={`transform transition-transform ${
                      isLabSelectOpen ? "rotate-180" : ""
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
                {isLabSelectOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#D0D5DD] rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    <div className="p-2 sticky top-0 bg-white border-b border-[#D0D5DD]">
                      <input
                        type="search"
                        name="labTestSearch"
                        value={labTestSearch}
                        onChange={handleChange}
                        placeholder="Search tests..."
                        className="w-full border border-[#D0D5DD] p-2 rounded outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <ul className="divide-y">
                      {filteredLabTests?.length > 0 ? (
                        filteredLabTests.map((test) => (
                          <li
                            key={test.id}
                            onClick={() => handleToggleLabTest(test)}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium">{test.name}</p>
                              <p className="text-sm text-gray-500">
                                Amount: {test.amount}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded border flex items-center justify-center ${
                                isLabTestSelected(test.id)
                                  ? "bg-blue-500 border-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {isLabTestSelected(test.id) && (
                                <Check className="h-4 w-4 text-white" />
                              )}
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-3 text-gray-500">
                          No tests found
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {selectedLabTests.length > 0 && (
                <div className="mt-4 border border-[#D0D5DD] rounded-lg p-4">
                  <h3 className="font-medium mb-3">Selected Tests</h3>
                  <ul className="divide-y">
                    {selectedLabTests.map((test) => (
                      <li
                        key={test.id}
                        className="py-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{test.name}</p>
                          <p className="text-xs text-gray-500">
                            Amount: {test.amount}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-12 text-center border border-gray-300 rounded-md p-1">
                            {test.quantity}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <textarea
            rows={5}
            value={reportNote}
            onChange={(e) => setReportNote(e.target.value)}
            placeholder="Enter report notes..."
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
      </div>

      {id && (
        <MedicalTimeline
          patientId={id}
          patient={patient}
          showDownloadCompleteButton={false}
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
