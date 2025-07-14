import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useInventoryStore } from "../overview/useInventoryStore";

interface RestockModalProps {
  onClose: () => void;
  isLoading?: boolean;
  reStock?: (data: any) => Promise<void>;
  stockItem: {
    id: number;
    attributes: {
      service_item_name: string;
      category: string;
      quantity: string;
      expiry_date: string;
      cost: number;
      service_item_price?: string;
      service_charge_id?: string;
    };
  } | null;
}

const RestockModal = ({
  onClose,
  reStock,
  isLoading,
  stockItem,
}: RestockModalProps) => {
  const [restockData, setRestockData] = useState({
    inventory_id: "",
    quantity: "",
    expiry_date: "",
    cost: "",
  });

  const { getAllStocks } = useInventoryStore();

  useEffect(() => {
    if (stockItem) {
      const rawCost = stockItem.attributes.cost;
      const cleanCost =
        typeof rawCost === "string"
          ? parseFloat((rawCost as string).replace(/,/g, ""))
          : rawCost;

      setRestockData({
        inventory_id: stockItem.id.toString(),
        quantity: "",
        expiry_date: stockItem.attributes.expiry_date,
        cost: cleanCost.toString(),
      });
    }
  }, [stockItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRestockData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!restockData.quantity || parseInt(restockData.quantity) <= 0) {
    //   toast.error("Please enter a valid quantity");
    //   return;
    // }

    if (!reStock) {
      console.error("reStock function is not defined");
      return;
    }
    if (!restockData.cost || parseFloat(restockData.cost) <= 0) {
      toast.error("Please enter a valid cost");
      return;
    }

    if (!restockData.expiry_date) {
      toast.error("Please select a valid expiry date");
      return;
    }

    try {
      await reStock(restockData);
      onClose();
      // window.location.reload();
      getAllStocks();
    } catch (error) {
      console.error("Error restocking:", error);
    }
  };

  if (!stockItem) return null;

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-y-auto p-12 h-[90%] w-full max-w-[980px]">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Restock Item</h2>
            <button type="button" onClick={onClose} disabled={isLoading}>
              <X />
            </button>
          </div>

          <div className="grid grid-col-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Item name
              </label>
              <input
                type="text"
                value={stockItem.attributes.service_item_name}
                disabled
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Category
              </label>
              <input
                type="text"
                value={stockItem.attributes.category}
                disabled
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Current Quantity
              </label>
              <input
                type="text"
                value={stockItem.attributes.quantity}
                disabled
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Add Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={restockData.quantity}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
                // min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Cost
              </label>
              <input
                type="number"
                name="cost"
                value={restockData.cost}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiry_date"
                value={restockData.expiry_date}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md text-sm"
              disabled={isLoading}
            >
              {isLoading ? "Restocking..." : "Restock Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestockModal;
