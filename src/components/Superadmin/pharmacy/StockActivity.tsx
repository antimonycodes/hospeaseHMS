import React, { useEffect, useState, useMemo } from "react";
import { useInventoryStore } from "../../Inventory/overview/useInventoryStore";
import Table from "../../../Shared/Table";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Loader from "../../../Shared/Loader";
import { BsFillImageFill } from "react-icons/bs";
import { CurrencyIcon } from "lucide-react";

export type StockActivityType = {
  id: number;
  type: string;
  attributes: {
    patient: string;
    recorded_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    requested_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    quantity_deducted: number;
    inventory: any; // or define better type if available
    stock_request: {
      id: number;
      requests: {
        id: number;
        service_item_name: string;
        service_item_price: string;
      };
    };
    created_at: string;
  };
};

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, record: T) => React.ReactNode;
}

// Search Component
const SearchBar: React.FC<{
  searchTerm: string;
  onSearchChange: (term: string) => void;
}> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mb-4 mx-6">
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by item name or sold to..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    </div>
  );
};

// Daily Stats Card Component
interface DailyStatsCardProps {
  stockActivities: StockActivityType[];
  selectedDate?: string;
}

const DailyStatsCard: React.FC<DailyStatsCardProps> = ({
  stockActivities,
  selectedDate,
}) => {
  // Function to calculate daily stats
  const calculateDailyStats = () => {
    if (!stockActivities || stockActivities.length === 0) {
      return { totalItems: 0, totalAmount: 0, dateLabel: "No Data" };
    }

    // If selectedDate is provided, filter by that date, otherwise use today's date
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    const targetDate = selectedDate || today;

    // Filter activities by the target date
    const dailyActivities = stockActivities.filter((activity) => {
      const activityDate = activity.attributes.created_at;
      return activityDate === targetDate;
    });

    // Calculate totals
    const totalItems = dailyActivities.reduce((sum, activity) => {
      const quantity = parseInt(
        activity.attributes.quantity_deducted?.toString() || "0"
      );
      return sum + quantity;
    }, 0);

    const totalAmount = dailyActivities.reduce((sum, activity) => {
      const price = parseFloat(
        activity.attributes.stock_request?.requests?.service_item_price || "0"
      );
      const quantity = parseInt(
        activity.attributes.quantity_deducted?.toString() || "0"
      );
      return sum + price * quantity;
    }, 0);

    return {
      totalItems,
      totalAmount,
      dateLabel: targetDate,
      transactionCount: dailyActivities.length,
    };
  };

  const { totalItems, totalAmount, dateLabel, transactionCount } =
    calculateDailyStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mx-6">
      {/* Daily Items Sold Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Daily Items Sold
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {totalItems}
            </p>
            <p className="text-xs text-gray-500 mt-1">{dateLabel}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Daily Total Amount Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mx-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Daily Total Amount
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ₦
              {totalAmount.toLocaleString("en-NG", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-500 mt-1">{dateLabel}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-full">
            <CurrencyIcon />
          </div>
        </div>
      </div>

      {/* Daily Transactions Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Daily Transactions
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {transactionCount}
            </p>
            <p className="text-xs text-gray-500 mt-1">{dateLabel}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-full">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// Date Selector Component
const DateSelector: React.FC<{
  stockActivities: StockActivityType[];
  selectedDate: string;
  onDateChange: (date: string) => void;
}> = ({ stockActivities, selectedDate, onDateChange }) => {
  // Get unique dates from stock activities
  const getAvailableDates = () => {
    if (!stockActivities || stockActivities.length === 0) return [];

    const dates = stockActivities.map(
      (activity) => activity.attributes.created_at
    );
    return [...new Set(dates)].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
  };

  const availableDates = getAvailableDates();

  return (
    <div className="mb-4 mx-6 flex items-center gap-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Date
      </label>
      <select
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Today</option>
        {availableDates.map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>
    </div>
  );
};

const columns: Column<StockActivityType>[] = [
  {
    key: "id",
    label: "Item Name",
    render: (_, item) => (
      <span className="text-[#667085] text-sm">
        {item.attributes.stock_request?.requests?.service_item_name || "N/A"}
      </span>
    ),
  },
  {
    key: "id",
    label: "Sold To",
    render: (_, item) => (
      <span className="text-[#667085] text-sm">{item.attributes.patient}</span>
    ),
  },
  {
    key: "id",
    label: "Recorded By",
    render: (_, item) => (
      <span className="text-[#667085] text-sm">
        {item.attributes.recorded_by.first_name}{" "}
        {item.attributes.recorded_by.last_name}
      </span>
    ),
  },
  {
    key: "id",
    label: "Quantity Deducted",
    render: (_, item) => (
      <span className="text-[#667085] text-sm">
        {item.attributes.quantity_deducted}
      </span>
    ),
  },
  {
    key: "id",
    label: "Selling Price",
    render: (_, item) => (
      <span className="text-[#667085] text-sm">
        ₦{item.attributes.stock_request?.requests?.service_item_price}
      </span>
    ),
  },
  {
    key: "id",
    label: "Total",
    render: (_, item) => {
      const price = parseFloat(
        item.attributes.stock_request?.requests?.service_item_price || "0"
      );
      const quantity = item.attributes.quantity_deducted || 0;
      const total = price * quantity;
      return (
        <span className="text-[#667085] text-sm font-medium">
          ₦{total.toLocaleString()}
        </span>
      );
    },
  },
  {
    key: "id",
    label: "Date",
    render: (_, item) => (
      <span className="text-[#667085] text-sm">
        {item.attributes.created_at}
      </span>
    ),
  },
];

const StockActivity = () => {
  const { stockActivities, getStockActivity, isLoading } =
    useInventoryStore() as unknown as {
      stockActivities: { data: StockActivityType[] } | null;
      getStockActivity: () => void;
      isLoading: boolean;
    };

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    getStockActivity();
  }, [getStockActivity]);

  // Extract activities from the nested structure
  const activities = stockActivities?.data || [];

  // Filter activities based on search term and selected date
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Filter by search term (item name or sold to)
    if (searchTerm) {
      filtered = filtered.filter((activity) => {
        const itemName =
          activity.attributes.stock_request?.requests?.service_item_name || "";
        const soldTo = activity.attributes.patient || "";

        return (
          itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          soldTo.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Filter by selected date
    if (selectedDate) {
      filtered = filtered.filter((activity) => {
        return activity.attributes.created_at === selectedDate;
      });
    }

    return filtered;
  }, [activities, searchTerm, selectedDate]);

  // Debug logging to see what data is being received
  console.log("Loading state:", isLoading);
  console.log("Stock activities:", stockActivities);
  console.log("Extracted activities:", activities);
  console.log("Filtered activities:", filteredActivities);

  return (
    <div className=" bg-white">
      {/* Search and Filter Section */}
      {!isLoading && activities.length > 0 && (
        <div className="mb-6">
          <DateSelector
            stockActivities={activities}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          <DailyStatsCard
            stockActivities={filteredActivities}
            selectedDate={selectedDate || undefined}
          />
        </div>
      )}

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <Tablehead tableTitle="" showButton={false} />

      <div className="w-full bg-white rounded-b-[8px] shadow-table">
        {isLoading ? (
          <Loader />
        ) : activities.length === 0 ? (
          <p className="p-4 text-center text-gray-500">
            No pharmacy sales activity found
          </p>
        ) : filteredActivities.length === 0 && (searchTerm || selectedDate) ? (
          <p className="p-4 text-center text-gray-500">
            No results found for your search criteria
          </p>
        ) : (
          <Table
            data={filteredActivities}
            columns={columns}
            rowKey="id"
            loading={isLoading}
            radius="rounded-none"
          />
        )}
      </div>
    </div>
  );
};

export default StockActivity;
