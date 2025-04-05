import React, { useState } from "react";
import { X } from "lucide-react";
import SearchBar from "../components/ReusablepatientD/SearchBar";
import { useFinanceStore } from "../store/staff/useFinanceStore";

interface FormData {
  patient_id: string; // Changed to string for input, will convert to number
  amount: string;
  purpose: string;
  payment_method: string; // Updated to snake_case
  payment_type: string; // Updated to snake_case
}

interface AddPaymentModalProps {
  onClose: () => void;
  formData: FormData;
  showSearchBar?: boolean;
  showPaymentType?: boolean;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  onClose,
  formData: initialFormData,
  showSearchBar = false,
  showPaymentType = false,
}) => {
  const { createPayment, isLoading } = useFinanceStore();
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.patient_id ||
      !formData.amount ||
      !formData.purpose ||
      !formData.payment_method ||
      !formData.payment_type
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      ...formData,
      patient_id: parseInt(formData.patient_id), // Convert to number for API
    };

    const success = await createPayment(payload);
    if (success) {
      setFormData({
        patient_id: "",
        amount: "",
        purpose: "",
        payment_method: "",
        payment_type: "",
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white hide-scroll rounded-lg custom-shadow overflow-y-auto p-12 h-[90%] w-full max-w-[980px]">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Add New Payment</h2>
            <button type="button" onClick={onClose}>
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
                Patient ID
              </label>
              <input
                type="number"
                name="patient_id"
                value={formData.patient_id}
                onChange={handleInputChange}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Amount
              </label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Purpose
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Payment Method
              </label>
              <div className="relative">
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm appearance-none"
                  disabled={isLoading}
                >
                  <option value="">Select Payment Method</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="transfer">Transfer</option>
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
            {showPaymentType && (
              <div>
                <label className="block text-sm font-medium text-custom-black mb-1">
                  Payment Type
                </label>
                <div className="relative">
                  <select
                    name="payment_type"
                    value={formData.payment_type}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm appearance-none"
                    disabled={isLoading}
                  >
                    <option value="">Select Payment Type</option>
                    <option value="half payment">Half Payment</option>
                    <option value="full payment">Full Payment</option>
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
            )}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md text-sm"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModal;
