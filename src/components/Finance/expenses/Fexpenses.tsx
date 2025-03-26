import React from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import FexpensesTable from "./FexpensesTable";
import { expenseData } from "../../../data/expensesData";

const Fexpenses = () => {
  return (
    <div>
      <Tablehead tableTitle="Expenses" />
      <FexpensesTable expenseData={expenseData} />
    </div>
  );
};

export default Fexpenses;
