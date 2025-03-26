import React from "react";
import { Expenses } from "../../../data/expensesData";
import Table from "../../../Shared/Table";

interface FexpensesTableProps {
  expenseData: Expenses[];
}

const FexpensesTable = ({ expenseData }: FexpensesTableProps) => {
  const columns: {
    key: keyof Expenses;
    label: string;
    render: (value: string | number, row: Expenses) => React.ReactNode;
  }[] = [
    {
      key: "item",
      label: "Item",
      render: (value) => (
        <span className="text-dark font-medium text-sm">{value}</span>
      ),
    },
    {
      key: "purchased",
      label: "Purchased",
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
      key: "purchasedBy",
      label: "Purchased By",
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
      key: "date",
      label: "Date",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
  ];

  return (
    <div className="w-full bg-white rounded-[10px] shadow-table  ">
      <Table
        data={expenseData}
        columns={columns}
        rowKey="id"
        pagination={expenseData.length > 10}
        rowsPerPage={10}
        radius="rounded-none"
      />
    </div>
  );
};

export default FexpensesTable;
