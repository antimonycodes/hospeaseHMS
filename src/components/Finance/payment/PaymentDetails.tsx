import React, { useEffect, useState } from "react";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../../../Shared/Button";

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
        return "bg-green-100 text-green-800";
      case "partial":
      case "part":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const PaymentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { selectedPayment, getPaymentById } = useFinanceStore();
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!selectedPayment) {
    return (
      <div className="flex items-center justify-center h-screen">
        Payment not found
      </div>
    );
  }

  const attributes = selectedPayment.attributes || {};
  const serviceCharges = attributes.service_charges || [];

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
  const amountPaidDisplay =
    attributes.payment_type === "full"
      ? formattedTotalAmount
      : attributes.part_amount || "0.00";

  // Get formatted payment type for display
  const paymentTypeDisplay =
    attributes.payment_type === "full"
      ? "Full Payment"
      : attributes.payment_type === "part"
      ? "Half Payment"
      : attributes.payment_type?.charAt(0).toUpperCase() +
          attributes.payment_type?.slice(1) || "Unknown";

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
          <InfoRow label="Total Amount" value={`₦${formattedTotalAmount}`} />
          <InfoRow label="Amount Paid" value={`₦${amountPaidDisplay}`} />
          <InfoRow
            label="Payment Type"
            value={
              <div className="flex items-center space-x-2 mt-1">
                <span>{paymentTypeDisplay}</span>
                {/* <PaymentStatusBadge
                  status={attributes.payment_type || "unknown"}
                /> */}
              </div>
            }
          />
          <InfoRow
            label="Outstanding"
            value={`₦${outstanding
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
          />
          <InfoRow label="Payment Method" value={attributes.payment_method} />
          <InfoRow label="Date" value={attributes.created_at} />
        </div>

        <div className="flex space-x-2 mt-8">
          {attributes.payment_type !== "full" && outstanding > 0 && (
            <button className="rounded-sm text-white bg-primary py-2 px-3">
              Full Payment Made
            </button>
          )}
          <button className="rounded-sm text-primary border border-primary py-2 px-3">
            View Receipt
          </button>
        </div>

        {/* Order Summary */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Order Summary</h3>

          <div className="space-y-2">
            {serviceCharges.map((item: any) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-gray-600">
                  {item.attributes.service_charge?.name}
                  {item.attributes.quantity
                    ? ` x${item.attributes.quantity}`
                    : ""}
                </span>
                <span className="font-medium">₦{item.attributes.amount}</span>
              </div>
            ))}

            <div className="border-t pt-2 mt-4 flex justify-between">
              <span className="font-medium text-green-600">Total</span>
              <span className="font-medium text-green-600">
                ₦{formattedTotalAmount}
              </span>
            </div>

            {attributes.payment_type === "part" && (
              <>
                <div className="flex justify-between">
                  <span className="font-medium">Amount Paid</span>
                  <span className="font-medium">₦{attributes.part_amount}</span>
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
    </div>
  );
};

export default PaymentDetails;
