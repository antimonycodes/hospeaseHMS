import React, { useState } from "react";
import Table from "../../../Shared/Table";

interface Payment {
  id: string;
  patient: string;
  amount: string;
  purpose: string;
  paymentMethod: string;
  date: string;
  status: "Full Payment" | "Half Payment" | "All";
  active: boolean;
}

interface FpaymentTableProps {
  payments: Payment[];
}

const FpaymentTable = ({ payments }: FpaymentTableProps) => {
  const [paymentStatuses, setPaymentStatuses] = useState(
    payments.reduce((acc, payment) => {
      acc[payment.id] = payment.active;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const togglePaymentStatus = (id: string) => {
    setPaymentStatuses((prevStatuses) => ({
      ...prevStatuses,
      [id]: !prevStatuses[id],
    }));
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
      render: (value, row) => (
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={paymentStatuses[row.id]}
              onChange={() => togglePaymentStatus(row.id)}
            />
            <div
              className={`relative w-10 h-5 rounded-full transition-colors ${
                paymentStatuses[row.id] ? "bg-primary" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                  paymentStatuses[row.id] ? "transform translate-x-5" : ""
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
    <div className="w-full bg-white rounded-b-[8px] shadow-table ">
      <Table
        data={payments}
        columns={columns}
        rowKey="id"
        pagination={payments.length > 10}
        rowsPerPage={10}
        radius="rounded-none"
      />
    </div>
  );
};

export default FpaymentTable;
