import React, { useState } from "react";
import Table from "../../../Shared/Table";
import { Plus, Search, X } from "lucide-react";
import Button from "../../../Shared/Button";
import ExpenseTable from "./ExpenseTable";
import PaymentTable from "./PaymentTable";
import AddPaymentModal from "../../../Shared/AddPaymentModal";
import AddExpenseModal from "../../../Shared/AddExpenseModal";

interface Expense {
  id: string;
  item: string;
  amount: string;
  purchasedFrom: string;
  purchasedBy: string;
  paymentMethod: string;
}

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

  return (
    <div className="rounded-lg custom-shadow bg-white p-4">
      <div className="">
        {/* Tab Navigation */}
        <div className="flex  mb-4">
          <button
            className={`px-4 py-2 mr-2 font-semibold ${
              activeTab === "Payments"
                ? "text-primary border-b-2 border-primary"
                : "text-[#667185]"
            }`}
            onClick={() => setActiveTab("Payments")}
          >
            Payments
          </button>
          <button
            className={`px-4 py-2 font-semibold  ${
              activeTab === "Expenses"
                ? "text-primary border-b-2 border-primary"
                : "text-[#667185]"
            }`}
            onClick={() => setActiveTab("Expenses")}
          >
            Expenses
          </button>

          {/* Search and Add Button */}
          <div className=" w-full flex-1 flex flex-col md:flex-row items-center gap-2">
            <div className="relative w-full flex-1">
              <input
                type="text"
                placeholder="Type to search"
                className="w-full border border-gray-200 py-2 pl-10 pr-4 rounded-lg"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] size-4" />
            </div>

            <div className="w-full md:w-auto">
              <Button
                variant="primary"
                size="md"
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center gap-2 px-4"
              >
                Add new
                <Plus size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        {activeTab === "Payments" && <PaymentTable />}

        {activeTab === "Expenses" && <ExpenseTable />}

        {/* Payment Modal */}
        {showPaymentModal && (
          <AddPaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            formData={paymentForm}
          />
        )}

        {/* Expense Modal */}
        {showExpenseModal && (
          <AddExpenseModal
            isOpen={showExpenseModal}
            onClose={() => setShowPaymentModal(false)}
            formData={expenseForm}
          />
        )}
      </div>
    </div>
  );
};

export default SaFinancePage;
