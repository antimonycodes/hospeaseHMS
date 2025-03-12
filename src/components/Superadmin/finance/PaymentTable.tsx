import React from "react";
import Table from "../../../Shared/Table";

interface Payment {
  id: string;
  patient: string;
  amount: string;
  purpose: string;
  paymentMethod: string;
  date: string;
}

const paymentData: Payment[] = [
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Surgery",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Surgery",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Surgery",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
];

const PaymentTable = () => {
  const paymentColumns = [
    {
      key: "id" as keyof Payment,
      label: "Payment ID",
      render: (value: string) => (
        <span className="text-sm text-custom-black font-medium">{value}</span>
      ),
    },
    {
      key: "patient" as keyof Payment,
      label: "Patient",
      render: (value: string) => (
        <span className="text-sm text-[#667085]">{value}</span>
      ),
    },
    {
      key: "amount" as keyof Payment,
      label: "Amount",
      render: (value: string) => (
        <span className="text-sm text-[#667085]">{value}</span>
      ),
    },
    {
      key: "purpose" as keyof Payment,
      label: "Purpose",
      render: (value: string) => (
        <span className="text-sm text-[#667085]">{value}</span>
      ),
    },
    {
      key: "paymentMethod" as keyof Payment,
      label: "Payment Method",
      render: (value: string) => (
        <span className="text-sm text-[#667085]">{value}</span>
      ),
    },
    {
      key: "date" as keyof Payment,
      label: "Date",
      render: (value: string) => (
        <span className="text-sm text-[#667085]">{value}</span>
      ),
    },
  ];
  return (
    <div>
      <Table
        columns={paymentColumns}
        data={paymentData}
        rowKey="id"
        pagination={true}
        rowsPerPage={10}
      />
    </div>
  );
};

export default PaymentTable;
