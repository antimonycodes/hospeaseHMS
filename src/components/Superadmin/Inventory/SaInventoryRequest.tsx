import React, { JSX, useEffect, useState } from "react";
import Table from "../../../Shared/Table";
import { useInventoryStore } from "../../Inventory/overview/useInventoryStore";
import Tablehead from "../../ReusablepatientD/Tablehead";

export type RequestData = {
  id: number;
  requested_by: string;
  inventory_id: string;
  quantity: string;
  status: string;
  picture?: string | undefined;
  first_name: string;
  last_name: string;
  user_id: string;
  item_category: string;
  item_name: string;
  created_at: string;
};

const SaInventoryRequest = () => {
  const { getAllRequest, requests, isLoading } = useInventoryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getAllRequest("/admin/inventory/requests/all-records?status=pending");
  }, [getAllRequest]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  type Columns = {
    key: keyof RequestData;
    label: string;
    render?: (value: any, request: RequestData) => JSX.Element;
  };

  const formattedRequest = (requests || []).map((request) => ({
    id: request.id,
    requested_by: request.attributes.requested_by,
    inventory_id: request.attributes.inventory_id,
    quantity: request.attributes.quantity,
    status: request.attributes.status,
    picture: request.attributes.picture,
    first_name: request.attributes.first_name,
    last_name: request.attributes.last_name,
    user_id: request.attributes.user_id,
    item_category: request.attributes.item_category,
    item_name: request.attributes.item_name,
    created_at: request.attributes.created_at,
  }));
  const columns: Columns[] = [
    {
      key: "picture",
      label: "Name",
      render: (value, request) => {
        const imageSrc = request.picture
          ? request.picture
          : "https://placehold.co/600x400?text=img";
        return (
          <div className="flex items-center gap-2">
            <img
              src={imageSrc}
              className="h-10 w-10 border rounded-full object-cover border-gray-300"
            />
            <h1 className="text-custom-black font-medium">
              {request.first_name} {request.last_name}
            </h1>
          </div>
        );
      },
    },
    {
      key: "user_id",
      label: "Staff ID",
      render: (value, request) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">{request.user_id}</span>
        </div>
      ),
    },
    {
      key: "item_category",
      label: "Category",
      render: (value, request) => (
        <span className="text-[#667085] text-sm">{request.item_category}</span>
      ),
    },
    {
      key: "item_name",
      label: "Item Name",
      render: (value, request) => (
        <span className="text-[#667085] text-sm">{request.item_name}</span>
      ),
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (value, request) => (
        <span className="text-[#667085] text-sm">{request.quantity}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value, request) => (
        <span className="text-[#667085] text-sm">{request.status}</span>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (value, request) => (
        <span className="text-[#667085] text-sm">{request.created_at}</span>
      ),
    },
  ];
  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table
          data={formattedRequest}
          columns={columns}
          rowKey="id"
          pagination={formattedRequest.length > 10}
          radius="rounded-none"
        />
      )}
    </div>
  );
};

export default SaInventoryRequest;
