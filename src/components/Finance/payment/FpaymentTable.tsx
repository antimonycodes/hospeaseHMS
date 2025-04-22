import { JSX, useEffect, useState } from "react";
import Table from "../../../Shared/Table";
import Loader from "../../../Shared/Loader";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import { useNavigate } from "react-router-dom";

interface PaymentAttributes {
  patient: { id: number; first_name: string; last_name: string };
  amount: string;
  purpose: string;
  payment_method: string;
  payment_type?: string;
  is_active?: boolean;
  user_id: string;
  created_at: string;
  id: number; // Added id
}

interface PaymentData {
  id: number;
  type: string;
  attributes: PaymentAttributes;
}

type Column<T> = {
  key: keyof T;
  label: string;
  render: (value: any, row: T) => React.ReactNode;
};

type FpaymentTableProps = {
  isLoading?: boolean;
  payments: PaymentData[];
};

const FpaymentTable = ({ payments, isLoading }: FpaymentTableProps) => {
  const { getAllPayments } = useFinanceStore();
  const [transformedPayments, setTransformedPayment] = useState<
    PaymentAttributes[]
  >([]);
  const navigate = useNavigate();

  const handleViewMore = (payment: PaymentAttributes) => {
    console.log("View more clicked for:", payment);
    navigate(`/dashboard/finance/payment/${payment.id}`);
  };

  useEffect(() => {
    setTransformedPayment(
      payments.map((payment) => ({
        ...payment.attributes,
        id: payment.id,
      }))
    );
  }, [payments]);

  useEffect(() => {
    getAllPayments(); // Fetch payments on component mount
  }, [getAllPayments]);

  const columns: Column<PaymentAttributes>[] = [
    {
      key: "patient",
      label: "Patient Name",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">
          {row.patient
            ? `${row.patient.first_name} ${row.patient.last_name}`
            : "Unknown"}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">{row.amount || "N/A"}</span>
      ),
    },
    {
      key: "purpose",
      label: "Purpose",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">{row.purpose || "N/A"}</span>
      ),
    },
    {
      key: "payment_method",
      label: "Payment Method",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">
          {row.payment_method || "N/A"}
        </span>
      ),
    },
    {
      key: "payment_type",
      label: "Payment Type",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">
          {row.payment_type || "N/A"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">
          {row.created_at || "N/A"}
        </span>
      ),
    },
    {
      key: "id",
      label: "",
      render: (_, row) => (
        <span
          className="text-primary text-sm font-medium cursor-pointer"
          onClick={() => handleViewMore(row)}
        >
          View More
        </span>
      ),
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  if (!transformedPayments.length) {
    return (
      <div className="mt-10 text-center text-gray-500">No payments found</div>
    );
  }

  return (
    <Table
      data={transformedPayments}
      columns={columns}
      rowKey="id"
      pagination={false} // Set to true if pagination is implemented
      loading={isLoading}
    />
  );
};

export default FpaymentTable;
