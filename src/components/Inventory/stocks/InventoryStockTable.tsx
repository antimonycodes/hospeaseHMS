import { JSX, useEffect } from "react";
import Table from "../../../Shared/Table";
import Loader from "../../../Shared/Loader";
type StockData = {
  item: string;
  category: string;
  quantity: string;
  expiry_date: string;
  cost: number;
};
type Columns = {
  key: keyof StockData;
  label: string;
  render?: (value: any, stocks: StockData) => JSX.Element;
};
interface InventoryStockTableProps {
  isLoading: boolean;
  stocks: {
    attributes: {
      service_item_name: string;
      category: string;
      quantity: string;
      expiry_date: string;
      cost: number;
    };
    id: number;
  }[];
}

const InventoryStockTable = ({
  stocks,
  isLoading,
}: InventoryStockTableProps) => {
  const formattedStocks = (stocks || []).map((stock) => ({
    id: stock.id,
    item: stock.attributes.service_item_name,
    category: stock.attributes.category,
    quantity: stock.attributes.quantity,
    expiry_date: stock.attributes.expiry_date,
    cost: stock.attributes.cost,
  }));

  console.log(stocks, "ty");

  const columns: Columns[] = [
    {
      key: "item",
      label: "Item Name",
      render: (_, stock) => <span>{stock.item}</span>,
    },
    {
      key: "category",
      label: "Category",
      render: (_, stock) => <span>{stock.category}</span>,
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (_, stock) => <span>{stock.quantity}</span>,
    },
    {
      key: "expiry_date",
      label: "Expiry Date",
      render: (_, stock) => <span>{stock.expiry_date}</span>,
    },
    {
      key: "cost",
      label: "Cost",
      render: (_, stock) => <span>{stock.cost}</span>,
    },
  ];

  if (isLoading) return <Loader />;

  return (
    <div>
      <Table
        data={formattedStocks}
        columns={columns}
        rowKey="id"
        loading={isLoading}
      />
    </div>
  );
};

export default InventoryStockTable;
