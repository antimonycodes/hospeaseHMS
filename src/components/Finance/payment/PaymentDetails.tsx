import React, { useEffect, useState } from "react";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../../../Shared/Button";

const InfoRow = ({
  items,
  columns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
}: {
  items: { label: string; value: string | number | undefined }[];
  columns?: string;
}) => (
  <div className={`grid gap-4 mb-4 ${columns}`}>
    {items.map(({ label, value }, i) => (
      <div key={i}>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-medium">{value || "-"}</p>
      </div>
    ))}
  </div>
);

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

  // Calculate outstanding amount
  const totalAmount = parseFloat(attributes.amount?.replace(",", "") || "0");
  const partAmount = parseFloat(
    attributes.part_amount?.replace(",", "") || "0"
  );
  const outstanding = totalAmount - partAmount;

  return (
    <div className="">
      {/* Payment Info */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div onClick={() => navigate(-1)} className="flex items-center mb-4">
          <button className="mr-1 text-custom-black">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg md:text-sm font-medium text-custom-black">
            Payment Details
          </h2>
        </div>
        <InfoRow
          items={[
            { label: "Payment ID", value: selectedPayment.id },
            { label: "Patient ID", value: attributes.patient?.id },
            { label: "Last Name", value: attributes.patient?.last_name },
            { label: "First Name", value: attributes.patient?.first_name },
            { label: "Purpose", value: attributes.department?.name },
          ]}
        />
        <InfoRow
          items={[
            { label: "Department", value: attributes.department?.name },
            { label: "Total Amount", value: attributes.amount },
            { label: "Amount Paid", value: attributes.part_amount },
            { label: "Payment Type", value: attributes.payment_type },
            { label: "Outstanding", value: outstanding.toFixed(2) },
          ]}
        />
        <InfoRow
          columns="grid-cols-2 md:grid-cols-4"
          items={[
            { label: "Payment Method", value: attributes.payment_method },
            { label: "Date", value: attributes.created_at },
          ]}
        />

        {/*  */}
        <div className="flex space-x-2 mt-8">
          <button className="rounded-sm text-white bg-primary py-2 px-3">
            Full Payment Made
          </button>
          <button className="rounded-sm text-primary border border-primary py-2 px-3">
            View Reciept
          </button>
        </div>
        {/* Order Summary */}
        <div>
          <h1>Order Summary</h1>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
