import React, { JSX, useEffect, useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Table from "../../../Shared/Table";
import AddRequestModal from "./AddRequestModal";
import { useInventoryStore } from "../../../store/staff/useInventoryStore";

export type RequestData = {
  id: number;
  type: string;
  attributes: {
    request_department: any;
    requested_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    item_requested: {
      id: number;
      inventory: {
        id: 10;
        service_item_name: string;
        service_item_price: string;
      };
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
    status: string;
    created_at: string;
  };
};

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, record: T) => JSX.Element;
}

const InventoryRequest = () => {
  const { getAllRequest, requests, isLoading } =
    useInventoryStore() as unknown as {
      getAllRequest: () => void;
      requests: { data: RequestData[]; pagination: object } | null;
      isLoading: boolean;
    };
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getAllRequest();
  }, [getAllRequest]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const requestsArray =
    requests && requests.data && Array.isArray(requests.data)
      ? requests.data
      : [];

  console.log("requestsArray length:", requestsArray.length);
  console.log("First item in requestsArray:", requestsArray[0]);

  const columns = [
    {
      key: "id" as keyof RequestData,
      label: "Requested By",
      render: (_, request) => {
        // Handle both staff requests and department requests
        if (request.attributes.requested_by) {
          // Staff request format
          return (
            <div className="flex items-center gap-2">
              <h1 className="text-custom-black font-medium">
                {request.attributes.requested_by.first_name}{" "}
                {request.attributes.requested_by.last_name}
              </h1>
            </div>
          );
        } else if (request.attributes.request_department) {
          // Department request format
          return (
            <div className="flex items-center gap-2">
              <h1 className="text-custom-black font-medium">
                {request.attributes.request_department}
              </h1>
            </div>
          );
        } else {
          return <span className="text-gray-400">Not specified</span>;
        }
      },
    },
    {
      key: "type" as keyof RequestData,
      label: "Category",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">{request.type || "N/A"}</span>
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
      label: "Item Price",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">
          {request.attributes.item_requested.inventory.service_item_price}
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
    // {
    //   key: "id" as keyof RequestData,
    //   label: "Status",
    //   render: (_, request) => (
    //     <span className="text-[#667085] text-sm">
    //       {request.attributes.status}
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
            {request.attributes.recorded_by.last_name}
          </span>
        </div>
      ),
    },
    {
      key: "id" as keyof RequestData,
      label: "Date",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">
          {request.attributes.created_at}
        </span>
      ),
    },
  ] as Column<RequestData>[];

  return (
    <div>
      <Tablehead
        typebutton="Add New"
        tableTitle="Requests"
        showButton={true}
        onButtonClick={openModal}
      />
      <div className="w-full bg-white rounded-b-[8px] shadow-table">
        {isLoading ? (
          <p>Loading...</p>
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
      {isModalOpen && (
        <AddRequestModal
          onClose={closeModal}
          endpoint="/inventory/requests/create"
          refreshEndpoint="/inventory/requests/all-records?status=pending"
          fetchEndpoint="/medical-report/department-request-records"
          stockEndpoint="/inventory/all-inventory-items"
        />
      )}
    </div>
  );
};

export default InventoryRequest;
