import { Loader2, X } from "lucide-react";
import { PaymentItem } from "../../../utils/PaymentTypes";
import { formatAmount } from "../../../utils/paymentUtils";

interface ConfirmationModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  selectedPatient: any;
  selectedItems: PaymentItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentType: string;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

export const ConfirmationModal = ({
  show,
  setShow,
  selectedPatient,
  selectedItems,
  totalAmount,
  paymentMethod,
  paymentType,
  onSubmit,
  isLoading,
}: ConfirmationModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold">Confirm Payment</h3>
          <button onClick={() => setShow(false)}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-gray-600 mb-2">Patient</h4>
            <p className="font-medium">
              {selectedPatient?.attributes.first_name}{" "}
              {selectedPatient?.attributes.last_name}
            </p>
            <p className="text-sm text-gray-500">
              ID: {selectedPatient?.attributes.card_id}
            </p>
          </div>

          <div>
            <h4 className="text-gray-600 mb-2">Payment Details</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm">Method:</p>
                <p className="font-medium capitalize">{paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm">Type:</p>
                <p className="font-medium capitalize">{paymentType}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-gray-600 mb-2">Items</h4>
            <ul className="space-y-2">
              {selectedItems.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>
                    {item.attributes.name} × {item.quantity}
                  </span>
                  <span>₦{formatAmount(item.total)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between font-bold">
              <span>Total Amount:</span>
              <span className="text-primary">₦{formatAmount(totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={() => setShow(false)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-primary text-white rounded-lg flex items-center gap-2"
          >
            {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};
