import { JSX, useEffect, useState } from "react";
// import { Loader } from "lucide-react";
import Table from "../../../Shared/Table";
import { useInventoryStore } from "../../Inventory/overview/useInventoryStore";
import { useNavigate } from "react-router-dom";
import RestockModal from "../../Inventory/stocks/RestockModal";
import Loader from "../../../Shared/Loader";
type StockData = {
  id: number;
  selling_price: string;
  item_name: string;
  category: string;
  quantity: string;
  expiry_date: string;
  cost: number;
};
type Columns = {
  key: keyof StockData | "actions";

  label: string;
  render?: (value: any, stocks: StockData) => JSX.Element;
};

type SaInventoryStockProps = {
  isLoading: boolean;
  stocks: {
    attributes: {
      service_item_price: any;
      service_item_name: string;
      category: string;
      quantity: string;
      expiry_date: string;
      cost: number;
    };
    id: number;
  }[];
};

const SaInventoryStock = ({ stocks, isLoading }: SaInventoryStockProps) => {
  const { reStock, reStockHistory, restockHistoryData } = useInventoryStore();
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const handleRestock = (stockId: number) => {
    const stock = stocks.find((s) => s.id === stockId);
    if (stock) {
      setSelectedStock(stock);
      setRestockModalOpen(true);
    }
  };

  const handleViewHistory = (stockId: number) => {
    const stock = stocks.find((s) => s.id === stockId);
    if (stock) {
      setSelectedStock(stock);
      setHistoryModalOpen(true);
    }
  };
  const navigate = useNavigate();

  //   const {  stocks, isLoading } = useInventoryStore();
  const formattedStocks = (stocks || []).map((stock) => ({
    id: stock.id,
    item_name: stock.attributes.service_item_name,
    category: stock.attributes.category,
    quantity: stock.attributes.quantity,
    expiry_date: stock.attributes.expiry_date,
    cost: stock.attributes.cost,
    selling_price: stock.attributes.service_item_price,
  }));

  const columns: Columns[] = [
    {
      key: "item_name",
      label: "Item Name",
      render: (_, stock) => <span>{stock.item_name}</span>,
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
      key: "cost",
      label: "Cost",
      render: (_, stock) => <span>{stock.cost}</span>,
    },
    {
      key: "selling_price",
      label: "Selling Price",
      render: (_, stock) => <span>{stock.selling_price}</span>,
    },
    {
      key: "expiry_date",
      label: "Expiry Date",
      render: (_, stock) => <span>{stock.expiry_date}</span>,
    },
    {
      key: "actions",
      label: "",
      render: (_, stock) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleRestock(stock.id)}
            className="bg-primary text-white px-2 py-1 rounded-md text-xs"
          >
            Restock
          </button>
          <button
            onClick={() =>
              navigate(`/dashboard/stock-history/${stock.id}`, {
                state: { stockItem: stock },
              })
            }
            className="border border-primary  text-primary  px-2 py-1 rounded-md text-xs"
          >
            History
          </button>
        </div>
      ),
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

      {restockModalOpen && selectedStock && (
        <RestockModal
          onClose={() => setRestockModalOpen(false)}
          isLoading={isLoading}
          reStock={reStock}
          stockItem={selectedStock}
        />
      )}
    </div>
  );
};

export default SaInventoryStock;
