import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Button from "../../../Shared/Button";
import Loader from "../../../Shared/Loader";
import PaymentReceipt from "./PaymentReceipt"; // Import your receipt component
import toast from "react-hot-toast";
import PaymentHistory from "./PaymentHistory";

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined | React.ReactNode;
}) => (
  <div>
    <p className="text-gray-500 text-sm">{label}</p>
    {typeof value === "object" ? (
      value
    ) : (
      <p className="font-medium">{value || "-"}</p>
    )}
  </div>
);

const PaymentStatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case "full":
        return "bg-[#CCFFE7] text-[#009952]";
      case "partial":
      case "part":
        return "bg-[#FEF3CD] text-[#B58A00]";
      case "pending":
        return "bg-[#FBE1E1] text-[#F83E41]";
      case "refunded":
        return "bg-[#E1F5FE] text-[#0288D1]";
      case "partial-refund":
        return "bg-[#FFF3E0] text-[#EF6C00]";
      default:
        return "bg-[#FBE1E1] text-[#F83E41]";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
    >
      {status === "full"
        ? "Paid in Full"
        : status === "partial" || status === "part"
        ? "Partially Paid"
        : status === "pending"
        ? "Pending Payment"
        : status === "refunded"
        ? "Refunded"
        : status === "partial-refund"
        ? "Partially Refunded"
        : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Updated helper function to extract item name and details with proper unit price calculation
const getItemDetails = (item: any) => {
  const attrs = item.attributes;

  // Check for service_charge first
  if (attrs.service_charge && attrs.service_charge.name) {
    const totalAmount = parseFloat(attrs.amount.replace(/,/g, ""));
    return {
      name: attrs.service_charge.name,
      quantity: 1,
      unitPrice: totalAmount, // Use amount as unit price for services
      totalAmount: totalAmount,
      type: "Service Charge",
    };
  }

  // Check for pharmacy_reqs
  if (attrs.pharmacy_reqs && attrs.pharmacy_reqs.item) {
    const totalAmount = parseFloat(attrs.amount.replace(/,/g, ""));
    const serviceItemPrice = parseFloat(attrs.pharmacy_reqs.service_item_price);

    // Calculate actual quantity manually: total amount ÷ unit price
    const actualQuantity = Math.round(totalAmount / serviceItemPrice);

    return {
      name: attrs.pharmacy_reqs.item,
      quantity: actualQuantity, // Use calculated quantity instead of backend quantity
      unitPrice: serviceItemPrice, // Use service_item_price as unit price
      totalAmount: totalAmount,
      type: "Pharmacy Item",
    };
  }

  // Check for doctor_bill
  if (attrs.doctor_bill && attrs.doctor_bill.name) {
    const totalAmount = parseFloat(attrs.amount.replace(/,/g, ""));
    return {
      name: attrs.doctor_bill.name,
      quantity: 1,
      unitPrice: totalAmount,
      totalAmount: totalAmount,
      type: "Doctor Bill",
    };
  }

  // Fallback for unknown structure
  const totalAmount = parseFloat(attrs.amount?.replace(/,/g, "") || "0");
  return {
    name: attrs.items_purchased || "Unknown Item",
    quantity: attrs.quantity || 1,
    unitPrice: totalAmount,
    totalAmount: totalAmount,
    type: "Other",
  };
};

// Helper function to prepare receipt data
// const prepareReceiptData = (
//   serviceCharges: any[],
//   paymentInfo: any,
//   paymentMethod: string,
//   paymentType: string,
//   currentPaymentAmount: number
// ) => {
//   // Calculate totals from payment info
//   const totalAmount = parseFloat(
//     paymentInfo.attributes.amount?.replace(/,/g, "") || "0"
//   );
//   const previousPayments =
//     parseFloat(paymentInfo.attributes.part_amount?.replace(/,/g, "") || "0") -
//     currentPaymentAmount;
//   const amountPaid = previousPayments + currentPaymentAmount;
//   const balance = totalAmount - amountPaid;

//   // Prepare receipt items
//   const receiptItems = serviceCharges.map((item: any) => {
//     const itemDetails = getItemDetails(item);
//     return {
//       id: item.id,
//       attributes: {
//         amount: itemDetails.unitPrice,
//         name: itemDetails.name,
//         isPharmacy: itemDetails.type === "Pharmacy Item",
//       },
//       quantity: itemDetails.quantity,
//       total: itemDetails.totalAmount,
//     };
//   });

//   return {
//     receiptNumber: paymentInfo.id,
//     paymentDate: new Date(),
//     selectedPatient: {
//       id: paymentInfo.attributes.patient?.id,
//       attributes: {
//         first_name: paymentInfo.attributes.patient?.first_name,
//         last_name: paymentInfo.attributes.patient?.last_name,
//         card_id: paymentInfo.attributes.patient?.card_id || "",
//       },
//     },
//     selectedItems: receiptItems,
//     totalAmount: totalAmount,
//     amountPaid: amountPaid,
//     balance: balance,
//     paymentMethod: paymentMethod,
//     paymentType: paymentType,
//     currentPaymentAmount: currentPaymentAmount,
//   };
// };
const prepareReceiptData = (
  serviceCharges: any[],
  paymentInfo: any,
  paymentMethod: string,
  paymentType: string,
  currentPaymentAmount: number
) => {
  // Calculate totals from payment info
  const totalAmount = parseFloat(
    paymentInfo.attributes.amount?.replace(/,/g, "") || "0"
  );

  // Get the total amount that was paid before this transaction
  const totalPaidSoFar = parseFloat(
    paymentInfo.attributes.part_amount?.replace(/,/g, "") || "0"
  );

  // Calculate previous payments (what was paid before this current payment)
  const previousPayments = totalPaidSoFar;

  // Calculate total paid after this payment
  const totalPaidAfter = totalPaidSoFar + currentPaymentAmount;

  // Calculate remaining balance
  const balance = totalAmount - totalPaidAfter;

  // Prepare receipt items
  const receiptItems = serviceCharges.map((item: any) => {
    const itemDetails = getItemDetails(item);
    return {
      id: item.id,
      attributes: {
        amount: itemDetails.unitPrice,
        name: itemDetails.name,
        isPharmacy: itemDetails.type === "Pharmacy Item",
      },
      quantity: itemDetails.quantity,
      total: itemDetails.totalAmount,
    };
  });

  return {
    receiptNumber: paymentInfo.id,
    paymentDate: new Date(),
    selectedPatient: {
      id: paymentInfo.attributes.patient?.id,
      attributes: {
        first_name: paymentInfo.attributes.patient?.first_name,
        last_name: paymentInfo.attributes.patient?.last_name,
        card_id: paymentInfo.attributes.patient?.card_id || "",
      },
    },
    selectedItems: receiptItems,
    totalAmount: totalAmount,
    amountPaid: totalPaidAfter, // Total amount paid so far
    balance: Math.max(0, balance), // Ensure balance is never negative
    paymentMethod: paymentMethod,
    paymentType: paymentType,
    currentPaymentAmount: currentPaymentAmount,
    previousPayments: Math.max(0, previousPayments), // What was paid before this payment
  };
};
const PaymentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { selectedPayment, getPaymentById, updatePayment, refundPayment } =
    useFinanceStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [amountToPay, setAmountToPay] = useState("0");
  const [originalPrice, setOriginalPrice] = useState<number | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundType, setRefundType] = useState<"full" | "partial">("full");
  const [refundAmountInput, setRefundAmountInput] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const attributes = selectedPayment?.attributes || {};
  const serviceCharges = attributes.purchased_item || [];

  // Add payment method options
  const paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "pos", label: "POS" },
    { value: "transfer", label: "Transfer" },
    { value: "hmo", label: "HMO" },
  ];

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    attributes.payment_method?.toLowerCase() || "transfer"
  );

  useEffect(() => {
    if (id) {
      getPaymentById(id)
        .then(() => setIsLoading(false))
        .catch((error) => {
          console.error("Error fetching payment:", error);
          setIsLoading(false);
        });
    }
  }, [id, getPaymentById]);

  const handleRefund = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        type: refundType,
        amount: refundType === "full" ? null : parseFloat(refundAmountInput),
      };

      const success = await refundPayment(selectedPayment.id, payload);
      if (success) {
        await getPaymentById(selectedPayment.id);

        // Use the new receipt preparation function
        const receiptDataObj = prepareReceiptData(
          serviceCharges,
          selectedPayment,
          selectedPaymentMethod,
          refundType === "full" ? "refunded" : "partial-refund",
          refundType === "partial" ? parseFloat(refundAmountInput) : 0
        );

        setReceiptData(receiptDataObj);
        setShowReceipt(true);
        setShowRefundModal(false);
      }
    } catch (error) {
      console.error("Refund failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    if (
      selectedPayment &&
      selectedPayment.attributes?.payment_method?.toLowerCase() === "hmo"
    ) {
      const hmoPercentage = localStorage.getItem("hmo");
      if (hmoPercentage) {
        const hmoRate = parseFloat(hmoPercentage);
        const totalAmount = parseFloat(
          selectedPayment.attributes.amount?.replace(/,/g, "") || "0"
        );
        const calculatedOriginalPrice = (totalAmount / hmoRate) * 100;
        setOriginalPrice(calculatedOriginalPrice);
      }
    }
  }, [selectedPayment]);

  if (isLoading) {
    return <Loader />;
  }

  if (!selectedPayment) {
    return (
      <div className="flex items-center justify-center h-screen">
        Payment not found
      </div>
    );
  }

  // Calculate financial values
  const totalAmount = parseFloat(attributes.amount?.replace(/,/g, "") || 0);
  const partAmount = parseFloat(
    attributes.part_amount?.replace(/,/g, "") || "0"
  );
  const refundedAmount = parseFloat(
    attributes.amount_refunded?.replace(/,/g, "") || 0
  );

  // Calculate net amount paid (original payment minus any refunds)
  const netAmountPaid = Math.max(0, partAmount - refundedAmount);

  // Calculate outstanding amount
  const outstanding = Math.max(0, totalAmount - netAmountPaid);

  // Format currency values
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formattedTotalAmount = formatCurrency(totalAmount);
  const formattedNetAmountPaid = formatCurrency(netAmountPaid);
  const formattedRefundedAmount = formatCurrency(refundedAmount);
  const formattedOutstanding = formatCurrency(outstanding);

  // Get formatted payment type for display
  const paymentTypeDisplay =
    attributes.payment_type === "full"
      ? "Full Payment"
      : attributes.payment_type === "part" ||
        attributes.payment_type === "partial"
      ? "Partial Payment"
      : attributes.payment_type === "pending"
      ? "Pending"
      : attributes.payment_type?.includes("refund")
      ? "Refund Processed"
      : attributes.payment_type?.charAt(0).toUpperCase() +
          attributes.payment_type?.slice(1) || "Unknown";

  const departmentNames =
    attributes.department?.map((dept: any) => dept.name).join(", ") || "-";

  const handlePaymentAction = (type: string) => {
    setPaymentType(type);
    setAmountToPay(type === "full" ? outstanding.toString() : "");
    setShowPaymentModal(true);
  };

  // const handleSubmitPayment = async () => {
  //   if (!amountToPay || parseFloat(amountToPay) <= 0) {
  //     alert("Please enter a valid amount");
  //     return;
  //   }

  //   const amount = parseFloat(amountToPay);
  //   const paymentTypeToUse = amount >= outstanding ? "full" : paymentType;

  //   const payload = {
  //     payment_type: paymentTypeToUse,
  //     amount_paid: amount,
  //     payment_method: selectedPaymentMethod,
  //   };

  //   setIsSubmitting(true);
  //   try {
  //     const result = await updatePayment(id, payload);
  //     if (result) {
  //       await getPaymentById(id ?? "");

  //       // Prepare receipt with updated data
  //       const receiptDataObj = prepareReceiptData(
  //         serviceCharges,
  //         selectedPayment,
  //         selectedPaymentMethod,
  //         paymentTypeToUse,
  //         amount
  //       );

  //       setReceiptData(receiptDataObj);
  //       setShowReceipt(true);
  //       setShowPaymentModal(false);
  //     }
  //   } catch (error) {
  //     console.error("Payment update failed:", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmitPayment = async () => {
    if (!amountToPay || parseFloat(amountToPay) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const amount = parseFloat(amountToPay);
    const paymentTypeToUse = amount >= outstanding ? "full" : paymentType;

    const payload = {
      payment_type: paymentTypeToUse,
      amount_paid: amount,
      payment_method: selectedPaymentMethod,
    };

    setIsSubmitting(true);
    try {
      const result = await updatePayment(id, payload);
      if (result) {
        await getPaymentById(id ?? "");

        // Prepare receipt with updated data
        const receiptDataObj = prepareReceiptData(
          serviceCharges,
          selectedPayment,
          selectedPaymentMethod,
          paymentTypeToUse,
          amount
        );

        setReceiptData(receiptDataObj);
        setShowReceipt(true);
        setShowPaymentModal(false);
      }
    } catch (error) {
      console.error("Payment update failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const closeModal = () => {
    setShowPaymentModal(false);
    setPaymentType("");
    setAmountToPay("0");
    setSelectedPaymentMethod(
      attributes.payment_method?.toLowerCase() || "transfer"
    );
  };

  const isHmoPayment = attributes.payment_method?.toLowerCase() === "hmo";

  return (
    <div className="">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div onClick={() => navigate(-1)} className="flex items-center mb-4">
          <button className="mr-1 text-custom-black">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg md:text-sm font-medium text-custom-black">
            Payments
          </h2>
        </div>

        <div className="mb-4">
          <PaymentStatusBadge status={attributes.payment_type || "unknown"} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <InfoRow label="Payment ID" value={selectedPayment.id} />
          <InfoRow label="Patient ID" value={attributes.patient?.id} />
          <InfoRow label="Last Name" value={attributes.patient?.last_name} />
          <InfoRow label="First Name" value={attributes.patient?.first_name} />
          <InfoRow label="Department" value={departmentNames} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {isHmoPayment && originalPrice && (
            <InfoRow
              label="Original Price"
              value={`₦${formatCurrency(originalPrice)}`}
            />
          )}
          <InfoRow label="Total Amount" value={`₦${formattedTotalAmount}`} />
          <InfoRow label="Amount Paid" value={`₦${formattedNetAmountPaid}`} />
          <InfoRow
            label="Payment Type"
            value={
              <div className="flex items-center space-x-2 mt-1">
                <span>{paymentTypeDisplay}</span>
              </div>
            }
          />
          {refundedAmount > 0 && (
            <InfoRow
              label="Amount Refunded"
              value={`-₦${formattedRefundedAmount}`}
            />
          )}
          {outstanding > 0 && (
            <InfoRow label="Outstanding" value={`₦${formattedOutstanding}`} />
          )}
          <InfoRow label="Payment Method" value={attributes.payment_method} />
          <InfoRow label="Date" value={attributes.created_at} />
        </div>

        <div className="flex space-x-2 mt-8">
          {outstanding > 0 && (
            <>
              <button
                className="rounded-sm text-primary border border-primary py-2 px-3"
                onClick={() => handlePaymentAction("part")}
              >
                Make Part Payment
              </button>
              <button
                className="rounded-sm text-white bg-primary py-2 px-3"
                onClick={() => handlePaymentAction("full")}
              >
                Full Payment
              </button>
            </>
          )}
          <button
            className="rounded-sm text-white border bg-red-800 py-2 px-3"
            onClick={() => setShowRefundModal(true)}
          >
            Refund
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Order Summary</h3>
          <div className="space-y-2">
            {serviceCharges.map((item: any) => {
              const itemDetails = getItemDetails(item);
              return (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-600">
                    {itemDetails.name}
                    {itemDetails.quantity > 1
                      ? ` x${itemDetails.quantity}`
                      : ""}
                    <span className="text-xs text-gray-400 ml-2">
                      ({itemDetails.type})
                    </span>
                    {itemDetails.quantity > 1 && (
                      <span className="text-xs text-gray-400 ml-2">
                        @ ₦{formatCurrency(itemDetails.unitPrice)} each
                      </span>
                    )}
                  </span>
                  <span className="font-medium">
                    ₦{formatCurrency(itemDetails.totalAmount)}
                  </span>
                </div>
              );
            })}

            {isHmoPayment && originalPrice && (
              <div className="flex justify-between text-gray-500">
                <span>Original Price</span>
                <span>₦{formatCurrency(originalPrice)}</span>
              </div>
            )}

            <div className="border-t pt-2 mt-4 flex justify-between">
              <span className="font-medium text-green-600">Total</span>
              <span className="font-medium text-green-600">
                ₦{formattedTotalAmount}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Amount Paid</span>
              <span className="font-medium">₦{formattedNetAmountPaid}</span>
            </div>

            {refundedAmount > 0 && (
              <div className="flex justify-between">
                <span className="font-medium">Amount Refunded</span>
                <span className="font-medium text-red-600">
                  -₦{formattedRefundedAmount}
                </span>
              </div>
            )}

            {outstanding > 0 && (
              <div className="flex justify-between">
                <span className="font-medium">Balance</span>
                <span className="font-medium">₦{formattedOutstanding}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment History Section */}
        <PaymentHistory paymentHistory={attributes.payment_history} />
      </div>

      {showRefundModal && (
        <div className="fixed inset-0 bg-[#1E1E1E40] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Process Refund</h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Refund Type
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={refundType}
                onChange={(e) => {
                  setRefundType(e.target.value as "full" | "partial");
                  if (e.target.value === "full") {
                    setRefundAmountInput("");
                  }
                }}
              >
                <option value="full">Full Refund</option>
                <option value="partial">Partial Refund</option>
              </select>
            </div>

            {refundType === "partial" && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Refund Amount (₦)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={refundAmountInput}
                  onChange={(e) => setRefundAmountInput(e.target.value)}
                  min="0"
                  max={netAmountPaid}
                />
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setRefundType("full");
                  setRefundAmountInput("");
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleRefund}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                disabled={
                  isSubmitting ||
                  (refundType === "partial" && !refundAmountInput)
                }
              >
                {isSubmitting ? "Processing..." : "Process Refund"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-[#1E1E1E40] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              {paymentType === "full" ? "Full Payment" : "Part Payment"}
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Payment Method
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              >
                {paymentMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Amount to Pay (₦)
              </label>
              <input
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={amountToPay}
                onChange={(e) => setAmountToPay(e.target.value)}
                disabled={paymentType === "full"}
                min="0"
                max={outstanding}
              />
              {paymentType === "full" && (
                <p className="text-sm text-gray-500 mt-1">
                  Full payment amount is pre-filled and cannot be modified.
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPayment}
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Submit Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {/* Updated Receipt Modal call */}
      {showReceipt && receiptData && (
        <PaymentReceipt
          onClose={() => setShowReceipt(false)}
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
          refundAmount={receiptData.refundAmount}
          previousPayments={receiptData.previousPayments} // Add this line
        />
      )}
    </div>
  );
};

export default PaymentDetails;
