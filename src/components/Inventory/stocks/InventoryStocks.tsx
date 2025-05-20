import React, { useEffect, useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import AddStockModal from "./AddStockModal";
import { useInventoryStore } from "../overview/useInventoryStore";
import InventoryStockTable from "./InventoryStockTable";

const InventoryStocks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getAllStocks, stocks, isLoading, createStock } = useInventoryStore();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  useEffect(() => {
    getAllStocks();
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
          onClose={closeModal}
          isLoading={isLoading}
          createStock={createStock}
          endpoint="/inventory/upload-item"
          refreshEndpoint="/inventory/all-inventory-items"
          fetchEndpoint="/inventory/category/all-records"
          createEndpoint="/inventory/category/create"
        />
      )}
      <InventoryStockTable stocks={stocks} isLoading={isLoading} />
    </div>
  );
};

export default InventoryStocks;
