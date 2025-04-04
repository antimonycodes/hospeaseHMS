import React, { useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import FexpensesTable from "./FexpensesTable";
import { expenseData } from "../../../data/expensesData";
import AddExpenseModal from "../../../Shared/AddExpenseModal";

const Fexpenses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <div>
      <Tablehead
        tableTitle="Expenses"
        showButton={true}
        typebutton="true"
        onButtonClick={openModal}
      />
      {isModalOpen && (
        <AddExpenseModal
          onClose={closeModal}
          formData={{
            item: "",
            amount: "",
            purchasedFrom: "",
            purchasedBy: "",
            paymentMethod: "",
          }}
        />
      )}
      <FexpensesTable expenseData={expenseData} />
    </div>
  );
};

export default Fexpenses;
