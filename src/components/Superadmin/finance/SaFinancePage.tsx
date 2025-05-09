import React, { useEffect, useState } from "react";
import Tabs from "../../ReusablepatientD/Tabs";
import SearchBar from "../../ReusablepatientD/SearchBar";
import FpaymentTable from "../../Finance/payment/FpaymentTable";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import FexpensesTable from "../../Finance/expenses/FexpensesTable";
import Button from "../../../Shared/Button";
import { Plus } from "lucide-react";
import AddPaymentModal from "../../../Shared/AddPaymentModal";
import AddExpenseModal from "../../../Shared/AddExpenseModal";
import Foverview from "../../Finance/overview/Foverview";
import FinanceOverview from "./FinanceOverview";

type Props = {
  endpoint?: string;
  refreshEndpoint?: string;
};

const SaFinancePage = ({
  endpoint = "/save-patient-payment",
  refreshEndpoint = "/finance/patient-paymet-history",
}: Props) => {
  const [activeTab, setActiveTab] = useState<
    "Overview" | "Payments" | "Expenses"
  >("Overview");
  const { payments, pagination, getAllPayments } = useFinanceStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  const openExpense = () => setIsExpenseOpen(true);
  const closeExpense = () => setIsExpenseOpen(false);

  useEffect(() => {
    getAllPayments();
  }, [getAllPayments]);
  console.log("Fetching payments with endpoint:", payments);
  const { createExpense, isLoading, getAllExpenses } = useFinanceStore();

  useEffect(() => {
    getAllExpenses();
  }, [getAllExpenses]);

  const renderButtons = () => {
    if (activeTab === "Payments") {
      return (
        <Button
          variant="primary"
          className="flex items-center text-[12px] gap-2 px-2 md:px-4"
          onClick={openModal}
        >
          Add Stock
          <Plus size={20} />
        </Button>
      );
    }

    if (activeTab === "Expenses") {
      return (
        <Button
          variant="primary"
          className="flex items-center text-[12px] gap-2 px-2 md:px-4"
          onClick={openExpense}
        >
          Add Expenses
          <Plus size={20} />
        </Button>
      );
    }

    return null;
  };

  return (
    <div>
      {" "}
      <div className=" flex w-full bg-white pt-10 pb-3 pr-2 md:pr-4 rounded-xl custom-shadow  ">
        <Tabs<"Overview" | "Payments" | "Expenses">
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={["Overview", "Payments", "Expenses"]}
        />
        <div className=" flex flex-grow w-full gap-2 ">
          <span className="flex-grow">
            <SearchBar />
          </span>

          <span className="flex justify-end  max-w-2xl">{renderButtons()}</span>
        </div>
      </div>
      <div className="mt-4">
        {activeTab === "Overview" && <FinanceOverview />}

        {activeTab === "Payments" && (
          <FpaymentTable
            payments={payments}
            isLoading={isLoading}
            pagination={pagination}
          />
        )}
        {activeTab === "Expenses" && <FexpensesTable />}
      </div>
      {isModalOpen && (
        <AddPaymentModal
          onClose={closeModal}
          endpoint={endpoint}
          refreshEndpoint={refreshEndpoint}
        />
      )}
      {isExpenseOpen && (
        <AddExpenseModal
          onClose={closeExpense}
          isLoading={isLoading}
          createExpense={createExpense}
          endpoint="/finance/expenses-record"
          refreshEndpoint="/finance/all-expenses"
        />
      )}
    </div>
  );
};

export default SaFinancePage;
