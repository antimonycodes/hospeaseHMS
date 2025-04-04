import { X } from "lucide-react";
import { CreateExpenseData } from "../store/staff/useFinanceStore";
import { useState } from "react";

interface AddExpenseModalProps {
  onClose: () => void;
  createExpense: (data: CreateExpenseData, endpoint: string) => any; // Add endpoint as a parameter
  isLoading: boolean;
  endpoint: string;
}

const AddExpenseModal = ({
  onClose,
  createExpense,
  isLoading,
  endpoint,
}: AddExpenseModalProps) => {
  const [expense, setExpense] = useState<{
    item: string;
    amount: string;
    from: string;
    by: string;
  }>({
    item: "",
    amount: "",
    from: "",
    by: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!expense.item || !expense.amount || !expense.from || !expense.by) {
      alert("Please fill in all required fields.");
      return;
    }

    // Call the createExpense function
    createExpense(
      {
        item: expense.item,
        amount: expense.amount,
        from: expense.from,
        by: expense.by,
      },
      endpoint
    );

    // Reset form and close modal
    setExpense({
      item: "",
      amount: "",
      from: "",
      by: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg p-12 w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Add New Expense</h2>
            <button type="button" onClick={onClose}>
              <X />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Item
              </label>
              <input
                type="text"
                name="item"
                value={expense.item}
                onChange={handleChange}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Purchased from
              </label>
              <input
                type="text"
                name="from"
                value={expense.from}
                onChange={handleChange}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Amount
              </label>
              <input
                type="text"
                name="amount"
                value={expense.amount}
                onChange={handleChange}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Purchased by
              </label>
              <input
                type="text"
                name="by"
                value={expense.by}
                onChange={handleChange}
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
              {isLoading ? "Adding..." : "Add payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
