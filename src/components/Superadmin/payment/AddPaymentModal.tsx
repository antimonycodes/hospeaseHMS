import { X } from "lucide-react";
import React from "react";
import Button from "../../../Shared/Button";

interface AddPaymentModalProps {
  setShowModal: (show: boolean) => void;
}

const AddPaymentModal = ({ setShowModal }: AddPaymentModalProps) => {
  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg custom-shadow overflow-y-auto w-full max-w-2xl h-[90%]">
        <div className=" p-4 md:p-12">
          {/* header */}
          <div className=" flex flex-col md:flex-row justify-between items-center mb-4 ">
            <h2 className=" text-custom-black text-lg font-semibold">
              Add New Doctor
            </h2>
            <button onClick={() => setShowModal(false)} className="">
              <X className=" text-black" />
            </button>
          </div>
          {/* form */}
          <form action="" className=" space-y-8">
            {/* Invoice number */}
            <div>
              <label
                htmlFor="Invoice Number"
                className="block text-sm font-medium text-custom-black  mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                placeholder="H03082025"
                required
              />
            </div>
            {/* Payment type */}
            <div>
              <label
                htmlFor="Invoice Number"
                className="block text-sm font-medium text-custom-black  mb-1"
              >
                Payment type
              </label>
              <div className="relative">
                <select
                  name="paymentMethod"
                  // value={expenseForm.paymentMethod}
                  className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm appearance-none"
                >
                  <option value="Bank Transfer">Yearly</option>
                  <option value="Cash">Quarterly</option>
                  <option value="Card">Monthly</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
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
            {/* Amount */}
            <div>
              <label
                htmlFor="Invoice Number"
                className="block text-sm font-medium text-custom-black  mb-1"
              >
                Amount
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                placeholder="₦ 1,000,000.00"
                required
              />
            </div>
            {/* button */}
            <div className=" mt-8">
              <Button variant="primary">Pay Now</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentModal;
