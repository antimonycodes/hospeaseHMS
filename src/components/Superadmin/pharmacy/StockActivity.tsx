import React, { useEffect } from "react";
import { useInventoryStore } from "../../Inventory/overview/useInventoryStore";
import Table from "../../../Shared/Table";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Loader from "../../../Shared/Loader";

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
    label: "Price",
    render: (_, item) => (
      <span className="text-[#667085] text-sm">
        ₦{item.attributes.stock_request?.requests?.service_item_price}
      </span>
    ),
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

  useEffect(() => {
    getStockActivity();
  }, [getStockActivity]);

  // Debug logging to see what data is being received
  console.log("Loading state:", isLoading);
  console.log("Stock activities:", stockActivities);

  // Extract activities from the nested structure
  const activities = stockActivities?.data || [];
  console.log("Extracted activities:", activities);

  return (
    <div>
      <Tablehead tableTitle="Stock Activity Log" showButton={false} />
      <div className="w-full bg-white rounded-b-[8px] shadow-table">
        {isLoading ? (
          <Loader />
        ) : activities.length === 0 ? (
          <p className="p-4 text-center text-gray-500">
            No stock activity found
          </p>
        ) : (
          <Table
            data={activities}
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
