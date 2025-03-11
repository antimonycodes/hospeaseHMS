import { X } from "lucide-react";

interface formDataData {
  //   id: string;
  item: string;
  amount: string;
  purchasedFrom: string;
  purchasedBy: string;
  paymentMethod: string;
}

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: formDataData;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  formData,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Add New</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item
            </label>
            <input
              type="text"
              name="item"
              //   value={expenseForm.item}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchased from
            </label>
            <input
              type="text"
              name="purchasedFrom"
              //   value={expenseForm.purchasedFrom}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="text"
              name="amount"
              //   value={expenseForm.amount}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchased by
            </label>
            <input
              type="text"
              name="purchasedBy"
              //   value={expenseForm.purchasedBy}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <div className="relative">
              <select
                name="paymentMethod"
                // value={expenseForm.paymentMethod}
                className="w-full p-2 border border-gray-300 rounded-md text-sm appearance-none"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
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
        </div>

        <div className="mt-6">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm">
            Add payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;
