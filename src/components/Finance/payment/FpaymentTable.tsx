import { useState, useEffect } from "react";
import Table from "../../../Shared/Table";

interface Payment {
  id: string;
  patient: string;
  amount: string;
  purpose: string;
  paymentMethod: string;
  date: string;
  status: "All" | "Full Payment" | "Half Payment";
  active: boolean;
}

interface FpaymentTableProps {
  payments: Payment[];
}

const FpaymentTable = ({ payments }: FpaymentTableProps) => {
  const [paymentData, setPaymentData] = useState<Payment[]>([]);
  const [filterStatus] = useState<"All" | "Full Payment" | "Half Payment">(
    "All"
  );

  useEffect(() => {
    let filteredPayments = payments;
    if (filterStatus !== "All") {
      filteredPayments = payments.filter(
        (payment) => payment.status === filterStatus
      );
    }
    setPaymentData(filteredPayments);
  }, [payments, filterStatus]);

  const togglePaymentStatus = (id: string) => {
    setPaymentData((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === id
          ? {
              ...payment,
              active: !payment.active,
              status: !payment.active ? "Full Payment" : "Half Payment",
            }
          : payment
      )
    );
  };

  const columns: {
    key: keyof Payment;
    label: string;
    render: (value: string | number | boolean, row: Payment) => React.ReactNode;
  }[] = [
    {
      key: "id",
      label: "Patient ID",
      render: (value) => (
        <span className="text-dark font-medium text-sm">{value}</span>
      ),
    },
    {
      key: "patient",
      label: "Patient Name",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "purpose",
      label: "Purpose",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "status",
      label: "Payment Type",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "active",
      label: "Payment Status",
      render: (_, row) => (
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={row.active}
              onChange={() => togglePaymentStatus(row.id)}
            />
            <div
              className={`relative w-10 h-5 rounded-full transition-colors ${
                row.active ? "bg-primary" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                  row.active ? "transform translate-x-5" : ""
                }`}
              ></div>
            </div>
          </label>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
  ];

  return (
    <div className="w-full bg-white rounded-b-[8px] shadow-table">
      <Table
        data={paymentData}
        columns={columns}
        rowKey="id"
        pagination={paymentData.length > 10}
        rowsPerPage={10}
        radius="rounded-none"
      />
    </div>
  );
};

export default FpaymentTable;

{
  /* <div className="flex justify-end p-4">
<select
  value={filterStatus}
  onChange={(e) =>
    setFilterStatus(
      e.target.value as "All" | "Full Payment" | "Half Payment"
    )
  }
  className="border border-gray-300 rounded p-2"
>
  <option value="All">All</option>
  <option value="Full Payment">Full Payment</option>
  <option value="Half Payment">Half Payment</option>
</select>
</div> */
}
