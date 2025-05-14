import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react"; // Added import for useState and useEffect
import { ArrowLeft } from "lucide-react";
import Button from "../../../Shared/Button";
import Loader from "../../../Shared/Loader";

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
        : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const PaymentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { selectedPayment, getPaymentById, updatePayment } = useFinanceStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [amountToPay, setAmountToPay] = useState("0");
  const [originalPrice, setOriginalPrice] = useState<number | null>(null);

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

  useEffect(() => {
    // Calculate original price for HMO payment method
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

        const calculatedOriginalPrice = totalAmount * hmoRate;
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

  const attributes = selectedPayment.attributes || {};
  const serviceCharges = attributes.purchased_item || [];

  // Calculate financial values
  const totalAmount = parseFloat(attributes.amount?.replace(/,/g, "") || "0");
  const partAmount = parseFloat(
    attributes.part_amount?.replace(/,/g, "") || "0"
  );
  const outstanding = totalAmount - partAmount;

  // Handle display values based on payment type
  const formattedTotalAmount = attributes.amount || "0.00";

  // For display: if it's full payment, amount paid should be total amount
  // If it's partial payment, amount paid should be part_amount
  // If it's pending, amount paid should be 0
  const amountPaidDisplay =
    attributes.payment_type === "full"
      ? formattedTotalAmount
      : attributes.payment_type === "part" ||
        attributes.payment_type === "partial"
      ? attributes.part_amount || "0.00"
      : "0.00"; // For pending

  // Get formatted payment type for display
  const paymentTypeDisplay =
    attributes.payment_type === "full"
      ? "Full Payment"
      : attributes.payment_type === "part" ||
        attributes.payment_type === "partial"
      ? "Half Payment"
      : attributes.payment_type === "pending"
      ? "Pending"
      : attributes.payment_type?.charAt(0).toUpperCase() +
          attributes.payment_type?.slice(1) || "Unknown";

  const handlePaymentAction = (type: any) => {
    setPaymentType(type);
    setAmountToPay(type === "full" ? outstanding.toString() : "");
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = async () => {
    if (!amountToPay || parseFloat(amountToPay) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (paymentType === "part" && parseFloat(amountToPay) >= outstanding) {
      // If paying an amount equal to or greater than outstanding, make it a full payment
      setPaymentType("full");
    }

    const payload = {
      payment_type: paymentType,
      amount_paid: parseFloat(amountToPay),
    };

    setIsSubmitting(true);
    try {
      const result = await updatePayment(id, payload);
      if (result) {
        // Refresh payment data
        await getPaymentById(id ?? "");
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
  };

  // Format number with commas for currency display
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const isHmoPayment = attributes.payment_method?.toLowerCase() === "hmo";

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div onClick={() => navigate(-1)} className="flex items-center mb-4">
          <button className="mr-1 text-custom-black">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg md:text-sm font-medium text-custom-black">
            Payments
          </h2>
        </div>

        {/* Payment Status Badge - Added at the top for visibility */}
        <div className="mb-4">
          <PaymentStatusBadge status={attributes.payment_type || "unknown"} />
        </div>

        {/* Payment Details */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <InfoRow label="Payment ID" value={selectedPayment.id} />
          <InfoRow label="Patient ID" value={attributes.patient?.id} />
          <InfoRow label="Last Name" value={attributes.patient?.last_name} />
          <InfoRow label="First Name" value={attributes.patient?.first_name} />
          <InfoRow label="Purpose" value={attributes.department?.name} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <InfoRow label="Department" value={attributes.department?.name} />

          {/* Display Original Price for HMO payment method */}
          {isHmoPayment && originalPrice && (
            <InfoRow
              label="Original Price"
              value={`₦${formatCurrency(originalPrice)}`}
            />
          )}

          <InfoRow label="Total Amount" value={`₦${formattedTotalAmount}`} />
          <InfoRow label="Amount Paid" value={`₦${amountPaidDisplay}`} />
          <InfoRow
            label="Payment Type"
            value={
              <div className="flex items-center space-x-2 mt-1">
                <span>{paymentTypeDisplay}</span>
              </div>
            }
          />
          {/* Show outstanding amount for all payment types except full */}
          {attributes.payment_type !== "full" && (
            <InfoRow
              label="Outstanding"
              value={`₦${outstanding
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
            />
          )}
          <InfoRow label="Payment Method" value={attributes.payment_method} />
          <InfoRow label="Date" value={attributes.created_at} />
        </div>

        <div className="flex space-x-2 mt-8">
          {/* Only show payment buttons if not fully paid */}
          {attributes.payment_type !== "full" && (
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
        </div>

        {/* Order Summary */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Order Summary</h3>

          <div className="space-y-2">
            {serviceCharges.map((item: any) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-gray-600">
                  {item.attributes.items_purchased}
                  {item.attributes.quantity
                    ? ` x${item.attributes.quantity}`
                    : ""}
                </span>
                <span className="font-medium">₦{item.attributes.amount}</span>
              </div>
            ))}

            {/* Display Original Price in summary for HMO payment method */}
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

            {attributes.payment_type !== "full" && (
              <>
                <div className="flex justify-between">
                  <span className="font-medium">Amount Paid</span>
                  <span className="font-medium">₦{amountPaidDisplay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Balance</span>
                  <span className="font-medium">
                    ₦
                    {outstanding
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-[#1E1E1E40] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              {paymentType === "full" ? "Full Payment" : "Part Payment"}
            </h3>

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
    </div>
  );
};

export default PaymentDetails;
