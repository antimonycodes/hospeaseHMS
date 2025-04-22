import React, { useEffect, useState } from "react";
import FinanceOverview from "./FinanceOverview";
import PaymentTable from "./PaymentTable";
import ExpenseTable from "./ExpenseTable";
import Tabs from "../../ReusablepatientD/Tabs";
import SearchBar from "../../ReusablepatientD/SearchBar";
import FpaymentTable from "../../Finance/payment/FpaymentTable";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import FexpensesTable from "../../Finance/expenses/FexpensesTable";

const SaFinancePage = () => {
  const [activeTab, setActiveTab] = useState<
    "Overview" | "Payments" | "Expenses"
  >("Overview");
  const { payments, pagination, getAllPayments, isLoading } = useFinanceStore();

  useEffect(() => {
    getAllPayments();
  }, [getAllPayments]);
  console.log("Fetching payments with endpoint:", payments);
  return (
    <div>
      {" "}
      <div className=" flex w-full bg-white pt-10 pb-3 pr-2 md:pr-4 rounded-xl custom-shadow  ">
        <Tabs<"Overview" | "Payments" | "Expenses">
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={["Overview", "Payments", "Expenses"]}
        />
        <div className="flex justify-end w-full">
          <SearchBar />{" "}
        </div>
      </div>
      <div className="mt-4">
        {activeTab === "Overview" && <FinanceOverview />}
        {activeTab === "Payments" && (
          <FpaymentTable payments={payments} isLoading={isLoading} />
        )}
        {activeTab === "Expenses" && <FexpensesTable />}
      </div>
    </div>
  );
};

export default SaFinancePage;
