import React from "react";
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
            departmentId: departmentId,
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
            departmentId: departmentId,
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

    // Check if item exists in selected items (considering both ID and department)
    const existingItemIndex = selectedItems.findIndex(
      (i) => i.id === item.id && i.attributes.departmentId === departmentId
    );

    const amount = item.attributes.amount;
    const name = item.attributes.name;

    if (existingItemIndex === -1) {
      // Item doesn't exist, add it
      setSelectedItems((prev) => [
        ...prev,
        {
          ...item,
          attributes: {
            ...item.attributes,
            amount,
            name,
            isPharmacy: item.attributes.isPharmacy,
            departmentId: departmentId,
          },
          quantity: 1,
          total: amount,
        },
      ]);
      toast.success(`Added ${name} to selection`);
    } else {
      // Item exists, remove it
      setSelectedItems((prev) =>
        prev.filter((_, index) => index !== existingItemIndex)
      );
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
    selectedItems.some(
      (item) => item.id === id && item.attributes.departmentId === departmentId
    );

  // Filter selected items to show only those from current department
  const currentDepartmentItems = selectedItems.filter(
    (item) => item.attributes.departmentId === departmentId
  );

  // Get all selected items grouped by department
  const getItemsByDepartment = () => {
    const grouped: { [key: string]: Item[] } = {};
    selectedItems.forEach((item) => {
      const deptId = item.attributes.departmentId.toString();
      if (!grouped[deptId]) {
        grouped[deptId] = [];
      }
      grouped[deptId].push(item);
    });
    return grouped;
  };

  // Get department name for display
  const getDepartmentName = (deptId: string) => {
    if (deptId === roles["pharmacist"]?.id.toString()) return "Pharmacy";
    if (deptId === roles["laboratory"]?.id.toString()) return "Laboratory";
    if (deptId === roles["finance"]?.id.toString()) return "Others";
    return "Unknown";
  };

  const itemsByDepartment = getItemsByDepartment();

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
          {/* Current Department Item Selection */}
          {departmentId && (
            <div className="mb-8">
              <h3 className="font-semibold mb-3 text-gray-700">
                Select Items from {getDepartmentName(departmentId)}
              </h3>
              <div className="relative mb-4">
                <div
                  className="border border-[#D0D5DD] rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                >
                  <div className="flex-1">
                    {currentDepartmentItems.length === 0 ? (
                      <span className="text-gray-500">Select items...</span>
                    ) : (
                      <span className="text-gray-700">
                        {currentDepartmentItems.length} item(s) selected from
                        this department
                      </span>
                    )}
                  </div>
                  <div
                    className={`transform transition-transform ${
                      isSelectOpen ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {isSelectOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Search items..."
                        value={itemSearch}
                        onChange={(e) => setItemSearch(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {normalizedItems.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No items found for this department
                        </div>
                      ) : (
                        normalizedItems.map((item) => (
                          <div
                            key={`${item.id}-${departmentId}`}
                            className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                              isItemSelected(item.id) ? "bg-blue-50" : ""
                            }`}
                            onClick={() => handleToggleItem(item)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <div
                                    className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                                      isItemSelected(item.id)
                                        ? "bg-primary border-primary"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {isItemSelected(item.id) && (
                                      <Check className="w-3 h-3 text-white" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {item.attributes.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      ₦{formatAmount(item.attributes.amount)}
                                      {item.attributes.isPharmacy &&
                                        item.attributes.availableQuantity !==
                                          undefined && (
                                          <span className="ml-2">
                                            (Stock:{" "}
                                            {item.attributes.availableQuantity})
                                          </span>
                                        )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* All Selected Items Summary */}
          {selectedItems.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4 text-gray-700">
                Selected Items Summary ({selectedItems.length} total)
              </h3>

              {Object.entries(itemsByDepartment).map(([deptId, deptItems]) => (
                <div
                  key={deptId}
                  className="mb-6 border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="font-medium text-gray-800">
                      {getDepartmentName(deptId)} ({deptItems.length} items)
                    </h4>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {deptItems.map((item, index) => {
                      const globalIndex = selectedItems.findIndex(
                        (si) =>
                          si.id === item.id &&
                          si.attributes.departmentId ===
                            item.attributes.departmentId
                      );
                      return (
                        <div
                          key={`${item.id}-${item.attributes.departmentId}`}
                          className="p-4 bg-white"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {item.attributes.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                ₦{formatAmount(item.attributes.amount)} each
                                {item.attributes.isPharmacy &&
                                  item.attributes.availableQuantity !==
                                    undefined && (
                                    <span className="ml-2 text-gray-500">
                                      (Available:{" "}
                                      {item.attributes.availableQuantity})
                                    </span>
                                  )}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(globalIndex, -1)
                                  }
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(globalIndex, 1)}
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                  disabled={
                                    item.attributes.isPharmacy &&
                                    item.attributes.availableQuantity !==
                                      undefined &&
                                    item.quantity >=
                                      item.attributes.availableQuantity
                                  }
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  ₦{formatAmount(item.total)}
                                </p>
                              </div>
                              <button
                                onClick={() => removeItem(globalIndex)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {selectedItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium">No items selected</p>
                <p className="text-sm">
                  Select a department above and choose items to proceed
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ItemSelection;
