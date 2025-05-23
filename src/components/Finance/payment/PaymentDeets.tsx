import { Doctor, Item, PaymentSource } from "../../../Shared/AddPaymentModal";

const PaymentDetails: React.FC<{
  activeTab: string;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  paymentType: string;
  setPaymentType: (type: string) => void;
  paymentSourceType: "doctor" | "payment_source" | null;
  setPaymentSourceType: (type: "doctor" | "payment_source" | null) => void;
  paymentSource: string | null;
  setPaymentSource: (source: string | null) => void;
  partAmount: string;
  setPartAmount: (amount: string) => void;
  selectedItems: Item[];
  totalAmount: number;
  rawTotalAmount: number;
  hmoDiscount: number;
  doctors: Doctor[];
  paymentSources: PaymentSource[];
}> = ({
  activeTab,
  paymentMethod,
  setPaymentMethod,
  paymentType,
  setPaymentType,
  paymentSourceType,
  setPaymentSourceType,
  paymentSource,
  setPaymentSource,
  partAmount,
  setPartAmount,
  selectedItems,
  totalAmount,
  rawTotalAmount,
  hmoDiscount,
  doctors,
  paymentSources,
}) => {
  const paymentTypeOptions = [
    { value: "full", label: "Full Payment" },
    { value: "part", label: "Part Payment" },
    { value: "pending", label: "Pending" },
  ];

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    activeTab === "payment" && (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#101928] mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-4 gap-3">
            {["cash", "pos", "transfer", "HMO"].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`flex items-center justify-center border px-4 py-3 rounded-lg ${
                  paymentMethod === method
                    ? "bg-primary border-primary text-white"
                    : "border-[#E4E4E7] text-[#A1A1AA]"
                }`}
              >
                <span className="capitalize">{method}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#101928] mb-2">
            Payment Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {paymentTypeOptions.map((type) => (
              <button
                key={type.value}
                onClick={() => setPaymentType(type.value)}
                type="button"
                className={`border px-4 py-3 rounded-lg ${
                  paymentType === type.value
                    ? "bg-primary border-primary text-white"
                    : "border-[#E4E4E7] text-[#A1A1AA]"
                }`}
              >
                <span className="capitalize">{type.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#101928] mb-2">
            Payment Source (Optional)
          </label>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => {
                setPaymentSourceType("doctor");
                setPaymentSource(null);
              }}
              className={`flex items-center justify-center border px-4 py-3 rounded-lg ${
                paymentSourceType === "doctor"
                  ? "bg-primary border-primary text-white"
                  : "border-[#E4E4E7] text-[#A1A1AA]"
              }`}
            >
              Doctor
            </button>
            <button
              type="button"
              onClick={() => {
                setPaymentSourceType("payment_source");
                setPaymentSource(null);
              }}
              className={`flex items-center justify-center border px-4 py-3 rounded-lg ${
                paymentSourceType === "payment_source"
                  ? "bg-primary border-primary text-white"
                  : "border-[#E4E4E7] text-[#A1A1AA]"
              }`}
            >
              Payment Source
            </button>
          </div>
          {paymentSourceType === "doctor" && (
            <select
              value={paymentSource || ""}
              onChange={(e) => setPaymentSource(e.target.value || null)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 outline-none focus:ring-primary focus:border-primary bg-white"
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option
                  key={doctor.id}
                  value={`${doctor.attributes.first_name} ${doctor.attributes.last_name}`}
                >
                  {doctor.attributes.first_name} {doctor.attributes.last_name}
                </option>
              ))}
            </select>
          )}
          {paymentSourceType === "payment_source" && (
            <select
              value={paymentSource || ""}
              onChange={(e) => setPaymentSource(e.target.value || null)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 outline-none focus:ring-primary focus:border-primary bg-white"
            >
              <option value="">Select Payment Source</option>
              {paymentSources.map((source) => (
                <option key={source.id} value={source.attributes.name}>
                  {source.attributes.name}
                </option>
              ))}
            </select>
          )}
        </div>
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
        {selectedItems.length > 0 && (
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
              <span>Subtotal</span>
              <span className="text-[#101928]">
                ₦{formatAmount(rawTotalAmount)}
              </span>
            </div>
            {paymentMethod === "HMO" && hmoDiscount > 0 && (
              <>
                <div className="flex justify-between text-sm mt-2">
                  <span>Amount Covered by HMO ({100 - hmoDiscount}%)</span>
                  <span className="text-red-500">
                    -₦
                    {formatAmount(rawTotalAmount * ((100 - hmoDiscount) / 100))}
                  </span>
                </div>
                <div className="border-t mt-2 pt-3 flex justify-between font-bold">
                  <span>Customer Payment ({hmoDiscount}%)</span>
                  <span className="text-green-600">
                    ₦{formatAmount(totalAmount)}
                  </span>
                </div>
              </>
            )}
            {paymentMethod !== "HMO" && (
              <div className="border-t mt-2 pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-green-600">
                  ₦{formatAmount(totalAmount)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    )
  );
};
export default PaymentDetails;
