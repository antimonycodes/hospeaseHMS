import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Loader2,
  Trash2,
  Search,
  CreditCard,
  DollarSign,
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

interface Role {
  id: number;
  role: string;
}

interface RolesState {
  [key: string]: Role;
}

interface AddPaymentModalProps {
  onClose: () => void;
  endpoint?: string;
  refreshEndpoint?: string;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  onClose,
  endpoint = "frontdesk/save-patient-payment",
  refreshEndpoint = "/finance/all-revenues",
}) => {
  const { searchPatients, createPayment, isLoading } = useFinanceStore();
  const { getAllPatientsNoPerPage } = usePatientStore();
  const { getAllItems, items } = useCombinedStore();
  const { getPharmacyStocks, pharmacyStocks } = useReportStore();
  const { getAllRoles } = useGlobalStore();
  const roles = useGlobalStore((state) => state.roles) as RolesState;

  const [query, setQuery] = useState("");
  const [patientOptions, setPatientOptions] = useState<
    {
      id: string;
      attributes: { first_name: string; last_name: string; card_id: string };
    }[]
  >([]);
  const [selectedPatient, setSelectedPatient] = useState<{
    id: string;
    attributes: { first_name: string; last_name: string; card_id: string };
  } | null>(null);
  const [selectedItems, setSelectedItems] = useState<
    {
      id: any;
      attributes: {
        amount?: string | number | null;
        name?: string;
        isPharmacy?: boolean;
      };
      quantity: number;
      total: number;
    }[]
  >([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [activeTab, setActiveTab] = useState("items");
  const [itemSearch, setItemSearch] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);
  const [departmentId, setDepartmentId] = useState("");
  const [partAmount, setPartAmount] = useState("");

  const allowedDepartments = ["pharmacist", "laboratory", "finance"];
  const getDepartmentOptions = () => {
    if (!roles) return [];
    return allowedDepartments
      .filter((dept) => roles[dept])
      .map((dept) => ({
        id: roles[dept]?.id.toString(),
        name: dept.charAt(0).toUpperCase() + dept.slice(1),
      }));
  };

  const departmentOptions = getDepartmentOptions();

  useEffect(() => {
    getAllPatientsNoPerPage();
    getAllItems();
    getAllRoles();
    getPharmacyStocks();
  }, [getAllPatientsNoPerPage, getAllItems, getAllRoles, getPharmacyStocks]);

  const paymentTypeOptions = [
    { value: "full", label: "Full Payment" },
    { value: "part", label: "Part Payment" },
  ];

  const handleSearch = debounce(async (val) => {
    if (val.length > 2) {
      const results = await searchPatients(val);
      setPatientOptions(results || []);
    } else {
      setPatientOptions([]);
    }
  }, 300);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    if (name === "query") {
      setQuery(value);
      handleSearch(value);
    } else if (name === "payment_method") {
      setPaymentMethod(value);
    } else if (name === "payment_type") {
      setPaymentType(value);
    } else if (name === "itemSearch") {
      setItemSearch(value);
    } else if (name === "part_amount") {
      setPartAmount(value);
    }
  };

  const handleSelectPatient = (patient: {
    id: string;
    attributes: { first_name: string; last_name: string; card_id: string };
  }) => {
    setSelectedPatient(patient);
    setQuery(
      `${patient?.attributes.first_name} ${patient.attributes.last_name}`
    );
    setPatientOptions([]);
  };

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

  const handleToggleItem = (item: {
    id: any;
    attributes: {
      amount?: string | number | null;
      name?: string;
      service_item_name?: string;
      service_item_price?: string | number | null;
      isPharmacy?: boolean;
    };
  }) => {
    const exists = selectedItems.find((i) => i.id === item.id);
    const amount = item.attributes.isPharmacy
      ? parseAmount(item.attributes.service_item_price)
      : parseAmount(item.attributes.amount);
    const name = item.attributes.isPharmacy
      ? item.attributes.service_item_name
      : item.attributes.name;

    if (!exists) {
      setSelectedItems((prev) => [
        ...prev,
        {
          ...item,
          attributes: {
            ...item.attributes,
            amount,
            name,
            isPharmacy: item.attributes.isPharmacy || false,
          },
          quantity: 1,
          total: amount,
        },
      ]);
      toast.success(`Added ${name || "item"} to selection`);
    } else {
      setSelectedItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success(`Removed ${name || "item"} from selection`);
    }
  };

  const updateQuantity = (index: number, delta: number) => {
    setSelectedItems((prev) => {
      const updated = [...prev];
      const item = updated[index];
      item.quantity = Math.max(1, item.quantity + delta);
      item.total = parseAmount(item.attributes.amount) * item.quantity;
      return updated;
    });
  };

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const removeItem = (index: number) => {
    const itemName = selectedItems[index].attributes.name || "Item";
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
    toast.success(`Removed ${itemName} from selection`);
  };

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = async () => {
    const payload = {
      payment_type: paymentType,
      total_amount: totalAmount.toString(),
      part_amount: paymentType === "full" ? null : partAmount,
      payment_method: paymentMethod,
      patient_id: Number(selectedPatient?.id),
      department_id: Number(departmentId),
      payments: selectedItems.map((item) => ({
        patient_id: Number(selectedPatient?.id),
        amount: item.total,
        service_charge_id: item.attributes.isPharmacy ? null : Number(item.id),
        request_pharmacy_id: item.attributes.isPharmacy
          ? Number(item.id)
          : null,
        quantity: item.quantity,
        item_name: item.attributes.name,
      })),
    };

    try {
      const success = await createPayment(payload, endpoint, refreshEndpoint);
      if (success) {
        setReceiptNumber(`RCP${Date.now().toString().slice(-8)}`);
        setPaymentDate(new Date());
        setPaymentComplete(true);
        setShowSummary(false);
        toast.success("Payment successfully processed");
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
    !departmentId;

  const isPharmacySelected = departmentOptions.find(
    (dept) =>
      dept.id === departmentId && dept.name.toLowerCase() === "pharmacist"
  );

  const filteredItems = isPharmacySelected
    ? pharmacyStocks?.filter((item) =>
        item.service_item_name?.toLowerCase().includes(itemSearch.toLowerCase())
      ) || []
    : items?.filter((item) =>
        item.attributes.name?.toLowerCase().includes(itemSearch.toLowerCase())
      ) || [];

  const normalizedItems = filteredItems.map((item) => ({
    id: item.request_pharmacy_id || item.id,
    attributes: {
      amount: isPharmacySelected
        ? item.service_item_price
        : item.attributes.amount,
      name: isPharmacySelected ? item.service_item_name : item.attributes.name,
      service_item_name: isPharmacySelected
        ? item.service_item_name
        : undefined,
      service_item_price: isPharmacySelected
        ? item.service_item_price
        : undefined,
      isPharmacy: isPharmacySelected,
    },
  }));

  const isItemSelected = (id: any) =>
    selectedItems.some((item) => item.id === id);

  if (paymentComplete) {
    return (
      <PaymentReceipt
        onClose={onClose}
        receiptNumber={receiptNumber}
        paymentDate={paymentDate}
        selectedPatient={selectedPatient}
        selectedItems={selectedItems}
        totalAmount={totalAmount}
        paymentMethod={paymentMethod}
        paymentType={paymentType}
        partAmount={parseAmount(partAmount)}
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
              <div>
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
                <div className="mb-6">
                  <label
                    htmlFor="departmentId"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Department*
                  </label>
                  <select
                    id="departmentId"
                    name="departmentId"
                    value={departmentId}
                    onChange={(e) => {
                      setDepartmentId(e.target.value);
                      setSelectedItems([]);
                    }}
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
              </div>
            )}
          </div>
          <div className="mb-6">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab("items")}
                className={`py-3 border-b-2 font-medium ${
                  activeTab === "items"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Select Items
              </button>
              <button
                onClick={() => setActiveTab("payment")}
                className={`py-3 border-b-2 font-medium ${
                  activeTab === "payment"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Payment Details
              </button>
            </div>
          </div>
          {activeTab === "items" ? (
            <>
              <div className="mb-8">
                <h3 className="font-semibold mb-3 text-gray-700">
                  Select Items (Multiple)
                </h3>
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
                        {normalizedItems.map((item) => (
                          <li
                            key={item.id}
                            onClick={() =>
                              handleToggleItem({
                                ...item,
                                attributes: {
                                  ...item.attributes,
                                  isPharmacy: !!item.attributes.isPharmacy,
                                },
                              })
                            }
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium">
                                {item.attributes.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                ₦
                                {formatAmount(
                                  parseAmount(item.attributes.amount)
                                )}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded border flex items-center justify-center ${
                                isItemSelected(item.id)
                                  ? "bg-blue-500 border-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {isItemSelected(item.id) && (
                                <Check className="h-4 w-4 text-white" />
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              {selectedItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-gray-700">
                    Selected Items
                  </h3>
                  <ul className="bg-white border rounded-lg divide-y">
                    {selectedItems.map((item, index) => (
                      <li
                        key={index}
                        className="p-4 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.attributes.name}</p>
                          <p className="text-sm text-gray-500">
                            ₦{formatAmount(parseAmount(item.attributes.amount))}{" "}
                            per unit
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(index, -1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="mx-2 w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(index, 1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="font-medium text-green-600 w-24 text-right">
                            ₦{formatAmount(item.total)}
                          </p>
                          <button
                            onClick={() => removeItem(index)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#101928] mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {["cash", "pos", "transfer", "HMO"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`flex items-center justify-center border px-4 py-3 rounded-lg ${
                        paymentMethod === method
                          ? "bg-primary border-primary text-white"
                          : "border-[#E4E4E7] text-[#A1A1AA]"
                      }`}
                    >
                      <span className="capitalize">{method}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#101928] mb-2">
                  Payment Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentTypeOptions.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setPaymentType(type.value)}
                      type="button"
                      className={`border px-4 py-3 rounded-lg ${
                        paymentType === type.value
                          ? "bg-primary border-primary text-white"
                          : "border-[#E4E4E7] text-[#A1A1AA]"
                      }`}
                    >
                      <span className="capitalize">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {paymentType === "part" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Part Amount
                  </label>
                  <input
                    type="number"
                    name="part_amount"
                    value={partAmount}
                    onChange={handleChange}
                    placeholder="Enter part amount"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              )}
              {selectedItems.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <h4 className="font-medium text-[#101928] mb-3">
                    Order Summary
                  </h4>
                  <ul className="space-y-2 mb-3">
                    {selectedItems.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span className="text-[#98A2B3] text-lg">
                          {item.attributes.name} × {item.quantity}
                        </span>
                        <span className="font-medium text-[#101928]">
                          ₦{formatAmount(item.total)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-green-600">
                      ₦{formatAmount(totalAmount)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div>
            <p className="text-xl font-bold text-green-600">
              Total: ₦{formatAmount(totalAmount)}
            </p>
            {selectedItems.length > 0 && (
              <p className="text-sm text-gray-500">
                {selectedItems.length} item(s)
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            {activeTab === "items" ? (
              <button
                onClick={() => setActiveTab("payment")}
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium flex items-center"
                disabled={selectedItems.length === 0 || !departmentId}
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
      {showSummary && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Confirm Payment</h3>
              <button
                onClick={() => setShowSummary(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-500 mb-3">Patient</p>
              <p className="font-medium">
                {selectedPatient?.attributes.first_name}{" "}
                {selectedPatient?.attributes.last_name}
              </p>
              <p className="text-sm text-gray-500">
                Card ID: {selectedPatient?.attributes.card_id}
              </p>
            </div>
            <ul className="mb-4 divide-y">
              {selectedItems.map((item, index) => (
                <li key={index} className="flex justify-between py-2">
                  <span className="text-gray-700">
                    {item.attributes.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ₦{formatAmount(item.total)}
                  </span>
                </li>
              ))}
            </ul>
            {paymentType === "part" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Part Amount
                </label>
                <input
                  type="number"
                  name="part_amount"
                  value={partAmount}
                  onChange={handleChange}
                  placeholder="Enter part amount"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            )}
            <div className="border-t pt-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Amount</span>
                <span className="text-xl font-bold text-green-600">
                  ₦{formatAmount(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
                <span>Payment Method</span>
                <span className="capitalize">{paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
                <span>Payment Type</span>
                <span className="capitalize">{paymentType}</span>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowSummary(false)}
                className="border px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-primary text-white px-6 py-2 rounded-lg flex items-center justify-center min-w-32"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Confirm Payment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPaymentModal;
