import React, { useEffect, useState, JSX } from "react";
import Loader from "../../../Shared/Loader";
import Table from "../../../Shared/Table";
import { useInventoryStore } from "../overview/useInventoryStore";
import { useLocation, useParams } from "react-router-dom";
import { BsArrowBarLeft } from "react-icons/bs";
import { ChevronLeft } from "lucide-react";

type RestockData = {
  id: number;
  quantity: number;
  date: string;
  user: string;
};

type Columns = {
  key: keyof RestockData;
  label: string;
  render?: (value: any, data: RestockData) => JSX.Element;
};

const RestockHistoryModal = () => {
  const { id } = useParams<{ id: string }>();
  const stockId = Number(id);
  const location = useLocation();
  const stockItem = location.state?.stockItem;

  console.log(stockItem);

  const { reStockHistory, restockHistoryData, isLoading } = useInventoryStore();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!hasFetched && stockId) {
      reStockHistory(stockId);
      setHasFetched(true);
    }
  }, [stockId, hasFetched, reStockHistory]);

  const formattedHistory = restockHistoryData.map((item) => ({
    id: item.id,
    name: item.attributes?.inventory.item || "Unknown",
    quantity: item.attributes?.added_quantity || 0,
    date: item.attributes?.created_at || "N/A",
    user: item.attributes?.restocked_by || "Unknown",
  }));

  const columns: Columns[] = [
    {
      key: "date",
      label: "Date",
      render: (_, data) => (
        <span>{new Date(data.date).toLocaleDateString()}</span>
      ),
    },
    {
      key: "quantity",
      label: "Quantity Added",
      render: (_, data) => <span>{data.quantity}</span>,
    },
    {
      key: "user",
      label: "Restocked By",
      render: (_, data) => <span>{data.user}</span>,
    },
  ];

  return (
    <div className="">
      <div className="bg-white p-4 rounded shadow w-full ">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <ChevronLeft className="mr-2" />
            Back
          </button>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Restock History:{" "}
            {stockItem?.attributes?.service_item_name ||
              formattedHistory?.[0]?.name ||
              "Unknown Item"}
          </h2>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="mt-4">
            {formattedHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No restock history found for this item
              </div>
            ) : (
              <Table data={formattedHistory} columns={columns} rowKey="id" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestockHistoryModal;
