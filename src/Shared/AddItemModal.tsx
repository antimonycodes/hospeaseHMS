import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  CreateStockData,
  useInventoryStore,
} from "../components/Inventory/overview/useInventoryStore";

export interface Category {
  id: number;
  attributes: {
    name: string;
  };
}

interface AddStockModalProps {
  onClose: () => void;
  isLoading?: boolean;
  createStock?: (
    data: CreateStockData,
    endpoint?: string,
    refreshEndpoint?: string
  ) => Promise<boolean | null>;
  refreshEndpoint?: string;
  endpoint?: string;
  fetchEndpoint?: string;
  createEndpoint?: string;
}

const AddItemModal = ({
  onClose,
  createStock,
  isLoading,
  endpoint,
  refreshEndpoint,
  fetchEndpoint,
  createEndpoint,
}: AddStockModalProps) => {
  const { getAllCategorys, categorys } = useInventoryStore();
  useEffect(() => {
    getAllCategorys(fetchEndpoint || "");
  }, [getAllCategorys, fetchEndpoint]);
  const [stock, setStock] = useState<CreateStockData>({
    item: "",
    quantity: "",
    category_id: "",
    expiry_date: "",
    cost: 0,
    image: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStock((prev) => ({
      ...prev,
      [name]: name === "cost" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setStock((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !stock.item ||
      !stock.category_id ||
      !stock.cost ||
      !stock.quantity ||
      !stock.expiry_date
    )
      return;

    if (!createStock) {
      console.error("createStock function is not defined");
      return;
    }

    const success = await createStock(
      stock,
      endpoint,
      "/inventory/all-inventory-items"
    );
    if (success) {
      setStock({
        item: "",
        quantity: "",
        category_id: "",
        expiry_date: "",
        cost: 0,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-y-auto p-12 h-[90%] w-full max-w-[980px]">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Add New Item</h2>
            <button type="button" onClick={onClose} disabled={isLoading}>
              <X />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Item Name
              </label>
              <input
                type="text"
                name="item"
                value={stock.item}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Category
              </label>
              <select
                name="category_id"
                value={stock.category_id}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
              >
                <option value="">Select Category</option>
                {categorys.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.attributes.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={stock.quantity}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Purchase Cost
              </label>
              <input
                type="number"
                name="cost"
                value={stock.cost}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiry_date"
                value={stock.expiry_date}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
              />
            </div>

            {/* <div>
                <label className="block text-sm font-medium text-custom-black mb-1">
                  Image (Optional)
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
                  accept="image/*"
                />
              </div> */}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md text-sm"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
