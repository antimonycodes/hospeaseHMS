import { JSX, useEffect, useState } from "react";
import {
  RotateCcw,
  History,
  Package,
  AlertTriangle,
  Clock,
  Trash,
} from "lucide-react";
import Table from "../../../Shared/Table";
import Loader from "../../../Shared/Loader";
import RestockModal from "./RestockModal";
import RestockHistoryModal from "./RestockHistoryModal";
import { useInventoryStore } from "../overview/useInventoryStore";
import { useNavigate } from "react-router-dom";

type StockData = {
  profit: string;
  service_item_price: string;
  id: number;
  item: string;
  category: string;
  quantity: string;
  expiry_date: string;
  cost: number;
  is_expired?: boolean;
};

type Columns = {
  key: keyof StockData | "actions";
  label: string;
  render?: (value: any, stocks: StockData) => JSX.Element;
};

interface InventoryStockTableProps {
  isLoading: boolean;
  stocks: {
    attributes: {
      profit: any;
      service_item_price: any;
      service_item_name: string;
      category: string;
      quantity: string;
      expiry_date: string;
      cost: number;
      is_expired?: boolean;
    };
    id: number;
  }[];
}

const InventoryStockTable = ({
  stocks,
  isLoading,
}: InventoryStockTableProps) => {
  const { reStock, reStockHistory, restockHistoryData, deleteStock } =
    useInventoryStore();
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);

  // Helper function to format currency - handles comma-separated values
  const formatCurrency = (amount: number | string) => {
    if (!amount) return "₦0";

    // Convert string with commas to number
    let numAmount: number;
    if (typeof amount === "string") {
      // Remove commas and convert to number
      numAmount = parseFloat(amount.replace(/,/g, ""));
    } else {
      numAmount = amount;
    }

    if (isNaN(numAmount)) return "₦0";

    return `₦${Math.round(numAmount).toLocaleString()}`;
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Helper function to check if item is expiring soon (within 30 days)
  const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;

    const today = new Date();
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return expiry <= thirtyDaysFromNow && expiry >= today;
  };

  // Helper function to check if item is expired
  const isExpired = (expiryDate: string, isExpiredFlag?: boolean) => {
    if (isExpiredFlag !== undefined) return isExpiredFlag;

    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  // Helper function to get quantity display with appropriate styling
  const getQuantityDisplay = (quantity: string | number) => {
    const qty = typeof quantity === "string" ? parseInt(quantity) : quantity;
    const isLowStock = qty < 10;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          isLowStock
            ? "bg-[#FBE1E1] text-[#F83E41] border border-red-200"
            : "bg-[#CCFFE7] text-[#009952] border border-primary"
        }`}
      >
        <Package className="w-3 h-3" />
        {qty}
      </span>
    );
  };

  // Helper function to get expiry status display
  const getExpiryStatusDisplay = (
    expiryDate: string,
    isExpiredFlag?: boolean
  ) => {
    const expired = isExpired(expiryDate, isExpiredFlag);
    const expiringSoon = !expired && isExpiringSoon(expiryDate);

    if (expired) {
      return (
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <AlertTriangle className="w-3 h-3" />
            Expired
          </span>
          <div className="text-sm text-red-600">{formatDate(expiryDate)}</div>
        </div>
      );
    }

    if (expiringSoon) {
      return (
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <Clock className="w-3 h-3" />
            Expiring Soon
          </span>
          <div className="text-sm text-yellow-600">
            {formatDate(expiryDate)}
          </div>
        </div>
      );
    }

    return (
      <div className="text-sm text-gray-600">{formatDate(expiryDate)}</div>
    );
  };

  // Helper function to get category badge
  const getCategoryBadge = (category: string) => {
    return <span className="">{category}</span>;
  };

  const formattedStocks = (stocks || []).map((stock) => ({
    id: stock.id,
    item: stock.attributes.service_item_name,
    category: stock.attributes.category,
    quantity: stock.attributes.quantity,
    expiry_date: stock.attributes.expiry_date,
    cost: stock.attributes.cost,
    service_item_price: stock.attributes.service_item_price,
    selling_price: stock.attributes.service_item_price,
    profit: stock.attributes.profit,
    is_expired: stock.attributes.is_expired,
  }));

  const handleDelete = async (stockId: number) => {
    const stock = stocks.find((s) => s.id === stockId);
    if (stock) {
      setSelectedStock(stock);
      setHistoryModalOpen(true);
    }
    const response = await deleteStock(stockId);
    if (response) {
      // Handle successful deletion (e.g., show a success message, refresh the stock list)
    }
  };

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

  const columns: Columns[] = [
    {
      key: "item",
      label: "Item Name",
      render: (_, stock) => (
        <div className="font-medium text-gray-900">{stock.item}</div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (_, stock) => getCategoryBadge(stock.category),
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (_, stock) => getQuantityDisplay(stock.quantity),
    },
    {
      key: "cost",
      label: "Cost Price",
      render: (_, stock) => (
        <span className="font-medium text-gray-700">
          {formatCurrency(stock.cost)}
        </span>
      ),
    },
    {
      key: "service_item_price",
      label: "Selling Price",
      render: (_, stock) => (
        <span className="font-medium t">
          {formatCurrency(stock.service_item_price)}
        </span>
      ),
    },
    {
      key: "profit",
      label: "Profit",
      render: (_, stock) => (
        <span className="font-medium tetx-gray-700">
          {formatCurrency(stock.profit || "-")}
        </span>
      ),
    },
    {
      key: "expiry_date",
      label: "Expiry Status",
      render: (_, stock) =>
        getExpiryStatusDisplay(stock.expiry_date, stock.is_expired),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, stock) => {
        const qty =
          typeof stock.quantity === "string"
            ? parseInt(stock.quantity)
            : stock.quantity;
        const isLowStock = qty < 10;
        const expired = isExpired(stock.expiry_date, stock.is_expired);

        return (
          <div className="flex items-center gap-2">
            <button onClick={() => handleDelete(stock.id)}>
              <Trash className="w-3.5 h-3.5 text-red-600" />
            </button>
            <button
              onClick={() => handleRestock(stock.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md ${
                isLowStock || expired
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-primary hover:bg-primary/90 text-white"
              }`}
              title={`Restock Item${isLowStock ? " (Low Stock)" : ""}${
                expired ? " (Expired)" : ""
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restock
              {(isLowStock || expired) && (
                <AlertTriangle className="w-3 h-3 ml-1" />
              )}
            </button>
            <button
              onClick={() =>
                navigate(`/dashboard/stock-history/${stock.id}`, {
                  state: { stockItem: stock },
                })
              }
              className="inline-flex items-center gap-1.5 border border-primary/20 hover:border-primary/40 text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              title="View History"
            >
              <History className="w-3.5 h-3.5" />
              History
            </button>
          </div>
        );
      },
    },
  ];

  if (isLoading) return <Loader />;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table
          data={formattedStocks}
          columns={columns}
          rowKey="id"
          loading={isLoading}
        />
      </div>

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

export default InventoryStockTable;
