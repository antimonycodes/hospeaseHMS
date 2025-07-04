import React, { useState, useEffect } from "react";
import {
  X,
  Loader2,
  Trash2,
  Search,
  User,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";
import { useFinanceStore } from "../store/staff/useFinanceStore";
import { usePatientStore } from "../store/super-admin/usePatientStore";
import { useCombinedStore } from "../store/super-admin/useCombinedStore";
import { useGlobalStore } from "../store/super-admin/useGlobal";
import { useReportStore } from "../store/super-admin/useReoprt";
import PaymentReceipt from "../components/Finance/payment/PaymentReceipt";
import ItemSelection from "../components/Finance/payment/ItemSelection";
import PaymentSummary from "../components/Finance/payment/PaymentSummary";
import PaymentDetails from "../components/Finance/payment/PaymentDeets";

export interface Role {
  id: number;
  role: string;
}
export interface RolesState {
  [key: string]: Role;
}
export interface Patient {
  id: string;
  attributes: { first_name: string; last_name: string; card_id: string };
}
export interface ServiceItem {
  id: string | number;
  attributes: {
    name: string;
    amount: string | number | null;
    department: {
      id: string | number;
      name: string;
      admin_hospital_id: string;
    };
  };
}
export interface PharmacyStock {
  request_pharmacy_id: string | number;
  service_item_name: string;
  service_item_price: string | number;
  requested_quantity: string | number;
}
export interface Item {
  id: string | number;
  attributes: {
    amount: number;
    name: string;
    isPharmacy: boolean;
    availableQuantity?: number;
    departmentId: string | number; // Add department tracking
  };
  quantity: number;
  total: number;
}
export interface Doctor {
  id: string | number;
  attributes: {
    first_name: string;
    last_name: string;
  };
}
export interface PaymentSource {
  id: string | number;
  attributes: {
    name: string;
  };
}
export interface AddPaymentModalProps {
  onClose: () => void;
  endpoint?: string;
  refreshEndpoint?: string;
}

// PatientSearch Component
const PatientSearch: React.FC<{
  query: string;
  setQuery: (value: string) => void;
  patientOptions: Patient[];
  setPatientOptions: (options: Patient[]) => void;
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  isLoading: boolean;
  searchPatients: (query: string) => Promise<Patient[] | undefined>;
}> = ({
  query,
  setQuery,
  patientOptions,
  setPatientOptions,
  selectedPatient,
  setSelectedPatient,
  isLoading,
  searchPatients,
}) => {
  const handleSearch = debounce(async (val: string) => {
    if (val.length > 2) {
      const results = await searchPatients(val);
      setPatientOptions(results || []);
    } else {
      setPatientOptions([]);
    }
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQuery(value);
    handleSearch(value);
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setQuery(
      `${patient.attributes.first_name} ${patient.attributes.last_name}`
    );
    setPatientOptions([]);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Patient Information
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="search"
          name="query"
          value={query}
          onChange={handleChange}
          placeholder="Search patient by name or card ID..."
          className="w-full border border-[#E4E4E7] pl-10 pr-4 py-3 rounded-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          disabled={isLoading}
        />
      </div>
      {patientOptions.length > 0 && (
        <ul className="mt-1 bg-white border rounded-lg shadow-lg overflow-hidden">
          {patientOptions.map((p) => (
            <li
              key={p.id}
              onClick={() => handleSelectPatient(p)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center"
            >
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="font-medium">
                  {p.attributes.first_name} {p.attributes.last_name}
                </p>
                <p className="text-sm text-gray-500">
                  Card ID: {p.attributes.card_id}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {selectedPatient && (
        <div className="mt-3 bg-[#D0D5DD] border border-[#D0D5DD] rounded-lg p-3 flex items-center">
          <User className="h-5 w-5 text-primary mr-2" />
          <div>
            <p className="font-medium">
              {selectedPatient.attributes.first_name}{" "}
              {selectedPatient.attributes.last_name}
            </p>
            <p className="text-sm text-gray-500">
              Card ID: {selectedPatient.attributes.card_id}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Main AddPaymentModal Component
const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  onClose,
  endpoint = "frontdesk/save-patient-payment",
  refreshEndpoint = "/finance/all-revenues",
}) => {
  const {
    searchPatients,
    createPayment,
    isLoading,
    getAllDoctors,
    doctors,
    getPaymentSource,
    paymentSources,
  } = useFinanceStore();
  const { getAllPatientsNoPerPage } = usePatientStore();
  const { getAllItems, items } = useCombinedStore();
  const { getPharmacyStocks, pharmacyStocks } = useReportStore();
  const { getAllRoles } = useGlobalStore();
  const roles = useGlobalStore((state) => state.roles) as RolesState;

  const [query, setQuery] = useState("");
  const [paymentSource, setPaymentSource] = useState<string | null>(null);
  const [paymentSourceType, setPaymentSourceType] = useState<
    "doctor" | "payment_source" | null
  >(null);
  const [patientOptions, setPatientOptions] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]); // Array of selected departments
  const [currentDepartment, setCurrentDepartment] = useState(""); // Currently active department for selection
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [activeTab, setActiveTab] = useState("items");
  const [itemSearch, setItemSearch] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);
  const [partAmount, setPartAmount] = useState("");
  const [hmoDiscount, setHmoDiscount] = useState(0);
  const [receiptData, setReceiptData] = useState<{
    receiptNumber: string;
    paymentDate: Date | null;
    selectedPatient: Patient | null;
    selectedItems: Item[];
    totalAmount: number;
    amountPaid: number;
    balance: number;
    paymentMethod: string;
    paymentType: string;
    currentPaymentAmount?: number;
    isNewPayment?: boolean;
  } | null>(null);

  const allowedDepartments = ["pharmacist", "laboratory", "finance"];
  const getDepartmentOptions = () => {
    if (!roles) return [];
    return allowedDepartments
      .filter((dept) => roles[dept])
      .map((dept) => ({
        id: roles[dept].id.toString(),
        name:
          dept === "pharmacist"
            ? "Pharmacy"
            : dept === "finance"
            ? "Others"
            : "Laboratory",
      }));
  };

  const departmentOptions = getDepartmentOptions();

  useEffect(() => {
    getAllPatientsNoPerPage();
    getAllItems();
    getAllRoles();
    getPharmacyStocks();
    getAllDoctors();
    getPaymentSource();

    const storedHmoDiscount = localStorage.getItem("hmo");
    if (storedHmoDiscount) {
      setHmoDiscount(Number(storedHmoDiscount));
    }
  }, [
    getAllPatientsNoPerPage,
    getAllItems,
    getAllRoles,
    getPharmacyStocks,
    getAllDoctors,
    getPaymentSource,
  ]);

  const parseAmount = (
    amountStr: string | number | null | undefined
  ): number => {
    if (amountStr == null) return 0;
    if (typeof amountStr === "number") return amountStr;
    if (typeof amountStr === "string") {
      return parseFloat(amountStr.replace(/,/g, "")) || 0;
    }
    return 0;
  };

  const calculateFinalTotal = () => {
    const rawTotal = selectedItems.reduce((sum, item) => sum + item.total, 0);
    if (paymentMethod === "HMO" && hmoDiscount > 0) {
      return rawTotal * (hmoDiscount / 100); // Customer pays only the discount percentage
    }
    return rawTotal;
  };

  const totalAmount = calculateFinalTotal();
  const rawTotalAmount = selectedItems.reduce(
    (sum, item) => sum + item.total,
    0
  );

  // Handle department selection
  const handleDepartmentChange = (departmentId: string) => {
    setCurrentDepartment(departmentId);

    // Add to selected departments if not already included
    if (departmentId && !selectedDepartments.includes(departmentId)) {
      setSelectedDepartments((prev) => [...prev, departmentId]);
    }
  };

  // Remove department and its associated items
  const removeDepartment = (departmentId: string) => {
    setSelectedDepartments((prev) => prev.filter((id) => id !== departmentId));
    setSelectedItems((prev) =>
      prev.filter((item) => item.attributes.departmentId !== departmentId)
    );

    // If removing current department, reset current department
    if (currentDepartment === departmentId) {
      setCurrentDepartment("");
    }

    toast.success("Department and its items removed");
  };

  // Get department name by ID
  const getDepartmentName = (departmentId: string) => {
    const dept = departmentOptions.find((d) => d.id === departmentId);
    return dept?.name || "Unknown Department";
  };

  // Get items count by department
  const getItemsCountByDepartment = (departmentId: string) => {
    return selectedItems.filter(
      (item) => item.attributes.departmentId === departmentId
    ).length;
  };

  const handleSubmit = async () => {
    const payload = {
      payment_source: paymentSource,
      payment_type: paymentType,
      total_amount: totalAmount.toString(),
      part_amount:
        paymentType === "full"
          ? null
          : paymentType === "pending"
          ? "0"
          : partAmount,
      payment_method: paymentMethod,
      patient_id: Number(selectedPatient?.id),
      department_id: selectedDepartments.map((id) => Number(id)),
      payments: selectedItems.map((item) => ({
        patient_id: Number(selectedPatient?.id),
        amount: item.total,
        service_charge_id: item.attributes.isPharmacy ? null : Number(item.id),
        request_pharmacy_id: item.attributes.isPharmacy
          ? Number(item.id)
          : null,
        doctor_bill_id: null,
        quantity: item.quantity,
        item_name: item.attributes.name,
      })),
    };

    try {
      const success = await createPayment(payload, endpoint, refreshEndpoint);
      if (success) {
        // Calculate payment details for receipt
        let currentPayment = 0;
        let amountPaid = 0;
        let balance = totalAmount;

        if (paymentType === "full") {
          currentPayment = totalAmount;
          amountPaid = totalAmount;
          balance = 0;
        } else if (paymentType === "part") {
          currentPayment = parseAmount(partAmount) || totalAmount;
          amountPaid = currentPayment;
          balance = totalAmount - amountPaid;
        } else if (paymentType === "pending") {
          currentPayment = 0; // No payment made
          amountPaid = 0; // No amount paid
          balance = totalAmount; // Full amount still owed
        }

        console.log(balance, "balance");
        console.log(currentPayment, "current payment");
        console.log(amountPaid, "amount paid");

        setReceiptNumber(`RCP${Date.now().toString().slice(-8)}`);
        setPaymentDate(new Date());
        setPaymentComplete(true);
        setShowSummary(false);
        toast.success("Payment successfully processed");

        // Prepare receipt data
        setReceiptData({
          receiptNumber: `RCP${Date.now().toString().slice(-8)}`,
          paymentDate: new Date(),
          selectedPatient,
          selectedItems,
          totalAmount,
          amountPaid,
          balance,
          paymentMethod,
          paymentType,
          currentPaymentAmount: currentPayment,
          isNewPayment: true,
        });
      }
    } catch (error) {
      toast.error("Payment processing failed");
    }
  };

  const isSubmitDisabled =
    selectedItems.length === 0 ||
    !selectedPatient ||
    !paymentMethod ||
    !paymentType ||
    selectedDepartments.length === 0;

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (paymentComplete && receiptData) {
    return (
      <PaymentReceipt
        onClose={onClose}
        receiptNumber={receiptData.receiptNumber}
        paymentDate={receiptData.paymentDate}
        selectedPatient={receiptData.selectedPatient}
        selectedItems={receiptData.selectedItems}
        totalAmount={receiptData.totalAmount}
        amountPaid={receiptData.amountPaid}
        balance={receiptData.balance}
        paymentMethod={receiptData.paymentMethod}
        paymentType={receiptData.paymentType}
        currentPaymentAmount={receiptData.currentPaymentAmount}
        isNewPayment={true}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl h-[90%] rounded-xl shadow-lg overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-lg font-medium text-[#101828]">
            Add New Payment
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <PatientSearch
            query={query}
            setQuery={setQuery}
            patientOptions={patientOptions}
            setPatientOptions={setPatientOptions}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            isLoading={isLoading}
            searchPatients={searchPatients}
          />

          {selectedPatient && (
            <>
              {/* Department Selection */}
              <div className="mb-6">
                <label
                  htmlFor="currentDepartment"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Department to Add Items*
                </label>
                <select
                  id="currentDepartment"
                  name="currentDepartment"
                  value={currentDepartment}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 outline-none focus:ring-primary focus:border-primary bg-white"
                >
                  <option value="">Select Department</option>
                  {departmentOptions.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Departments Summary */}
              {selectedDepartments.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Selected Departments ({selectedDepartments.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedDepartments.map((deptId) => (
                      <div
                        key={deptId}
                        className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3"
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                          <span className="font-medium text-primary">
                            {getDepartmentName(deptId)}
                          </span>
                          <span className="ml-2 text-sm text-primary/70">
                            ({getItemsCountByDepartment(deptId)} items)
                          </span>
                        </div>
                        <button
                          onClick={() => removeDepartment(deptId)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove department and all its items"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {currentDepartment && (
            <>
              <ItemSelection
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                isSelectOpen={isSelectOpen}
                setIsSelectOpen={setIsSelectOpen}
                itemSearch={itemSearch}
                setItemSearch={setItemSearch}
                departmentId={currentDepartment}
                items={items as ServiceItem[]}
                pharmacyStocks={pharmacyStocks as PharmacyStock[]}
                roles={roles}
              />
              <PaymentDetails
                activeTab={activeTab}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                paymentType={paymentType}
                setPaymentType={setPaymentType}
                paymentSourceType={paymentSourceType}
                setPaymentSourceType={setPaymentSourceType}
                paymentSource={paymentSource}
                setPaymentSource={setPaymentSource}
                partAmount={partAmount}
                setPartAmount={setPartAmount}
                selectedItems={selectedItems}
                totalAmount={totalAmount}
                rawTotalAmount={rawTotalAmount}
                hmoDiscount={hmoDiscount}
                doctors={doctors as Doctor[]}
                paymentSources={paymentSources as PaymentSource[]}
              />
            </>
          )}
        </div>
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div>
            <p className="text-xl font-bold text-green-600">
              Total: ₦{formatAmount(totalAmount)}
            </p>
            {selectedItems.length > 0 && (
              <p className="text-sm text-gray-500">
                {selectedItems.length} item(s) from {selectedDepartments.length}{" "}
                department(s)
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            {activeTab === "items" ? (
              <button
                onClick={() => setActiveTab("payment")}
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium flex items-center"
                disabled={
                  selectedItems.length === 0 || selectedDepartments.length === 0
                }
              >
                Continue to Payment
              </button>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab("items")}
                  className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setShowSummary(true)}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitDisabled}
                >
                  Process Payment
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <PaymentSummary
        hmoDiscount={hmoDiscount}
        showSummary={showSummary}
        setShowSummary={setShowSummary}
        selectedPatient={selectedPatient}
        selectedItems={selectedItems}
        totalAmount={totalAmount}
        paymentMethod={paymentMethod}
        paymentType={paymentType}
        partAmount={partAmount}
        setPartAmount={setPartAmount}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        firstName={""}
        lastName={""}
        cardId={""}
      />
    </div>
  );
};

export default AddPaymentModal;
