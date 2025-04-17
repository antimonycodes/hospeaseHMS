import React from "react";
import Table from "../../../Shared/Table";
import { StocksData } from "../../../data/StocksData";

const InventoryCard = () => {
  const columns: {
    key: keyof StocksData;
    label: string;
    render: (value: string | number, row: StocksData) => React.ReactNode;
  }[] = [
    {
      key: "staffName",
      label: "Staff Name ",
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
      label: "Staff ID ",
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
    {
      key: "purchasedate",
      label: " Date",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "id",
      label: "",
      render: (value, row) => (
        <button className="cursor-pointer text-[#009952] text-sm font-medium">
          View more
        </button>
      ),
    },
  ];
  return (
    <div>
      <Table
        data={StocksData.slice(0, 4)}
        columns={columns}
        rowKey="id"
        pagination={StocksData.length > 10}
        radius="rounded-lg"
      />
    </div>
  );
};

export default InventoryCard;
