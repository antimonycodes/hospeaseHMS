import { JSX, useState } from "react";
import Table from "../../../Shared/Table";
import Loader from "../../../Shared/Loader";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";

interface PaymentData {
  id: number;
  attributes: {
    id: number; // Added for rowKey
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

type PaymentAttributes = PaymentData["attributes"];

type Columns = {
  key: keyof PaymentAttributes;
  label: string;
  render?: (value: any, payment: PaymentAttributes) => JSX.Element;
};

type FpaymentTableProps = {
  endpoint: string;
  isLoading?: boolean;
  payments: PaymentData[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  } | null;
};

const FpaymentTable = ({
  pagination,
  payments,
  isLoading,
  endpoint = "/finance/all-revenues",
}: FpaymentTableProps) => {
  const { getAllPayments } = useFinanceStore();
  const [perPage, setPerPage] = useState(pagination?.per_page || 10);

  // Debug payments and tableData
  console.log("Payments received:", payments);
  const tableData = payments.map((payment) => payment.attributes);
  console.log("Table data:", tableData);

  const columns: Columns[] = [
    {
      key: "patient",
      label: "Patient Name",
      render: (_, attributes) => (
        <span className="text-[#667085] text-sm">
          {attributes.patient || "Unknown"}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (_, attributes) => (
        <span className="text-[#667085] text-sm">
          {attributes.amount || "N/A"}
        </span>
      ),
    },
    {
      key: "purpose",
      label: "Purpose",
      render: (_, attributes) => (
        <span className="text-[#667085] text-sm">
          {attributes.purpose || "N/A"}
        </span>
      ),
    },
    {
      key: "payment_method",
      label: "Payment Method",
      render: (_, attributes) => (
        <span className="text-[#667085] text-sm">
          {attributes.payment_method || "N/A"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (_, attributes) => (
        <span className="text-[#667085] text-sm">
          {attributes.created_at || "N/A"}
        </span>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    console.log("Page change to:", page);
    getAllPayments(page.toString(), perPage.toString(), endpoint);
  };

  if (isLoading && !payments.length) {
    return <Loader />;
  }

  if (!tableData.length) {
    return (
      <div className="mt-10 text-center text-gray-500">No payments found</div>
    );
  }

  return (
    <Table
      data={tableData}
      columns={columns}
      rowKey="id"
      pagination={true}
      paginationData={pagination}
      loading={isLoading}
      onPageChange={handlePageChange}
    />
  );
};

export default FpaymentTable;
