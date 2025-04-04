import React, { useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import FexpensesTable from "./FexpensesTable";
import { expenseData } from "../../../data/expensesData";
import AddExpenseModal from "../../../Shared/AddExpenseModal";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";

const Fexpenses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createExpense, isLoading } = useFinanceStore();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <div>
      <Tablehead
        tableTitle="Expenses"
        showButton={true}
        typebutton="Add New"
        onButtonClick={openModal}
      />
      {isModalOpen && (
        <AddExpenseModal
          onClose={closeModal}
          isLoading={isLoading}
          createExpense={createExpense}
          endpoint="/finance/expenses-record"
        />
      )}
      <FexpensesTable />
    </div>
  );
};

export default Fexpenses;
