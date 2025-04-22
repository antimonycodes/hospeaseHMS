import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import {
  CreateStockData,
  useInventoryStore,
} from "../overview/useInventoryStore";

// export interface AddStockData {
//   item: string;
//   quantity: string;
//   category_id: string;
//   expiry_date: string;
//   cost: number;
//   image: File | null;
// }

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

const AddStockModal = ({
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
    cost: "",
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

  // const handleSubmit = async (e: React.FormEvent) => {

  //   e.preventDefault();

  //   if (
  //     !stock.item ||
  //     !stock.category_id ||
  //     !stock.cost ||
  //     !stock.quantity ||
  //     !stock.expiry_date
  //   ) {
  //     toast.error("Please fill in all required fields");
  //     return;
  //   }

  //   console.log("Submitting stock data:", stock);

  //   try {
  //     const success = await createStock(stock);
  //     if (success) {
  //       setStock({
  //         item: "",
  //         quantity: "",
  //         category_id: "",
  //         expiry_date: "",
  //         cost: 0,
  //         image: null,
  //       });
  //       onClose();
  //     }
  //   } catch (error) {
  //     // Error is handled in createStock with toast
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !stock.item ||
      !stock.category_id ||
      !stock.cost ||
      !stock.quantity ||
      !stock.expiry_date
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!createStock) {
      console.error("createStock function is not defined");
      return;
    }

    // Correct payload without overriding image
    const payload = { ...stock };

    const success = await createStock(
      payload,
      endpoint,
      "/inventory/all-inventory-items"
    );
    if (success) {
      setStock({
        item: "",
        quantity: "",
        category_id: "",
        expiry_date: "",
        cost: "",
        image: null,
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
            </div>
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
                type="text"
                name="cost"
                value={stock.cost}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
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

export default AddStockModal;
