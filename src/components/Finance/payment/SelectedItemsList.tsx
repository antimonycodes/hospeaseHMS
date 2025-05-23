import { Minus, Plus, Trash2 } from "lucide-react";
import { formatAmount, parseAmount } from "../../../utils/paymentUtils";
import { PaymentItem } from "../../../utils/PaymentTypes";

interface SelectedItemsListProps {
  selectedItems: PaymentItem[];
  updateQuantity: (index: number, delta: number) => void;
  removeItem: (index: number) => void;
}

export const SelectedItemsList = ({
  selectedItems,
  updateQuantity,
  removeItem,
}: SelectedItemsListProps) => (
  <div className="mb-6">
    <h3 className="font-semibold mb-3 text-gray-700">Selected Items</h3>
    <ul className="bg-white border rounded-lg divide-y">
      {selectedItems.map((item, index) => (
        <li key={index} className="p-4 flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium">{item.attributes.name}</p>
            <p className="text-sm text-gray-500">
              ₦{formatAmount(parseAmount(item.attributes.amount))} per unit
              {item.attributes.isPharmacy &&
                item.attributes.availableQuantity &&
                ` • Available: ${item.attributes.availableQuantity} units`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <button
                onClick={() => updateQuantity(index, -1)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="mx-2 w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(index, 1)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <p className="font-medium text-green-600 w-24 text-right">
              ₦{formatAmount(item.total)}
            </p>
            <button
              onClick={() => removeItem(index)}
              className="p-1 text-red-500 hover:bg-red-50 rounded-full"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
