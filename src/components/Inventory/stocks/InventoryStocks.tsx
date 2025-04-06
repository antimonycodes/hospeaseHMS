import React, { useEffect, useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import InventoryStockTable from "./InventoryStockTable";
import AddStockModal from "./AddStockModal";
import { useInventoryStore } from "../overview/useInventoryStore";

const InventoryStocks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getAllStocks, stocks, isLoading } = useInventoryStore();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  useEffect(() => {
    getAllStocks("/inventory/all-inventory-items"); // Fetch patients from front-desk endpoint
  }, [getAllStocks]);

  return (
    <div>
      <Tablehead
        tableTitle="Stocks"
        showButton={true}
        typebutton="Add New"
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
      {/* <InventoryStockTable stocks={stocks} isLoading={isLoading} /> */}
    </div>
  );
};

export default InventoryStocks;
