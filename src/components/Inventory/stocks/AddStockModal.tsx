import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import {
  CreateStockData,
  useInventoryStore,
} from "../overview/useInventoryStore";
import { useCombinedStore } from "../../../store/super-admin/useCombinedStore";
import Select from "react-select";

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
  const { getAllItems, items } = useCombinedStore();

  useEffect(() => {
    getAllCategorys("/admin/inventory/category/all-records");
    getAllItems();
  }, [getAllCategorys, fetchEndpoint]);

  console.log(items, "items");

  const [stock, setStock] = useState<any>({
    service_item_name: "",
    quantity: "",
    category_id: null,
    expiry_date: "",
    cost: "",
    image: null,
    service_charge_id: "",
    service_item_price: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStock((prev: any) => ({
      ...prev,
      [name]: name === "cost" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setStock((prev: any) => ({ ...prev, image: file }));
  };
  console.log(categorys, "categoryssss");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !stock.service_item_name ||
      !stock.category_id ||
      !stock.cost ||
      !stock.quantity ||
      !stock.expiry_date ||
      !stock.service_charge_id ||
      !stock.service_item_price
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
      "/admin/inventory/all-inventory-items"
    );
    if (success) {
      setStock({
        service_item_name: "",
        quantity: "",
        category_id: "",
        expiry_date: "",
        cost: "",
        image: null,
        service_charge_id: "",
        service_item_price: "",
      });
      onClose();
    }
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      width: "100%",
      padding: "6px 12px",
      border: "1px solid #D0D5DD",
      borderRadius: "0.375rem", // Tailwind: rounded-md
      fontSize: "0.875rem", // Tailwind: text-sm
      boxShadow: "none",
      "&:hover": {
        borderColor: "#D0D5DD",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 50,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#F3F4F6" : "#fff", // hover
      color: "#111827",
      fontSize: "0.875rem",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      fontSize: "0.875rem",
      color: "#6B7280",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      fontSize: "0.875rem",
    }),
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
                Item name
              </label>
              <Select
                styles={customStyles}
                options={items.map((item) => ({
                  label: item.attributes.name,
                  value: item.id,
                }))}
                isDisabled={isLoading}
                onChange={(selected) => {
                  const selectedItem = items.find(
                    (item) => item.id === selected?.value
                  );
                  if (selectedItem) {
                    setStock((prev: any) => ({
                      ...prev,
                      service_item_name: selectedItem.attributes.name,
                      service_charge_id: selectedItem.id,
                      service_item_price:
                        selectedItem.attributes.amount.replace(/,/g, ""),
                    }));
                  }
                }}
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
                {categorys?.map((category) => (
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
            <div className=" hidden">
              <label className="block text-sm font-medium text-custom-black mb-1">
                Item Price
              </label>
              <input
                type="text"
                name="service_item_price"
                value={stock.service_item_price}
                onChange={handleChange}
                disabled={true}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm bg-gray-100"
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
