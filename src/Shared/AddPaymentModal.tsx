import { X } from "lucide-react";

interface formDataData {
  id: string;
  patientFirstName: string;
  patientLastName: string;
  amount: string;
  purpose: string;
  paymentMethod: string;
}

interface AddPaymentModalProps {
  // isOpen: boolean;
  onClose: () => void;
  formData: formDataData;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  //   formData,
  // isOpen,
  onClose,
  formData,
}) => {
  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg p-12 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Add New payment</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-custom-black mb-1">
              Payment ID
            </label>
            <input
              type="text"
              name="id"
              //   value={formData.id}
              className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-custom-black mb-1">
              Patient's First Name
            </label>
            <input
              type="text"
              name="patientFirstName"
              //   value={formData.patientFirstName}
              className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-custom-black mb-1">
              Patient's Last Name
            </label>
            <input
              type="text"
              name="patientLastName"
              //   value={formData.patientLastName}
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
              //   value={formData.amount}
              className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
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
              className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-custom-black mb-1">
              Payment Method
            </label>
            <div className="relative">
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm appearance-none"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
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
          <button className="bg-primary text-white px-4 py-2 rounded-md text-sm">
            Add payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentModal;
