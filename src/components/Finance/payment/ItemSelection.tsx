import toast from "react-hot-toast";
import {
  Item,
  PharmacyStock,
  RolesState,
  ServiceItem,
} from "../../../Shared/AddPaymentModal";
import { Check, Minus, Plus, Trash2 } from "lucide-react";

const ItemSelection: React.FC<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedItems: Item[];
  setSelectedItems: React.Dispatch<React.SetStateAction<Item[]>>;
  isSelectOpen: boolean;
  setIsSelectOpen: (open: boolean) => void;
  itemSearch: string;
  setItemSearch: (value: string) => void;
  departmentId: string;
  items: ServiceItem[];
  pharmacyStocks: PharmacyStock[];
  roles: RolesState;
}> = ({
  activeTab,
  setActiveTab,
  selectedItems,
  setSelectedItems,
  isSelectOpen,
  setIsSelectOpen,
  itemSearch,
  setItemSearch,
  departmentId,
  items,
  pharmacyStocks,
  roles,
}) => {
  const isPharmacySelected =
    departmentId === roles["pharmacist"]?.id.toString();
  const isLaboratorySelected =
    departmentId === roles["laboratory"]?.id.toString();
  const isFinanceSelected = departmentId === roles["finance"]?.id.toString();

  // Debug: Log to verify data and department selection
  console.log(
    "isPharmacySelected:",
    isPharmacySelected,
    "isLaboratorySelected:",
    isLaboratorySelected,
    "isFinanceSelected:",
    isFinanceSelected,
    "departmentId:",
    departmentId
  );
  console.log("items:", items);
  console.log("pharmacyStocks:", pharmacyStocks);

  const parseAmount = (
    amountStr: string | number | null | undefined
  ): number => {
    if (amountStr == null) return 0;
    if (typeof amountStr === "number") return amountStr;
    if (typeof amountStr === "string") {
      return parseFloat(amountStr.replace(/,/g, "")) || 0;
    }
    return 0;
  };

  const filteredItems = isPharmacySelected
    ? pharmacyStocks.filter((item) =>
        item.service_item_name?.toLowerCase().includes(itemSearch.toLowerCase())
      )
    : items.filter(
        (item) =>
          item.attributes.name
            ?.toLowerCase()
            .includes(itemSearch.toLowerCase()) &&
          item.attributes.department.id.toString() === departmentId
      );

  const normalizedItems: Item[] = filteredItems.map((item) =>
    isPharmacySelected
      ? {
          id: (item as PharmacyStock).request_pharmacy_id,
          attributes: {
            amount: parseAmount((item as PharmacyStock).service_item_price),
            name: (item as PharmacyStock).service_item_name,
            isPharmacy: true,
            availableQuantity: parseInt(
              String((item as PharmacyStock).requested_quantity)
            ),
          },
          quantity: 1,
          total: parseAmount((item as PharmacyStock).service_item_price),
        }
      : {
          id: (item as ServiceItem).id,
          attributes: {
            amount: parseAmount((item as ServiceItem).attributes.amount),
            name: (item as ServiceItem).attributes.name,
            isPharmacy: false,
            availableQuantity: undefined,
          },
          quantity: 1,
          total: parseAmount((item as ServiceItem).attributes.amount),
        }
  );

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleToggleItem = (item: Item) => {
    const availableQuantity = item.attributes.availableQuantity || 0;
    if (item.attributes.isPharmacy && availableQuantity <= 0) {
      toast.error("Cannot select item: No stock available");
      return;
    }

    const exists = selectedItems.find((i) => i.id === item.id);
    const amount = item.attributes.amount;
    const name = item.attributes.name;

    if (!exists) {
      setSelectedItems((prev) => [
        ...prev,
        {
          ...item,
          attributes: {
            ...item.attributes,
            amount,
            name,
            isPharmacy: item.attributes.isPharmacy,
          },
          quantity: 1,
          total: amount,
        },
      ]);
      toast.success(`Added ${name} to selection`);
    } else {
      setSelectedItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success(`Removed ${name} from selection`);
    }
  };

  const updateQuantity = (index: number, delta: number) => {
    setSelectedItems((prev) => {
      const updated = [...prev];
      const item = updated[index];
      const newQuantity = Math.max(1, item.quantity + delta);

      if (item.attributes.isPharmacy && delta > 0) {
        const availableQuantity = item.attributes.availableQuantity || 0;
        if (newQuantity > availableQuantity) {
          toast.error(
            `Cannot add more than available stock (${availableQuantity} units)`
          );
          return prev;
        }
      }

      item.quantity = newQuantity;
      item.total = item.attributes.amount * item.quantity;
      return updated;
    });
  };

  const removeItem = (index: number) => {
    const itemName = selectedItems[index].attributes.name;
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
    toast.success(`Removed ${itemName} from selection`);
  };

  const isItemSelected = (id: string | number) =>
    selectedItems.some((item) => item.id === id);

  return (
    <>
      <div className="mb-6">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab("items")}
            className={`py-3 border-b-2 font-medium ${
              activeTab === "items"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Select Items
          </button>
          <button
            onClick={() => setActiveTab("payment")}
            className={`py-3 border-b-2 font-medium ${
              activeTab === "payment"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Payment Details
          </button>
        </div>
      </div>
      {activeTab === "items" && (
        <>
          <div className="mb-8">
            <h3 className="font-semibold mb-3 text-gray-700">
              Select Items (Multiple)
            </h3>
            <div className="relative mb-4">
              <div
                className="border border-[#D0D5DD] rounded-lg p-3 flex items-center justify-between cursor-pointer"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
              >
                <div className="flex-1">
                  {selectedItems.length === 0 ? (
                    <span className="text-gray-500">Select items...</span>
                  ) : (
                    <span>{selectedItems.length} item(s) selected</span>
                  )}
                </div>
                <div
                  className={`transform transition-transform ${
                    isSelectOpen ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L6 6L11 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              {isSelectOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[#D0D5DD] rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  <div className="p-2 sticky top-0 bg-white border-b border-[#D0D5DD]">
                    <input
                      type="search"
                      name="itemSearch"
                      value={itemSearch}
                      onChange={(e) => setItemSearch(e.target.value)}
                      placeholder="Search items..."
                      className="w-full border border-[#D0D5DD] p-2 rounded outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <ul className="divide-y">
                    {normalizedItems.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleToggleItem(item)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{item.attributes.name}</p>
                          <p className="text-sm text-gray-500 flex items-center space-x-2">
                            <span>₦{formatAmount(item.attributes.amount)}</span>
                          </p>
                          {item.attributes.isPharmacy && (
                            <span className="text-gray-600 text-xs font-medium">
                              {item.attributes.availableQuantity !== undefined
                                ? `${item.attributes.availableQuantity} unit${
                                    item.attributes.availableQuantity === 1
                                      ? ""
                                      : "s"
                                  } available`
                                : "0 units available"}
                            </span>
                          )}
                        </div>
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center ${
                            isItemSelected(item.id)
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isItemSelected(item.id) && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {selectedItems.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700">
                Selected Items
              </h3>
              <ul className="bg-white border rounded-lg divide-y">
                {selectedItems.map((item, index) => (
                  <li
                    key={index}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.attributes.name}</p>
                      <p className="text-sm text-gray-500 flex items-center space-x-2">
                        <span>
                          ₦{formatAmount(item.attributes.amount)} per unit
                        </span>
                        {item.attributes.isPharmacy &&
                          item.attributes.availableQuantity !== undefined && (
                            <span className="text-gray-600 font-medium">
                              {" • "}
                              {`${item.attributes.availableQuantity} unit${
                                item.attributes.availableQuantity === 1
                                  ? ""
                                  : "s"
                              } available`}
                            </span>
                          )}
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
                        <span className="mx-2 w-6 text-center">
                          {item.quantity}
                        </span>
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
          )}
        </>
      )}
    </>
  );
};
export default ItemSelection;
