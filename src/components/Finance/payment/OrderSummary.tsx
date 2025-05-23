import { PaymentItem } from "../../../utils/PaymentTypes";
import { formatAmount } from "../../../utils/paymentUtils";
// import { PaymentItem } from "../../utils/PaymentTypes";

interface OrderSummaryProps {
  selectedItems: PaymentItem[];
  totalAmount: number;
  rawTotalAmount: number;
  paymentMethod: string;
  hmoDiscount: number;
}

export const OrderSummary = ({
  selectedItems,
  totalAmount,
  rawTotalAmount,
  paymentMethod,
  hmoDiscount,
}: OrderSummaryProps) => (
  <div className="bg-gray-50 rounded-lg p-4 mt-6">
    <h4 className="font-medium text-[#101928] mb-3">Order Summary</h4>
    <ul className="space-y-2 mb-3">
      {selectedItems.map((item, index) => (
        <li key={index} className="flex justify-between text-sm">
          <span className="text-[#98A2B3] text-lg">
            {item.attributes.name} × {item.quantity}
          </span>
          <span className="font-medium text-[#101928]">
            ₦{formatAmount(item.total)}
          </span>
        </li>
      ))}
    </ul>
    <div className="border-t pt-3 flex justify-between font-bold">
      <span>Total</span>
      <span className="text-green-600">₦{formatAmount(rawTotalAmount)}</span>
    </div>

    {paymentMethod === "HMO" && hmoDiscount > 0 && (
      <>
        <div className="flex justify-between text-sm mt-2">
          <span>HMO Discount ({hmoDiscount}%)</span>
          <span className="text-red-500">
            -₦{formatAmount(rawTotalAmount * (hmoDiscount / 100))}
          </span>
        </div>
        <div className="border-t mt-2 pt-3 flex justify-between font-bold">
          <span>Final Total</span>
          <span className="text-green-600">₦{formatAmount(totalAmount)}</span>
        </div>
      </>
    )}
  </div>
);
