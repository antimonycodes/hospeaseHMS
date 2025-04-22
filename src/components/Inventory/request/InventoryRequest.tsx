import React, { JSX, useEffect, useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Table from "../../../Shared/Table";
import AddRequestModal from "./AddRequestModal";
import { useInventoryStore } from "../../../store/staff/useInventoryStore";

export type RequestData = {
  id: number;
  type: string;
  attributes: {
    requested_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    item_requested: {
      id: number;
      item: string;
      cost: string;
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
    // Fetch data when component mounts
    getAllRequest();
  }, [getAllRequest]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Extract actual requests array from the requests state
  const requestsArray =
    requests && requests.data && Array.isArray(requests.data)
      ? requests.data
      : [];

  console.log("requestsArray length:", requestsArray.length);
  console.log("First item in requestsArray:", requestsArray[0]);

  // Add a dummy type property to enable type checking with 'as'
  // This is a workaround for TypeScript limitations with deeply nested properties
  const columns = [
    {
      key: "id" as keyof RequestData, // Use a valid top-level key
      label: "Requested By",
      render: (_, request) => {
        const imageSrc = request.attributes.hospital.logo
          ? request.attributes.hospital.logo
          : "https://placehold.co/600x400?text=img";

        return (
          <div className="flex items-center gap-2">
            <img
              src={imageSrc}
              className="h-10 w-10 border rounded-full object-cover border-gray-300"
              alt="Staff"
            />
            <h1 className="text-custom-black font-medium">
              {request.attributes.requested_by.first_name}{" "}
              {request.attributes.requested_by.last_name}
            </h1>
          </div>
        );
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
      key: "id" as keyof RequestData, // Use valid key and rely on render function
      label: "Item Name",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">
          {request.attributes.item_requested.item}
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
      label: "Status",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">
          {request.attributes.status}
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
        />
      )}
    </div>
  );
};

export default InventoryRequest;
