import React, { JSX, useEffect, useState, useMemo } from "react";
import Table from "../../../Shared/Table";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Loader from "../../../Shared/Loader";
import { useInventoryStore } from "../../Inventory/overview/useInventoryStore";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import { Search, ChevronUp, ChevronDown, Package } from "lucide-react";
import toast from "react-hot-toast";

export type RequestData = {
  id: number;
  type: string;
  attributes: {
    requested_by: {
      id: number;
      first_name: string;
      last_name: string;
    } | null;
    item_requested: {
      inventory: any;
      id: number;
      item: string;
      cost: string;
      quantity: number;
    };
    hospital: {
      id: number;
      name: string;
      logo: string;
    };
    quantity: number;
    recorded_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    request_department: string | null;
    created_at: string;
  };
};

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, record: T) => JSX.Element;
}

type SortField = "itemName" | "quantity" | "price" | "recordedBy" | "createdAt";
type SortOrder = "asc" | "desc";

interface SortConfig {
  field: SortField;
  order: SortOrder;
}

const PharmacyStocks = () => {
  const { getAllRequest, requests, isLoading, requestToInventory } =
    useInventoryStore() as unknown as {
      getAllRequest: (endpoint?: string) => void;
      requests: { data: RequestData[]; pagination: object } | null;
      isLoading: boolean;
      requestToInventory: (data: any) => Promise<boolean>;
    };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const { getAllRoles, roles } = useGlobalStore();

  useEffect(() => {
    getAllRoles();
  }, [getAllRoles]);

  console.log(roles);

  useEffect(() => {
    getAllRequest("/medical-report/department-request-records");
  }, [getAllRequest]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const requestsArray = requests?.data ?? [];

  // Sorting function
  const sortData = (data: RequestData[], config: SortConfig | null) => {
    if (!config) return data;

    return [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (config.field) {
        case "itemName":
          aValue =
            a.attributes.item_requested.inventory.service_item_name?.toLowerCase() ||
            "";
          bValue =
            b.attributes.item_requested.inventory.service_item_name?.toLowerCase() ||
            "";
          break;
        case "quantity":
          aValue = a.attributes.quantity || 0;
          bValue = b.attributes.quantity || 0;
          break;
        case "price":
          aValue = parseFloat(
            a.attributes.item_requested.inventory.service_item_price || "0"
          );
          bValue = parseFloat(
            b.attributes.item_requested.inventory.service_item_price || "0"
          );
          break;
        case "recordedBy":
          aValue =
            `${a.attributes.recorded_by.first_name} ${a.attributes.recorded_by.last_name}`.toLowerCase();
          bValue =
            `${b.attributes.recorded_by.first_name} ${b.attributes.recorded_by.last_name}`.toLowerCase();
          break;
        case "createdAt":
          aValue = new Date(a.attributes.created_at).getTime();
          bValue = new Date(b.attributes.created_at).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return config.order === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return config.order === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  // Filter and sort requests
  const filteredAndSortedRequests = useMemo(() => {
    let filtered = requestsArray;

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();

      filtered = requestsArray.filter((request) => {
        try {
          // Search in item name
          const itemName = (
            request.attributes?.item_requested?.inventory?.service_item_name ||
            ""
          )
            .toString()
            .toLowerCase();

          // Search in item cost/item string
          const itemCost = (request.attributes?.item_requested?.item || "")
            .toString()
            .toLowerCase();

          // Search in quantity
          const quantity = (request.attributes?.quantity || "").toString();

          // Search in selling price
          const sellingPrice = (
            request.attributes?.item_requested?.inventory?.service_item_price ||
            ""
          )
            .toString()
            .toLowerCase();

          // Search in recorded by name
          const recordedByName = request.attributes?.recorded_by
            ? `${request.attributes.recorded_by.first_name || ""} ${
                request.attributes.recorded_by.last_name || ""
              }`.toLowerCase()
            : "";

          // Search in requested by name (if available)
          const requestedByName = request.attributes?.requested_by
            ? `${request.attributes.requested_by.first_name || ""} ${
                request.attributes.requested_by.last_name || ""
              }`.toLowerCase()
            : "";

          // Search in request department
          const requestDepartment = (
            request.attributes?.request_department || ""
          )
            .toString()
            .toLowerCase();

          // Search in type
          const type = (request.type || "").toString().toLowerCase();

          return (
            itemName.includes(searchLower) ||
            itemCost.includes(searchLower) ||
            quantity.includes(searchLower) ||
            sellingPrice.includes(searchLower) ||
            recordedByName.includes(searchLower) ||
            requestedByName.includes(searchLower) ||
            requestDepartment.includes(searchLower) ||
            type.includes(searchLower)
          );
        } catch (error) {
          console.error("Error filtering request:", error, request);
          return false;
        }
      });
    }

    // Apply sorting
    return sortData(filtered, sortConfig);
  }, [requestsArray, searchTerm, sortConfig]);

  // Handle sorting
  const handleSort = (field: SortField) => {
    setSortConfig((prevConfig) => {
      if (prevConfig && prevConfig.field === field) {
        // Toggle order if same field
        return {
          field,
          order: prevConfig.order === "asc" ? "desc" : "asc",
        };
      } else {
        // Set new field with ascending order
        return {
          field,
          order: "asc",
        };
      }
    });
  };

  // Clear sorting
  const clearSort = () => {
    setSortConfig(null);
  };

  // Sort icon component
  const SortIcon = ({ field }: { field: SortField }) => {
    if (!sortConfig || sortConfig.field !== field) {
      return (
        <div className="w-4 h-4 flex flex-col">
          <ChevronUp className="w-3 h-3 text-gray-300" />
          <ChevronDown className="w-3 h-3 text-gray-300 -mt-1" />
        </div>
      );
    }

    return sortConfig.order === "asc" ? (
      <ChevronUp className="w-4 h-4 text-primary" />
    ) : (
      <ChevronDown className="w-4 h-4 text-primary" />
    );
  };

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredAndSortedRequests.map((request) => request.id);
      setSelectedItems(new Set(allIds));
    } else {
      setSelectedItems(new Set());
    }
  };

  // Handle individual item selection
  const handleItemSelect = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
  };

  // Check if all items are selected
  const isAllSelected =
    filteredAndSortedRequests.length > 0 &&
    filteredAndSortedRequests.every((request) => selectedItems.has(request.id));

  // Check if some items are selected (for indeterminate state)
  const isSomeSelected = selectedItems.size > 0 && !isAllSelected;

  // Function to handle single request
  const handleRequestMore = async (request: RequestData) => {
    try {
      // Get department IDs from roles
      const pharmacyId = roles?.pharmacist?.id;
      const inventoryId = roles?.["inventory-manager"]?.id;

      if (!pharmacyId || !inventoryId) {
        alert("Unable to find required department IDs");
        return;
      }

      const payload = {
        item: request.attributes.item_requested.inventory.service_item_name,
        note: `need more of clicked ${request.attributes.item_requested.inventory.service_item_name}`,
        inventory_id: request.attributes.item_requested.inventory.id,
        to_department_id: inventoryId, // inventory department
        from_department_id: pharmacyId, // pharmacy department
      };

      const success = await requestToInventory(payload);

      if (success) {
        // Optionally refresh the data after successful request
        getAllRequest("/medical-report/department-request-records");
      }
    } catch (error) {
      console.error("Error requesting more items:", error);
      alert("Failed to send request. Please try again.");
    }
  };

  // Function to handle bulk requests
  const handleBulkRequest = async () => {
    if (selectedItems.size === 0) {
      alert("Please select items to request");
      return;
    }

    setIsProcessing(true);

    try {
      // Get department IDs from roles
      const pharmacyId = roles?.pharmacist?.id;
      const inventoryId = roles?.["inventory-manager"]?.id;

      if (!pharmacyId || !inventoryId) {
        alert("Unable to find required department IDs");
        return;
      }

      // Get selected requests
      const selectedRequests = filteredAndSortedRequests.filter((request) =>
        selectedItems.has(request.id)
      );

      // Process requests one by one
      let successCount = 0;
      let errorCount = 0;

      for (const request of selectedRequests) {
        try {
          const payload = {
            item: request.attributes.item_requested.inventory.service_item_name,
            note: `need more of ${request.attributes.item_requested.inventory.service_item_name}`,
            inventory_id: request.attributes.item_requested.inventory.id,
            to_department_id: inventoryId, // inventory department
            from_department_id: pharmacyId, // pharmacy department
          };

          const success = await requestToInventory(payload);

          if (success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error("Error processing request:", error);
          errorCount++;
        }
      }

      // Show results
      if (successCount > 0) {
        toast.success(
          `Successfully processed ${successCount} request${
            successCount === 1 ? "" : "s"
          }${errorCount > 0 ? ` (${errorCount} failed)` : ""}`
        );

        // Clear selections and refresh data
        setSelectedItems(new Set());
        getAllRequest("/medical-report/department-request-records");
      } else {
        toast.error("Failed to process any requests. Please try again.");
      }
    } catch (error) {
      console.error("Error processing bulk requests:", error);
      toast.error("Failed to process bulk requests. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Clear selections when search changes
    setSelectedItems(new Set());
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedItems(new Set());
  };

  // Helper function to get quantity display with appropriate styling
  const getQuantityDisplay = (quantity: string | number) => {
    const qty = typeof quantity === "string" ? parseInt(quantity) : quantity;
    const isLowStock = qty < 10;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          isLowStock
            ? "bg-[#FBE1E1] text-[#F83E41] border border-red-200"
            : "bg-[#CCFFE7] text-[#009952] border border-primary"
        }`}
      >
        <Package className="w-3 h-3" />
        {qty}
      </span>
    );
  };
  const columns = [
    {
      key: "select" as keyof RequestData,
      label: (
        <input
          type="checkbox"
          checked={isAllSelected}
          ref={(input) => {
            if (input) input.indeterminate = isSomeSelected;
          }}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
        />
      ),
      render: (_, request) => (
        <input
          type="checkbox"
          checked={selectedItems.has(request.id)}
          onChange={(e) => handleItemSelect(request.id, e.target.checked)}
          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
        />
      ),
    },
    {
      key: "id" as keyof RequestData,
      label: (
        <button
          onClick={() => handleSort("itemName")}
          className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
        >
          Item Name
          <SortIcon field="itemName" />
        </button>
      ),
      render: (_, request) => (
        <span className="text-[#667085] text-sm">
          {request.attributes.item_requested.inventory.service_item_name}
        </span>
      ),
    },
    {
      key: "id" as keyof RequestData,
      label: (
        <button
          onClick={() => handleSort("quantity")}
          className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
        >
          Quantity
          <SortIcon field="quantity" />
        </button>
      ),
      render: (_, request) => (
        <span className="text-[#667085] text-sm">
          {getQuantityDisplay(request.attributes.quantity)}
        </span>
      ),
    },
    {
      key: "id" as keyof RequestData,
      label: (
        <button
          onClick={() => handleSort("price")}
          className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
        >
          Selling price
          <SortIcon field="price" />
        </button>
      ),
      render: (_, request) => (
        <span className="text-[#667085] text-sm">
          {parseFloat(
            request.attributes.item_requested.inventory.service_item_price
          ).toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
            currencyDisplay: "symbol",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </span>
      ),
    },
    {
      key: "id" as keyof RequestData,
      label: (
        <button
          onClick={() => handleSort("recordedBy")}
          className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
        >
          Recorded By
          <SortIcon field="recordedBy" />
        </button>
      ),
      render: (_, request) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">
            {request.attributes.recorded_by.first_name}{" "}
            {request.attributes.recorded_by.last_name || ""}
          </span>
        </div>
      ),
    },
    {
      key: "request_more" as keyof RequestData,
      label: "",
      render: (_, request) => (
        <button
          className={`px-3 py-1 ${
            request.attributes.quantity >= 10 ? "bg-primary" : "bg-red-600"
          } text-white rounded disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={() => handleRequestMore(request)}
          disabled={isLoading || isProcessing}
        >
          {isLoading ? "Requesting..." : "Request"}
        </button>
      ),
    },
  ] as Column<RequestData>[];

  return (
    <div>
      <Tablehead
        tableTitle="Pharmacy Stocks"
        showButton={false}
        onButtonClick={openModal}
      />
      <div className="w-full bg-white rounded-b-[8px] shadow-table">
        {/* Search Input, Sort Controls, and Bulk Actions */}
        <div className="flex items-center justify-between p-4 gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by item name, price, quantity, recorded by..."
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-4 h-4 flex items-center justify-center"
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* Sort Controls */}
            {sortConfig && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Sorted by: {sortConfig.field} ({sortConfig.order})
                </span>
                <button
                  onClick={clearSort}
                  className="text-xs text-red-500 hover:text-red-700 underline"
                >
                  Clear sort
                </button>
              </div>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedItems.size > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {selectedItems.size} selected
              </span>
              <button
                onClick={handleBulkRequest}
                disabled={isProcessing}
                className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                {isProcessing
                  ? "Processing..."
                  : `Request Selected (${selectedItems.size})`}
              </button>
              <button
                onClick={() => setSelectedItems(new Set())}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="px-4 py-2 bg-gray-50 border-b text-sm text-gray-600">
            {filteredAndSortedRequests.length > 0
              ? `Found ${filteredAndSortedRequests.length} result${
                  filteredAndSortedRequests.length === 1 ? "" : "s"
                } for "${searchTerm}"`
              : `No results found for "${searchTerm}"`}
          </div>
        )}

        {isLoading ? (
          <Loader />
        ) : filteredAndSortedRequests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? (
              <div>
                <p className="mb-2">
                  No pharmacy stocks found matching your search.
                </p>
                <button
                  onClick={clearSearch}
                  className="text-primary hover:text-primary/80 underline"
                >
                  Clear search to view all stocks
                </button>
              </div>
            ) : (
              <p>No requests available</p>
            )}
          </div>
        ) : (
          <Table
            data={filteredAndSortedRequests}
            columns={columns}
            rowKey="id"
            loading={isLoading}
            radius="rounded-none"
          />
        )}
      </div>
    </div>
  );
};

export default PharmacyStocks;
