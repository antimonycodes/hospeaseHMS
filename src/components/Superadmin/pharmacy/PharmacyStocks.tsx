import React, { JSX, useEffect, useState, useMemo } from "react";
import Table from "../../../Shared/Table";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Loader from "../../../Shared/Loader";
import { useInventoryStore } from "../../Inventory/overview/useInventoryStore";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import { Search } from "lucide-react";
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

  // Filter requests based on search term
  const filteredRequests = useMemo(() => {
    if (!searchTerm.trim()) {
      return requestsArray;
    }

    const searchLower = searchTerm.toLowerCase();

    return requestsArray.filter((request) => {
      try {
        // Search in item name
        const itemName = (
          request.attributes?.item_requested?.inventory?.service_item_name || ""
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
        const requestDepartment = (request.attributes?.request_department || "")
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
  }, [requestsArray, searchTerm]);

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredRequests.map((request) => request.id);
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
    filteredRequests.length > 0 &&
    filteredRequests.every((request) => selectedItems.has(request.id));

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
      const selectedRequests = filteredRequests.filter((request) =>
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
      label: "Item Name",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">
          {request.attributes.item_requested.inventory.service_item_name}
        </span>
      ),
    },
    {
      key: "id" as keyof RequestData,
      label: "Quantity",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">
          {request.attributes.quantity}
        </span>
      ),
    },
    {
      key: "id" as keyof RequestData,
      label: "Selling price",
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
      label: "Recorded By",
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
          className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
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
        {/* Search Input and Bulk Actions */}
        <div className="flex items-center justify-between p-4 ">
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

          {/* Bulk Actions */}
          {selectedItems.size > 0 && (
            <div className="flex items-center gap-3 ml-4">
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
            {filteredRequests.length > 0
              ? `Found ${filteredRequests.length} result${
                  filteredRequests.length === 1 ? "" : "s"
                } for "${searchTerm}"`
              : `No results found for "${searchTerm}"`}
          </div>
        )}

        {isLoading ? (
          <Loader />
        ) : filteredRequests.length === 0 ? (
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
            data={filteredRequests}
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
