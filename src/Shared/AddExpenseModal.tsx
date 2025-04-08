import { X } from "lucide-react";
import { useState } from "react";
import { CreateExpenseData } from "../store/staff/useFinanceStore";

interface AddExpenseModalProps {
  onClose: () => void;
  createExpense: (
    data: CreateExpenseData,
    endpoint?: string,
    refreshEndpoint?: string
  ) => Promise<boolean | null>;
  isLoading: boolean;
  endpoint: string;
  refreshEndpoint: string;
}

const AddExpenseModal = ({
  onClose,
  createExpense,
  isLoading,
  endpoint,
  refreshEndpoint,
}: AddExpenseModalProps) => {
  const [expense, setExpense] = useState<CreateExpenseData>({
    item: "",
    amount: 0,
    from: "",
    by: "",
    payment_method: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setExpense((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !expense.item ||
      !expense.amount ||
      !expense.from ||
      !expense.by ||
      !expense.payment_method
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const success = await createExpense(
      expense,
      endpoint,
      "/finance/all-expenses"
    );
    if (success) {
      setExpense({
        item: "",
        amount: 0,
        from: "",
        by: "",
        payment_method: "",
      });
      onClose();
    }
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Payment Method
              </label>
              <select
                name="payment_method"
                value={expense.payment_method}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
              >
                <option value="">Select Payment Method</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md text-sm"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
