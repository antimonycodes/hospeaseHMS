import { StocksData } from "../../../data/StocksData";
import Table from "../../../Shared/Table";

const InventoryStockTable = () => {
  const columns: {
    key: keyof StocksData;
    label: string;
    render: (value: string | number, row: StocksData) => React.ReactNode;
  }[] = [
    {
      key: "ItemName",
      label: "Item Name",
      render: (value) => (
        <span className="text-dark font-medium text-sm">{value}</span>
      ),
    },
    {
      key: "ItemCategory",
      label: "Item Category  ",
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
      key: "purchasecost",
      label: "Purchase Cost",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "purchasedate",
      label: "Purchase Date",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
  ];
  return (
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
  );
};

export default InventoryStockTable;
