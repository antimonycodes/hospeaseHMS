import React, { useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Table from "../../../Shared/Table";
import { StocksData } from "../../../data/StocksData";
import AddRequestModal from "./AddRequestModal";

const InventoryRequest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const columns: {
    key: keyof StocksData;
    label: string;
    render: (value: string | number, row: StocksData) => React.ReactNode;
  }[] = [
    {
      key: "staffName",
      label: "staff Name",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.picture}
            alt=""
            className="h-10 w-10 border rounded-full object-cover border-gray-300"
          />
          <span className="text-dark font-medium text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: "StaffID",
      label: "staff ID  ",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "ItemCategory",
      label: "Item Category",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },

    {
      key: "ItemName",
      label: "Item Name",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
  ];
  return (
    <div>
      <Tablehead
        tableTitle="Requests"
        onButtonClick={openModal}
        showButton={true}
      />
      {isModalOpen && (
        <AddRequestModal
          onClose={closeModal}
          formData={{
            itemName: "",
            category: "",
            purchaseCost: "",
            quantity: "",
          }}
        />
      )}
      <div className="w-full bg-white rounded-b-[8px] shadow-table">
        <Table
          data={StocksData}
          columns={columns}
          rowKey="id"
          pagination={StocksData.length > 10}
          rowsPerPage={10}
          radius="rounded-none"
        />
      </div>
    </div>
  );
};

export default InventoryRequest;
