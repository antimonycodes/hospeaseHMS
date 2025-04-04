import { JSX } from "react";
import Table from "../../../Shared/Table";

interface PaymentFromAPI {
  id: number;
  attributes: {
    patient: string;
    amount: string;
    purpose: string;
    payment_method: string;
    payment_type?: string;
    is_active?: boolean;
    user_id: string;
    created_at: string;
  };
}

export type PaymentData = {
  id: string;
  user_id: string;
  patient: string;
  amount: string;
  purpose: string;
  payment_method: string;
  payment_type?: string;
  is_active?: boolean;
  created_at: string;
  status: string;
  active: boolean;
};

type Columns = {
  key: keyof PaymentData;
  label: string;
  render?: (value: any, payment: PaymentData) => JSX.Element;
};

type FpaymentTableProps = {
  isLoading?: boolean;
  payments: PaymentFromAPI[];
};

const FpaymentTable = ({
  payments = [],
  isLoading = false,
}: FpaymentTableProps) => {
  // Ensure payments is always an array
  const paymentsArray = Array.isArray(payments) ? payments : [];

  const formattedPayments: PaymentData[] = paymentsArray.map((payment) => ({
    id: payment.id.toString(),
    user_id: payment.attributes?.user_id || "N/A",
    patient: payment.attributes?.patient || "Unknown",
    amount: payment.attributes?.amount || "0",
    purpose: payment.attributes?.purpose || "N/A",
    payment_method: payment.attributes?.payment_method || "N/A",
    payment_type: payment.attributes?.payment_type || "",
    created_at: payment.attributes?.created_at || "N/A",
    is_active: payment.attributes?.is_active || false,
    status: payment.attributes?.is_active ? "Full Payment" : "Half Payment",
    active: payment.attributes?.is_active || false,
  }));

  const columns: Columns[] = [
    {
      key: "user_id",
      label: "User ID",
      render: (_, payment) => (
        <span className="text-dark font-medium text-sm">{payment.user_id}</span>
      ),
    },
    {
      key: "patient",
      label: "Patient Name",
      render: (_, payment) => (
        <span className="text-[#667085] text-sm">{payment.patient}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (_, payment) => (
        <span className="text-[#667085] text-sm">{payment.amount}</span>
      ),
    },
    {
      key: "purpose",
      label: "Purpose",
      render: (_, payment) => (
        <span className="text-[#667085] text-sm">{payment.purpose}</span>
      ),
    },
    {
      key: "payment_method",
      label: "Payment Method",
      render: (_, payment) => (
        <span className="text-[#667085] text-sm">{payment.payment_method}</span>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (_, payment) => (
        <span className="text-[#667085] text-sm">{payment.created_at}</span>
      ),
    },
  ];

  if (isLoading) return <div>Loading payments...</div>;
  if (!formattedPayments.length) return <div>No payments found</div>;

  return (
    <Table
      data={formattedPayments}
      columns={columns}
      rowKey="id"
      rowsPerPage={10}
    />
  );
};

export default FpaymentTable;
