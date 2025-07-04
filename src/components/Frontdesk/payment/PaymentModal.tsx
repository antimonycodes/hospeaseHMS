import {
  X,
  Loader2,
  Trash2,
  Search,
  User,
  Plus,
  Minus,
  Check,
  ShoppingCart,
} from "lucide-react";
import { useCombinedStore } from "../../../store/super-admin/useCombinedStore";
import { useEffect, useState } from "react";
import PaymentDetails from "../../Finance/payment/PaymentDeets";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import PaymentSummary from "../../Finance/payment/PaymentSummary";
import toast from "react-hot-toast";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import PaymentReceipt from "../../Finance/payment/PaymentReceipt";
import { useReportStore } from "../../../store/super-admin/useReoprt";

interface PaymentItem {
  patient_id: number;
  amount: number;
  service_charge_id: number | null;
  request_pharmacy_id: number | null;
  doctor_bill_id: number;
  quantity: number;
  item_name: string;
  item_id?: number;
  unit_price?: number;
  service_type?: string;
  case_report_id?: number;
}

interface PaymentModalProps {
  patientId: string;
  paymentData: PaymentItem[];
  firstName: string;
  lastName: string;
  cardId: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  patientId,
  paymentData,
  firstName,
  lastName,
  cardId,
}) => {
  const { openPaymentModal, isPaymentModalOpen } = useCombinedStore();
  const [items, setItems] = useState<PaymentItem[]>(paymentData || []);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSource, setPaymentSource] = useState<string | null>(null);
  const [paymentSourceType, setPaymentSourceType] = useState<
    "doctor" | "payment_source" | null
  >(null);
  const [patientOptions, setPatientOptions] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("-");
  const [paymentType, setPaymentType] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [activeTab, setActiveTab] = useState("payment");
  const [itemSearch, setItemSearch] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);
  const [departmentId, setDepartmentId] = useState("");
  const [partAmount, setPartAmount] = useState("");
  const [hmoDiscount, setHmoDiscount] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0); // New state for amountPaid
  const [balance, setBalance] = useState(0); // New state for balance
  const [currentPayment, setCurrentPayment] = useState(0); // New state for currentPayment

  const {
    searchPatients,
    createPayment,
    isLoading,
    getAllDoctors,
    doctors,
    getPaymentSource,
    paymentSources,
  } = useFinanceStore();
  const { getAllRoles, roles } = useGlobalStore();
  const { getAllReport, allReports, getMedicalNote, allNotes } =
    useReportStore();

  useEffect(() => {
    getAllDoctors();
    getPaymentSource();
    getAllRoles();

    const storedHmoDiscount = localStorage.getItem("hmo");
    if (storedHmoDiscount) {
      setHmoDiscount(Number(storedHmoDiscount));
    }
  }, [getAllDoctors, getPaymentSource, getAllRoles]);

  // Calculate total amount (original amount)
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  // Calculate final amount (considering HMO discount)
  const calculateFinalTotal = () => {
    if (paymentMethod === "HMO" && hmoDiscount > 0) {
      return totalAmount * (hmoDiscount / 100); // Customer pays only the discount percentage
    }
    return totalAmount;
  };

  const finalTotalAmount = calculateFinalTotal();

  // Update quantity and recalculate amount
  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = [...items];
    const item = updatedItems[index];

    if (item.unit_price) {
      item.quantity = newQuantity;
      item.amount = item.unit_price * newQuantity;
    }

    setItems(updatedItems);
  };

  // Remove item from list
  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Transform items for receipt display
  const transformItemsForReceipt = () => {
    return items.map((item, index) => ({
      id: item.item_id || index,
      attributes: {
        amount: item.unit_price || item.amount, // Use unit_price for per-item price
        name: item.item_name,
        isPharmacy: item.request_pharmacy_id !== null,
        availableQuantity: item.quantity,
      },
      quantity: item.quantity,
      total: item.amount, // This should be the total amount (unit_price * quantity)
    }));
  };

  // Transform patient data for receipt
  const transformPatientForReceipt = () => {
    return {
      id: patientId,
      attributes: {
        first_name: firstName,
        last_name: lastName,
        card_id: cardId,
      },
    };
  };

  const handleSubmit = async () => {
    const endpoint = "frontdesk/save-patient-payment";
    const refreshEndpoint = "/finance/all-revenues";

    // Determine the correct department_id based on item types
    let correctDepartmentId = null;

    const hasPharmacyItems = items.some(
      (item) => item.request_pharmacy_id !== null
    );
    const hasLabItems = items.some((item) => item.service_charge_id !== null);

    if (hasPharmacyItems && hasLabItems) {
      correctDepartmentId = roles["pharmacist"]?.id;
    } else if (hasPharmacyItems) {
      correctDepartmentId = roles["pharmacist"]?.id;
    } else if (hasLabItems) {
      correctDepartmentId = roles["laboratory"]?.id;
    }

    const caseReportId = items.length > 0 ? items[0].case_report_id : null;

    const payload = {
      payment_source: paymentSource,
      payment_type: paymentType,
      total_amount: finalTotalAmount.toString(),
      part_amount:
        paymentType === "full"
          ? null
          : paymentType === "pending"
          ? "0"
          : partAmount,
      payment_method: paymentMethod,
      patient_id: Number(patientId),
      department_id: [correctDepartmentId],
      case_report_id: caseReportId,
      payments: items.map((item) => ({
        patient_id: Number(patientId),
        amount:
          paymentMethod === "HMO" && hmoDiscount > 0
            ? item.amount * (hmoDiscount / 100)
            : item.amount,
        service_charge_id: item.service_charge_id || null,
        request_pharmacy_id: item.request_pharmacy_id || null,
        doctor_bill_id: null,
        quantity: item.quantity,
        item_name: item.item_name,
      })),
    };

    try {
      const success = await createPayment(payload, endpoint, refreshEndpoint);
      if (success) {
        // Calculate payment details for receipt
        let currentPayment = 0;
        let amountPaid = 0;
        let balance = finalTotalAmount;

        if (paymentType === "full") {
          currentPayment = finalTotalAmount;
          amountPaid = finalTotalAmount;
          balance = 0;
        } else if (paymentType === "part") {
          currentPayment = parseAmount(partAmount) || finalTotalAmount;
          amountPaid = currentPayment;
          balance = finalTotalAmount - amountPaid;
        } else if (paymentType === "pending") {
          currentPayment = 0;
          amountPaid = 0;
          balance = finalTotalAmount;
        }

        setReceiptNumber(`RCP${Date.now().toString().slice(-8)}`);
        setPaymentDate(new Date());
        setSelectedItems(transformItemsForReceipt());
        setSelectedPatient(transformPatientForReceipt());
        setAmountPaid(amountPaid); // Update state with calculated amountPaid
        setBalance(balance); // Update state with calculated balance
        setCurrentPayment(currentPayment); // Update state with calculated currentPayment
        setPaymentComplete(true);
        setShowSummary(false);
        toast.success("Payment successfully processed");
      }
    } catch (error) {
      toast.error("Payment processing failed");
    }
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

  const fetchData = async () => {
    try {
      await getAllReport(patientId);
      await getMedicalNote(patientId, "doctor");
      await getMedicalNote(patientId, "consultant");
      await getMedicalNote(patientId, "medical-director");
    } catch (error) {
      console.error("Error fetching timeline data:", error);
      toast.error("Failed to load medical timeline");
    }
  };

  const handleClose = () => {
    openPaymentModal();
    fetchData();
  };

  if (paymentComplete) {
    return (
      <PaymentReceipt
        onClose={handleClose}
        receiptNumber={receiptNumber}
        paymentDate={paymentDate}
        selectedPatient={selectedPatient}
        selectedItems={selectedItems}
        totalAmount={finalTotalAmount}
        amountPaid={amountPaid} // Use state variable
        balance={balance} // Use state variable
        paymentMethod={paymentMethod}
        paymentType={paymentType}
        currentPaymentAmount={currentPayment} // Use state variable
        isNewPayment={true}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl h-[80%] rounded-xl shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-[#101828]">
              Process Payment
            </h2>
          </div>
          <button
            onClick={() => openPaymentModal()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="px-4 flex items-center gap-4">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="font-medium">
                {lastName} {firstName}
              </p>
              <p className="text-sm text-gray-500">Card ID: {cardId}</p>
            </div>
          </div>
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No items to process</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Items List */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-4">
                  Items to Process
                </h3>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          {item.item_name}
                        </h4>
                        <div className="text-sm text-gray-500 mt-1">
                          {item.service_type === "laboratory" ? (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                              Laboratory Service
                            </span>
                          ) : (
                            <>
                              <span>
                                Unit Price: ₦
                                {item.unit_price?.toFixed(2) || "0.00"}
                              </span>
                              {item.request_pharmacy_id && (
                                <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                  Pharmacy
                                </span>
                              )}
                            </>
                          )}
                          {item.case_report_id && (
                            <span className="ml-2 text-xs text-gray-400">
                              Report ID: {item.case_report_id}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Quantity Controls (only for pharmacy items) */}
                        {item.unit_price && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(index, item.quantity - 1)
                              }
                              className="p-1 rounded-full hover:bg-gray-100"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(index, item.quantity + 1)
                              }
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        )}

                        {/* Amount */}
                        <div className="text-right min-w-[80px]">
                          <span className="font-medium text-gray-800">
                            ₦{item.amount.toFixed(2)}
                          </span>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(index)}
                          className="p-1 rounded-full hover:bg-red-100 text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₦{totalAmount.toFixed(2)}</span>
                </div>

                {/* Show HMO discount if applicable */}
                {paymentMethod === "HMO" && hmoDiscount > 0 && (
                  <>
                    <div className="flex justify-between items-center mb-2 text-sm">
                      <span className="text-gray-600">
                        HMO Coverage ({100 - hmoDiscount}%):
                      </span>
                      <span className="text-red-500">
                        -₦
                        {(totalAmount * ((100 - hmoDiscount) / 100)).toFixed(2)}
                      </span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">
                        Patient Payment ({hmoDiscount}%):
                      </span>
                      <span className="text-lg font-bold text-primary">
                        ₦{finalTotalAmount.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}

                {/* Show normal total if not HMO */}
                {(paymentMethod !== "HMO" || hmoDiscount === 0) && (
                  <>
                    <hr className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-primary">
                        ₦{totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>

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
                totalAmount={finalTotalAmount}
                rawTotalAmount={totalAmount}
                hmoDiscount={hmoDiscount}
                doctors={doctors as any[]}
                paymentSources={paymentSources as any[]}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {items.length} item{items.length !== 1 ? "s" : ""} •
              {paymentMethod === "HMO" && hmoDiscount > 0 ? (
                <>
                  <span className="ml-1">
                    Original: ₦{totalAmount.toFixed(2)} • Patient pays: ₦
                    {finalTotalAmount.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="ml-1">Total: ₦{totalAmount.toFixed(2)}</span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => openPaymentModal()}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSummary(true)}
                disabled={items.length === 0 || isProcessing}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Process Payment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <PaymentSummary
        hmoDiscount={hmoDiscount}
        showSummary={showSummary}
        setShowSummary={setShowSummary}
        selectedPatient={selectedPatient}
        cardId={cardId}
        firstName={firstName}
        lastName={lastName}
        selectedItems={selectedItems}
        totalAmount={finalTotalAmount}
        paymentMethod={paymentMethod}
        paymentType={paymentType}
        partAmount={partAmount}
        setPartAmount={setPartAmount}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default PaymentModal;
