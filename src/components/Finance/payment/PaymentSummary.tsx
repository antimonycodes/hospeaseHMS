import { Loader2, X } from "lucide-react";
import { Item } from "../../../Shared/AddPaymentModal";

// PaymentSummary Component
const PaymentSummary: React.FC<{
  showSummary: boolean;
  setShowSummary: (show: boolean) => void;
  selectedPatient: any | null;
  selectedItems: Item[];
  totalAmount: number;
  paymentMethod: string;
  paymentType: string;
  partAmount: string;
  setPartAmount: (amount: string) => void;
  isLoading: boolean;
  handleSubmit: () => void;
  hmoDiscount: number;
  firstName: string;
  lastName: string;
  cardId: string;
}> = ({
  showSummary,
  setShowSummary,
  selectedPatient,
  selectedItems,
  totalAmount,
  paymentMethod,
  paymentType,
  partAmount,
  setPartAmount,
  isLoading,
  handleSubmit,
  hmoDiscount,
  firstName,
  lastName,
  cardId,
}) => {
  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    showSummary && (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-white w-full max-w-md p-6 h-[80vh] overflow-y-auto rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Confirm Payment</h3>
            <button
              onClick={() => setShowSummary(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-500 mb-3">Patient</p>
            <p className="font-medium">
              {selectedPatient?.attributes.first_name || firstName}{" "}
              {selectedPatient?.attributes.last_name || lastName}
            </p>
            <p className="text-sm text-gray-500">
              Card ID: {selectedPatient?.attributes.card_id || cardId}
            </p>
          </div>
          <ul className="mb-4 divide-y">
            {selectedItems.map((item, index) => (
              <li key={index} className="flex justify-between py-2">
                <span className="text-gray-700">
                  {item.attributes.name} × {item.quantity}
                </span>
                <span className="font-medium">₦{formatAmount(item.total)}</span>
              </li>
            ))}
          </ul>
          {paymentType === "part" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Part Amount
              </label>
              <input
                type="number"
                name="part_amount"
                value={partAmount}
                onChange={(e) => setPartAmount(e.target.value)}
                placeholder="Enter part amount"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          )}
          <div className="border-t pt-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">
                {paymentMethod === "HMO"
                  ? `Customer Payment (${hmoDiscount}%)`
                  : "Total Amount"}
              </span>
              <span className="text-xl font-bold text-green-600">
                ₦{formatAmount(totalAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
              <span>Payment Method</span>
              <span className="capitalize">{paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
              <span>Payment Type</span>
              <span className="capitalize">{paymentType}</span>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowSummary(false)}
              className="border px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-primary text-white px-6 py-2 rounded-lg flex items-center justify-center min-w-32"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Confirm Payment"
              )}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default PaymentSummary;
