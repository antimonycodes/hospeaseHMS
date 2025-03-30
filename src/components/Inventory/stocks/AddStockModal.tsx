import React, { useState } from "react";
import { X } from "lucide-react";
import SearchBar from "../../ReusablepatientD/SearchBar";

interface formDataData {
  staffId: string;
  staffFirstName: string;
  staffLastName: string;
  category: string;
  itemName: string;
  qantity: string;
}

interface AddStockModalProps {
  onClose: () => void;
  formData: formDataData;
  showSearchBar?: boolean;
  showPaymentType?: boolean;
}

const AddStockModal: React.FC<AddStockModalProps> = ({
  onClose,
  formData: initialFormData,
  showSearchBar = false,
  showPaymentType = false,
}) => {
  const [formData, setFormData] = useState<formDataData>(initialFormData);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg custom-shadow overflow-y-auto   p-12 h-[90%] w-full  max-w-[980px] ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Add New Payment</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {showSearchBar && (
          <div className="flex flex-col gap-[10px] mb-[40px]">
            <SearchBar />
            <div className="flex w-full items-center border border-gray-200 py-2 px-4 rounded-[10px] text-sm font-inter font-normal text-[#98A2B3]">
              Michael Kiriko
            </div>
            <div className="flex w-full items-center border border-gray-200 py-2 px-4 rounded-[10px] text-sm font-inter font-normal text-[#98A2B3]">
              Michael Kiriko
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-custom-black mb-1">
              Staff ID
            </label>
            <input
              type="text"
              name=" staffId"
              value={formData.staffId}
              onChange={handleInputChange}
              className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-custom-black mb-1">
              Staff First Name
            </label>
            <input
              type="text"
              name="staffFirstName"
              value={formData.staffFirstName}
              onChange={handleInputChange}
              className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
            />
          </div>{" "}
          <div>
            <label className="block text-sm font-medium text-custom-black mb-1">
              Staff Last Name
            </label>
            <input
              type="text"
              name="staffLastName"
              value={formData.staffLastName}
              onChange={handleInputChange}
              className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-custom-black mb-1">
              Item Category
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm appearance-none"
              >
                <option value="Syringe">Syringe</option>
                <option value="Syringe">Syringe</option>
                <option value="Syringe">Syringe</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-custom-black">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>{" "}
          <div>
            <label className="block text-sm font-medium text-custom-black mb-1">
              Item Name
            </label>
            <div className="relative">
              <select
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm appearance-none"
              >
                <option value="Syringe">Syringe</option>
                <option value="Syringe">Syringe</option>
                <option value="Syringe">Syringe</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-custom-black">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-custom-black mb-1">
              Quantity
            </label>
            <div className="relative">
              <select
                name="qantity"
                value={formData.itemName}
                onChange={handleInputChange}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm appearance-none"
              >
                <option value=" PCS">10 PCS</option>
                <option value="PCS">20 PCS</option>
                <option value="PCS">30 PCS</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-custom-black">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => console.log("Form Data:", formData)}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm"
          >
            Add Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStockModal;
