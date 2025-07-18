import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Select from "react-select";
import toast from "react-hot-toast";
import { useInventoryStore } from "../../Inventory/overview/useInventoryStore";
import Button from "../../../Shared/Button";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";

interface AddRequestModalProps {
  onClose: () => void;
  endpoint?: string;
  refreshEndpoint?: string;
  fetchEndpoint: string;
  stockEndpoint: string;
}

interface BulkItem {
  id: string;
  name: string;
  selected: boolean;
  quantity: string;
}

const AddRequestModal: React.FC<AddRequestModalProps> = ({
  onClose,
  endpoint,
  refreshEndpoint,
  fetchEndpoint,
  stockEndpoint,
}) => {
  const { createRequest, getAllStocks, stocks, isLoading } =
    useInventoryStore();
  const { allStaffs, getAllStaffs } = useGlobalStore();
  const { getAllRoles, roles } = useGlobalStore();

  const [formData, setFormData] = useState({
    requested_by: "",
    requested_department_id: "",
    first_name: "",
    last_name: "",
    item_name: "",
    quantity: "",
  });

  const [requestedType, setRequestedType] = useState<"staff" | "department">(
    "department"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedStock, setSelectedStock] = useState<any>(null);

  // Bulk dispense state
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkDepartment, setBulkDepartment] = useState<any>(null);
  const [bulkItems, setBulkItems] = useState<BulkItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Custom styles for React Select
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      padding: "0.5rem",
      borderColor: "#D0D5DD",
      borderRadius: "0.375rem",
    }),
  };

  useEffect(() => {
    getAllRoles();
    getAllStocks(stockEndpoint);
    getAllStaffs();
  }, [getAllRoles, getAllStocks, getAllStaffs, stockEndpoint, fetchEndpoint]);

  // Initialize bulk items when stocks are loaded
  useEffect(() => {
    if (stocks.length > 0) {
      setBulkItems(
        stocks.map((stock) => ({
          id: stock.id,
          name: stock.attributes.service_item_name,
          selected: false,
          quantity: "",
        }))
      );
    }
  }, [stocks]);

  console.log(allStaffs, "allStaffs");

  const handleDepartmentSelect = (option: any) => {
    if (!option) {
      setFormData((prev) => ({
        ...prev,
        requested_department_id: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      requested_department_id: option.value,
      requested_by: "",
      first_name: "",
      last_name: "",
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequestTypeChange = (type: "staff" | "department") => {
    setRequestedType(type);
    setFormData((prev) => ({
      ...prev,
      requested_by: "",
      requested_department_id: "",
      first_name: "",
      last_name: "",
    }));
    setSelectedStaff(null);
  };

  const handleBulkModeToggle = () => {
    setIsBulkMode(!isBulkMode);
    // Reset form when switching modes
    setFormData({
      requested_by: "",
      requested_department_id: "",
      first_name: "",
      last_name: "",
      item_name: "",
      quantity: "",
    });
    setBulkDepartment(null);
    setSelectedStaff(null);
    setSelectedStock(null);
    setSearchTerm("");
  };

  const handleBulkDepartmentSelect = (option: any) => {
    setBulkDepartment(option);
  };

  const handleBulkItemToggle = (itemId: string) => {
    setBulkItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleBulkQuantityChange = (itemId: string, quantity: string) => {
    setBulkItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const handleSubmit = async () => {
    if (
      !formData.item_name ||
      !formData.quantity ||
      (requestedType === "staff" && !formData.requested_by) ||
      (requestedType === "department" && !formData.requested_department_id)
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        requested_by: requestedType === "staff" ? formData.requested_by : null,
        requested_department_id:
          requestedType === "department"
            ? formData.requested_department_id
            : null,
        inventory_id: formData.item_name,
        quantity: parseInt(formData.quantity),
        status: "approved",
      };

      const success = await createRequest(payload, endpoint, refreshEndpoint);
      if (success) onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDispense = async () => {
    if (!bulkDepartment) {
      toast.error("Please select a department");
      return;
    }

    const selectedItems = bulkItems.filter(
      (item) => item.selected && item.quantity
    );

    if (selectedItems.length === 0) {
      toast.error("Please select at least one item with quantity");
      return;
    }

    // Validate quantities
    const invalidItems = selectedItems.filter(
      (item) => !item.quantity || parseInt(item.quantity) <= 0
    );
    if (invalidItems.length > 0) {
      toast.error("Please enter valid quantities for all selected items");
      return;
    }

    setIsSubmitting(true);
    try {
      const requests = selectedItems.map((item) => ({
        requested_by: null,
        requested_department_id: bulkDepartment.value,
        inventory_id: item.id,
        quantity: parseInt(item.quantity),
        status: "approved",
      }));

      // Process requests one by one
      let successCount = 0;
      const failedItems: string[] = [];

      for (const request of requests) {
        try {
          const success = await createRequest(
            request,
            endpoint,
            refreshEndpoint
          );
          if (success) {
            successCount++;
          } else {
            const itemName =
              selectedItems.find((item) => item.id === request.inventory_id)
                ?.name || "Unknown item";
            failedItems.push(itemName);
          }
        } catch (error) {
          console.error("Failed to create request:", error);
          const itemName =
            selectedItems.find((item) => item.id === request.inventory_id)
              ?.name || "Unknown item";
          failedItems.push(itemName);
        }
      }

      if (successCount === requests.length) {
        toast.success(`Successfully dispensed ${successCount} items`);
        onClose();
      } else if (successCount > 0) {
        const failedMessage =
          failedItems.length > 0
            ? `Failed items: ${failedItems.join(", ")}`
            : "";
        toast.success(
          `Successfully dispensed ${successCount} out of ${requests.length} items`
        );
        if (failedItems.length > 0) {
          toast.error(`Failed to dispense: ${failedItems.join(", ")}`);
        }
        onClose();
      } else {
        const failedMessage =
          failedItems.length > 0
            ? `Failed items: ${failedItems.join(", ")}`
            : "Failed to dispense items";
        toast.error(failedMessage);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to dispense items");
    } finally {
      setIsSubmitting(false);
    }
  };

  const departmentOptions = Object.values(roles).map((dept) => ({
    value: dept.id,
    label: dept.role,
  }));

  const selectedBulkItemsCount = bulkItems.filter(
    (item) => item?.selected
  ).length;

  // Filter bulk items based on search term
  const filteredBulkItems = bulkItems.filter((item) =>
    item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create stock options with quantity display for single request
  const stockOptions = stocks.map((stock) => {
    const availableQty = stock.attributes?.quantity || "0";

    return {
      label: `${stock.attributes.service_item_name} (${availableQty} available)`,
      value: stock.id,
      isDisabled: parseInt(availableQty) === 0,
    };
  });

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-y-auto p-12 h-[90%] w-full max-w-[980px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {isBulkMode ? "Bulk Dispense" : "Add New Request"}
          </h2>
          <button onClick={onClose} className="text-gray-700 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-md border ${
                !isBulkMode
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
              onClick={() => !isBulkMode || handleBulkModeToggle()}
            >
              Single Request
            </button>
            <button
              className={`px-4 py-2 rounded-md border ${
                isBulkMode
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
              onClick={() => isBulkMode || handleBulkModeToggle()}
            >
              Bulk Dispense
            </button>
          </div>
        </div>

        {isBulkMode ? (
          // Bulk Dispense Mode
          <>
            {/* Department Selection for Bulk */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-custom-black mb-1">
                Select Department
              </label>
              <Select
                styles={customStyles}
                classNamePrefix="react-select"
                placeholder="Select a department"
                isClearable
                options={departmentOptions}
                value={bulkDepartment}
                onChange={handleBulkDepartmentSelect}
                noOptionsMessage={() => "No departments found"}
              />
            </div>

            {/* Search Input for Bulk Items */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-custom-black mb-1">
                Search Items
              </label>
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-[#D0D5DD] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Items List */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-custom-black mb-3">
                Select Items to Dispense ({selectedBulkItemsCount} selected)
              </label>
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
                {filteredBulkItems.map((item) => {
                  const stockItem = stocks.find(
                    (stock) => stock.id === item.id
                  );
                  const availableQty = stockItem?.attributes?.quantity || "0";

                  return (
                    <div
                      key={item.id}
                      className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        id={`item-${item.id}`}
                        checked={item.selected}
                        onChange={() => handleBulkItemToggle(item.id)}
                        disabled={parseInt(availableQty) === 0}
                        className="mr-3 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary disabled:opacity-50"
                      />
                      <label
                        htmlFor={`item-${item.id}`}
                        className="flex-1 text-sm font-medium cursor-pointer text-gray-700"
                      >
                        <span>{item.name}</span>
                        <span
                          className={`ml-2 text-xs ${
                            parseInt(availableQty) === 0
                              ? "text-red-500"
                              : parseInt(availableQty) < 10
                              ? "text-orange-500"
                              : "text-gray-500"
                          }`}
                        >
                          ({availableQty} available)
                        </span>
                      </label>
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) =>
                          handleBulkQuantityChange(item.id, e.target.value)
                        }
                        disabled={
                          !item.selected || parseInt(availableQty) === 0
                        }
                        max={availableQty}
                        className="w-20 ml-3 p-2 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                        min="1"
                      />
                    </div>
                  );
                })}
                {filteredBulkItems.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    {searchTerm
                      ? "No items found matching your search"
                      : "No items available"}
                  </div>
                )}
              </div>
            </div>

            {/* Bulk Submit */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleBulkDispense}
                disabled={
                  isSubmitting ||
                  !bulkDepartment ||
                  selectedBulkItemsCount === 0
                }
                variant="primary"
              >
                {isSubmitting
                  ? "Dispensing..."
                  : `Dispense All (${selectedBulkItemsCount})`}
              </Button>
            </div>
          </>
        ) : (
          // Single Request Mode (Original Logic)
          <>
            {/* Request Type Toggle */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-custom-black mb-2">
                Request Type
              </label>
              <div className="flex space-x-4">
                <div
                  className={`hidden px-4 py-2 rounded-md cursor-pointer border ${
                    requestedType === "staff"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                  onClick={() => handleRequestTypeChange("staff")}
                >
                  Staff
                </div>
                <div
                  className={`px-4 py-2 rounded-md cursor-pointer border ${
                    requestedType === "department"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                  onClick={() => handleRequestTypeChange("department")}
                >
                  Department
                </div>
              </div>
            </div>

            {/* Staff or Department */}
            {requestedType === "staff" ? (
              <div className="mb-6">
                <label className="block text-sm font-medium text-custom-black mb-1">
                  Select Staff
                </label>
                <Select
                  styles={customStyles}
                  options={allStaffs.map((person) => ({
                    label: `${person.attributes.first_name} ${person.attributes.last_name}`,
                    value: person.id,
                  }))}
                  isDisabled={isLoading}
                  onChange={(selected) => {
                    const selectedPerson = allStaffs.find(
                      (person) => person.id === selected?.value
                    );
                    if (selectedPerson) {
                      setSelectedStaff(selectedPerson);
                      setFormData((prev) => ({
                        ...prev,
                        requested_by: selectedPerson.id,
                        requested_department_id: "",
                        first_name: selectedPerson.attributes.first_name || "",
                        last_name: selectedPerson.attributes.last_name || "",
                      }));
                    } else {
                      setSelectedStaff(null);
                      setFormData((prev) => ({
                        ...prev,
                        requested_by: "",
                        first_name: "",
                        last_name: "",
                      }));
                    }
                  }}
                />
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-sm font-medium text-custom-black mb-1">
                  Select Department
                </label>
                <Select
                  styles={customStyles}
                  classNamePrefix="react-select"
                  placeholder="Select a department"
                  isClearable
                  options={departmentOptions}
                  onChange={handleDepartmentSelect}
                  noOptionsMessage={() => "No departments found"}
                />
              </div>
            )}

            {/* Staff Info */}
            {requestedType === "staff" && selectedStaff && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-custom-black mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    disabled
                    className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-custom-black mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    disabled
                    className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm bg-gray-100"
                  />
                </div>
              </div>
            )}

            {/* Item and Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-custom-black mb-1">
                  Item Name
                </label>
                <Select
                  styles={customStyles}
                  options={stockOptions}
                  isDisabled={isLoading}
                  onChange={(selected) => {
                    const selectedItem = stocks.find(
                      (stock) => stock.id === selected?.value
                    );
                    if (selectedItem) {
                      setSelectedStock(selectedItem);
                      setFormData((prev) => ({
                        ...prev,
                        item_name: selectedItem.id.toString(),
                      }));
                    } else {
                      setSelectedStock(null);
                      setFormData((prev) => ({
                        ...prev,
                        item_name: "",
                      }));
                    }
                  }}
                  placeholder="Select an item"
                  noOptionsMessage={() => "No items available"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-custom-black mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  max={selectedStock?.attributes?.quantity || ""}
                  className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
                  min="1"
                />
              </div>
            </div>

            {/* Single Submit */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                variant="primary"
              >
                {isSubmitting ? "Adding..." : "Add Request"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddRequestModal;
