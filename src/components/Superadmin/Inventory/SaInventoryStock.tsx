import { JSX, useEffect, useState } from "react";
import {
  RotateCcw,
  History,
  Package,
  AlertTriangle,
  Clock,
  Trash,
  Search,
  Filter,
  X,
  Calendar,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import Table from "../../../Shared/Table";
import { useInventoryStore } from "../../Inventory/overview/useInventoryStore";
import { useNavigate } from "react-router-dom";
import RestockModal from "../../Inventory/stocks/RestockModal";
import Loader from "../../../Shared/Loader";

type StockData = {
  profit: string;
  id: number;
  selling_price: string;
  item_name: string;
  category: string;
  quantity: string;
  expiry_date: string;
  cost: number;
  is_expired?: boolean;
  created_at: string;
  quantity_sold?: string;
  base_profit?: number;
};

type SortOrder = "asc" | "desc" | null;
type SortableColumn = keyof StockData | "base_profit";

interface SortConfig {
  column: SortableColumn | null;
  order: SortOrder;
}

type Columns = {
  key: keyof StockData | "actions" | "base_profit";
  label: string;
  sortable?: boolean;
  render?: (value: any, stocks: StockData) => JSX.Element;
};

interface FilterParams {
  search: string;
  category: string;
  profit_range: string;
  stock_status: string;
  expiry_status: string;
  from_date: string;
  to_date: string;
}

type SaInventoryStockProps = {
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
      created_at?: string;
      quantity_sold?: string;
    };
    id: number;
  }[];
};

const SaInventoryStock = ({ stocks, isLoading }: SaInventoryStockProps) => {
  const {
    reStock,
    reStockHistory,
    restockHistoryData,
    deleteStock,
    getAllStocksSa,
  } = useInventoryStore();
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: null,
    order: null,
  });

  // Filter states
  const [filters, setFilters] = useState<FilterParams>({
    search: "",
    category: "",
    profit_range: "",
    stock_status: "",
    expiry_status: "",
    from_date: "",
    to_date: "",
  });

  // Get unique categories from stocks for filter dropdown
  const categories = Array.from(
    new Set(stocks?.map((stock) => stock.attributes.category).filter(Boolean))
  );

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleFilterChange();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  // Handle filter changes
  const handleFilterChange = () => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        queryParams.append(key, value.trim());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/admin/inventory/all-inventory-items?${queryString}`
      : "/admin/inventory/all-inventory-items";

    getAllStocksSa("1", "1000", endpoint);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      profit_range: "",
      stock_status: "",
      expiry_status: "",
      from_date: "",
      to_date: "",
    });
    getAllStocksSa("1", "1000", "/admin/inventory/all-inventory-items");
  };

  // Apply filters
  const applyFilters = () => {
    handleFilterChange();
    setShowFilters(false);
  };

  // Helper function to calculate base profit
  const calculateBaseProfit = (sellingPrice: string | number, cost: number) => {
    let numSellingPrice: number;
    if (typeof sellingPrice === "string") {
      numSellingPrice = parseFloat(sellingPrice.replace(/,/g, ""));
    } else {
      numSellingPrice = sellingPrice;
    }

    if (isNaN(numSellingPrice) || isNaN(cost)) return 0;
    return numSellingPrice - cost;
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

  const formattedStocks = (stocks || []).map((stock) => {
    const baseProfit = calculateBaseProfit(
      stock.attributes.service_item_price,
      stock.attributes.cost
    );

    return {
      id: stock.id,
      item_name: stock.attributes.service_item_name,
      category: stock.attributes.category,
      quantity: stock.attributes.quantity,
      expiry_date: stock.attributes.expiry_date,
      cost: stock.attributes.cost,
      selling_price: stock.attributes.service_item_price,
      profit: stock.attributes.profit,
      created_at: stock.attributes.created_at ?? "",
      is_expired: stock.attributes.is_expired,
      quantity_sold: stock.attributes.quantity_sold ?? "0",
      base_profit: baseProfit,
    };
  });

  // Apply sorting to formatted stocks
  const sortedStocks = [...formattedStocks].sort((a, b) => {
    if (!sortConfig.column || !sortConfig.order) return 0;

    const aValue = a[sortConfig.column as keyof StockData];
    const bValue = b[sortConfig.column as keyof StockData];

    // Handle different data types
    let comparison = 0;

    if (typeof aValue === "string" && typeof bValue === "string") {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      comparison = aValue - bValue;
    } else {
      // Convert to string for comparison
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sortConfig.order === "asc" ? comparison : -comparison;
  });

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

  // Sorting function
  const handleSort = (column: SortableColumn) => {
    let newOrder: SortOrder = "asc";

    if (sortConfig.column === column) {
      if (sortConfig.order === "asc") {
        newOrder = "desc";
      } else if (sortConfig.order === "desc") {
        newOrder = null;
      } else {
        newOrder = "asc";
      }
    }

    setSortConfig({
      column: newOrder ? column : null,
      order: newOrder,
    });
  };

  // Sort icon component
  const SortIcon = ({ column }: { column: SortableColumn }) => {
    if (sortConfig.column !== column) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }

    if (sortConfig.order === "asc") {
      return <ChevronUp className="w-4 h-4 text-primary" />;
    } else if (sortConfig.order === "desc") {
      return <ChevronDown className="w-4 h-4 text-primary" />;
    }

    return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
  };

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

  const columns: Columns[] = [
    {
      key: "item_name",
      label: "Item Name",
      sortable: true,
      render: (_, stock) => (
        <div className="font-medium text-gray-900">{stock.item_name}</div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (_, stock) => getCategoryBadge(stock.category),
    },
    {
      key: "quantity",
      label: "Quantity",
      sortable: true,
      render: (_, stock) => getQuantityDisplay(stock.quantity),
    },
    {
      key: "cost",
      label: "Cost Price",
      sortable: true,
      render: (_, stock) => (
        <span className="font-medium text-gray-700">
          {formatCurrency(stock.cost)}
        </span>
      ),
    },
    {
      key: "selling_price",
      label: "Selling Price",
      sortable: true,
      render: (_, stock) => (
        <span className="font-medium t">
          {formatCurrency(stock.selling_price)}
        </span>
      ),
    },
    {
      key: "base_profit",
      label: "Base Profit",
      sortable: true,
      render: (_, stock) => (
        <span
          className={`font-medium ${
            (stock.base_profit ?? 0) >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {formatCurrency(stock.base_profit ?? 0)}
        </span>
      ),
    },
    {
      key: "quantity_sold",
      label: "Quantity Sold",
      sortable: true,
      render: (_, stock) => (
        <span className="font-medium t">{stock.quantity_sold}</span>
      ),
    },
    {
      key: "profit",
      label: "Total Profit",
      sortable: true,
      render: (_, stock) => (
        <span className="font-medium tetx-gray-700">
          {formatCurrency(stock.profit || "-")}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      sortable: true,
      render: (_, stock) => <span>{stock.created_at}</span>,
    },
    {
      key: "expiry_date",
      label: "Expiry Status",
      sortable: true,
      render: (_, stock) =>
        getExpiryStatusDisplay(stock.expiry_date, stock.is_expired),
    },
    {
      key: "actions",
      label: "",
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

  // Custom Table component that includes sorting in headers
  const SortableTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable
                    ? "cursor-pointer hover:bg-gray-100 select-none"
                    : ""
                }`}
                onClick={() =>
                  column.sortable && handleSort(column.key as SortableColumn)
                }
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && (
                    <SortIcon column={column.key as SortableColumn} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedStocks.map((stock) => (
            <tr key={stock.id} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm"
                >
                  {column.render
                    ? column.render(stock[column.key as keyof StockData], stock)
                    : stock[column.key as keyof StockData]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (isLoading) return <Loader />;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Search and Filter Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>

          {/* Filter Toggle and Clear */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {Object.values(filters).some((value) => value !== "") && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  value={filters.category}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    value={filters.from_date}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        from_date: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    value={filters.to_date}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        to_date: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={applyFilters}
                className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <SortableTable />

      {/* Modals */}
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
