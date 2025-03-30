import React, { useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import InventoryStockTable from "./InventoryStockTable";
import AddStockModal from "./AddStockModal";

const InventoryStocks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <Tablehead
        tableTitle="Stocks"
        showButton={true}
        onButtonClick={openModal}
      />
      {isModalOpen && (
        <AddStockModal
          showSearchBar={true}
          showPaymentType={true}
          onClose={closeModal}
          formData={{
            staffId: "",
            staffFirstName: "",
            staffLastName: "",
            category: "",
            itemName: "",
            qantity: "",
          }}
        />
      )}
      <InventoryStockTable />
    </div>
  );
};

export default InventoryStocks;
