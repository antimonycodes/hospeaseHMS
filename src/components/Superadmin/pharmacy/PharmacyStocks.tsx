import React, { JSX, useEffect, useState } from "react";
import Table from "../../../Shared/Table";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Loader from "../../../Shared/Loader";
import { useInventoryStore } from "../../Inventory/overview/useInventoryStore";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";

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

  // Function to handle request more action
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

  const columns = [
    // {
    //   key: "id" as keyof RequestData,
    //   label: "Requested By",
    //   render: (_, request) => {
    //     // Handle both staff requests and department requests
    //     if (request.attributes.requested_by) {
    //       // Staff request format
    //       return (
    //         <div className="flex items-center gap-2">
    //           <h1 className="text-custom-black font-medium">
    //             {request.attributes.requested_by.first_name}{" "}
    //             {request.attributes.requested_by.last_name}
    //           </h1>
    //         </div>
    //       );
    //     } else if (request.attributes.request_department) {
    //       // Department request format
    //       return (
    //         <div className="flex items-center gap-2">
    //           <h1 className="text-custom-black font-medium">
    //             {request.attributes.request_department}
    //           </h1>
    //         </div>
    //       );
    //     } else {
    //       return <span className="text-gray-400">Not specified</span>;
    //     }
    //   },
    // },
    // {
    //   key: "type" as keyof RequestData,
    //   label: "Category",
    //   render: (_, request) => (
    //     <span className="text-[#667085] text-sm">{request.type || "N/A"}</span>
    //   ),
    // },
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
    // {
    //   key: "id" as keyof RequestData,
    //   label: "In Stock",
    //   render: (_, request) => (
    //     <span className="text-[#667085] text-sm">
    //       {request.attributes.item_requested.quantity}
    //     </span>
    //   ),
    // },
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
    // {
    //   key: "id" as keyof RequestData,
    //   label: "Date",
    //   render: (_, request) => (
    //     <span className="text-[#667085] text-sm">
    //       {request.attributes.created_at}
    //     </span>
    //   ),
    // },
    {
      key: "request_more" as keyof RequestData,
      label: "",
      render: (_, request) => (
        <button
          className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleRequestMore(request)}
          disabled={isLoading}
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
        {isLoading ? (
          <Loader />
        ) : requestsArray.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No requests available</p>
        ) : (
          <Table
            data={requestsArray}
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
