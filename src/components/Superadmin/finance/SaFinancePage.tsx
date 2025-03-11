import React, { useState } from "react";
import Table from "../../../Shared/Table";

interface Payment {
  id: string;
  patient: string;
  amount: string;
  purpose: string;
  paymentMethod: string;
  date: string;
}

interface Expense {
  id: string;
  item: string;
  amount: string;
  purchasedFrom: string;
  purchasedBy: string;
  paymentMethod: string;
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

const SaFinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Payments" | "Expenses">(
    "Payments"
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Payment form states
  const [paymentForm, setPaymentForm] = useState({
    id: "",
    patientFirstName: "",
    patientLastName: "",
    amount: "",
    purpose: "",
    paymentMethod: "Bank Transfer",
  });

  // Expense form states
  const [expenseForm, setExpenseForm] = useState({
    item: "",
    purchasedFrom: "",
    amount: "",
    purchasedBy: "",
    paymentMethod: "Bank Transfer",
  });

  // Payment columns configuration
  const paymentColumns = [
    { key: "id" as keyof Payment, label: "Payment ID" },
    { key: "patient" as keyof Payment, label: "Patient" },
    { key: "amount" as keyof Payment, label: "Amount" },
    { key: "purpose" as keyof Payment, label: "Purpose" },
    { key: "paymentMethod" as keyof Payment, label: "Payment Method" },
    { key: "date" as keyof Payment, label: "Date" },
  ];

  // Expense columns configuration
  const expenseColumns = [
    { key: "id" as keyof Expense, label: "Expense ID" },
    { key: "item" as keyof Expense, label: "Item" },
    { key: "amount" as keyof Expense, label: "Amount" },
    { key: "purchasedFrom" as keyof Expense, label: "Purchased From" },
    { key: "purchasedBy" as keyof Expense, label: "Purchased By" },
    { key: "paymentMethod" as keyof Expense, label: "Payment Method" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex  mb-4">
          <button
            className={`px-4 py-2 mr-2 font-medium text-sm ${
              activeTab === "Payments"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("Payments")}
          >
            Payments
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "Expenses"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("Expenses")}
          >
            Expenses
          </button>

          {/* Search and Add Button */}
          <div className="ml-auto flex items-center">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Type to search"
                className="pl-8 pr-4 py-2 border rounded-md text-sm"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 absolute left-2 top-3 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <button
              className="bg-green-600 text-white px-3 py-2 rounded-md text-sm flex items-center"
              onClick={() =>
                activeTab === "Payments"
                  ? setShowPaymentModal(true)
                  : setShowExpenseModal(true)
              }
            >
              <span>Add new</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Table */}
        {activeTab === "Payments" && (
          <Table
            columns={paymentColumns}
            data={paymentData}
            rowKey="id"
            pagination={true}
            rowsPerPage={10}
          />
        )}

        {activeTab === "Expenses" && (
          <div className="text-center py-8 text-gray-500">
            No expenses to display. Add a new expense to get started.
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Add New payment</h2>
                <button onClick={() => setShowPaymentModal(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment ID
                  </label>
                  <input
                    type="text"
                    name="id"
                    value={paymentForm.id}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient's First Name
                  </label>
                  <input
                    type="text"
                    name="patientFirstName"
                    value={paymentForm.patientFirstName}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient's Last Name
                  </label>
                  <input
                    type="text"
                    name="patientLastName"
                    value={paymentForm.patientLastName}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="text"
                    name="amount"
                    value={paymentForm.amount}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose
                  </label>
                  <input
                    type="text"
                    name="purpose"
                    value={paymentForm.purpose}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <div className="relative">
                    <select
                      name="paymentMethod"
                      value={paymentForm.paymentMethod}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm appearance-none"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm">
                  Add payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Expense Modal */}
        {showExpenseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Add New</h2>
                <button onClick={() => setShowExpenseModal(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item
                  </label>
                  <input
                    type="text"
                    name="item"
                    value={expenseForm.item}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchased from
                  </label>
                  <input
                    type="text"
                    name="purchasedFrom"
                    value={expenseForm.purchasedFrom}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="text"
                    name="amount"
                    value={expenseForm.amount}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchased by
                  </label>
                  <input
                    type="text"
                    name="purchasedBy"
                    value={expenseForm.purchasedBy}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <div className="relative">
                    <select
                      name="paymentMethod"
                      value={expenseForm.paymentMethod}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm appearance-none"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm">
                  Add payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <button className="px-3 py-1 border rounded flex items-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          <div className="flex space-x-1">
            <button className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-xs">
              1
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded-full text-xs">
              2
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded-full text-xs">
              3
            </button>
            <span className="px-1">...</span>
            <button className="w-6 h-6 flex items-center justify-center rounded-full text-xs">
              8
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded-full text-xs">
              9
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded-full text-xs">
              10
            </button>
          </div>

          <button className="px-3 py-1 border rounded flex items-center text-gray-600">
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaFinancePage;
