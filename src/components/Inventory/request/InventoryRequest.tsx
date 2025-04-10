import React, { JSX, useEffect, useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Table from "../../../Shared/Table";
import AddRequestModal from "./AddRequestModal";
import axios from "axios";
import { useInventoryStore } from "../../../store/staff/useInventoryStore";
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
const InventoryRequest = () => {
  const { getAllRequest, requests, isLoading } = useInventoryStore();

  useEffect(() => {
    getAllRequest();
  }, [getAllRequest]);

  type Columns = {
    key: keyof RequestData;
    label: string;
    render?: (value: any, request: RequestData) => JSX.Element;
  };

  const requestsArray = Array.isArray(requests) ? requests : [];

  // const formattedPayments: RequestData[] = requestsArray.map((request) => ({
  //   id: request.id.toString(),
  //   requested_by: request.attributes?.requested_by || "N/A",
  //   inventory_id: request.attributes?.inventory_id || "Unknown",
  //   quantity: request.attributes?.quantity || "0",
  //   status: request.attributes?.status || "0",
  // }));

  const columns: Columns[] = [
    {
      key: "picture",
      label: "Name",
      render: (value, request) => {
        const imageSrc = value
          ? value
          : "https://placehold.co/600x400?text=img";
        return (
          <div className="flex items-center gap-2">
            <img
              src={imageSrc}
              // alt={`Dr. ${request.first_name} ${request.last_name}`}
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
      render: (value) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">{String(value)}</span>
        </div>
      ),
    },
    {
      key: "item_category",
      label: "Inventory ID",
      render: (value) => (
        <span className="text-[#667085] text-sm">{String(value)}</span>
      ),
    },
    {
      key: "item_name",
      label: "Item Name",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">{request.status}</span>
      ),
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">{request.quantity}</span>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">{request.quantity}</span>
      ),
    },
  ];

  return (
    <div>
      <Tablehead typebutton="Add New" tableTitle="Requests" showButton={true} />

      <div className="w-full bg-white rounded-b-[8px] shadow-table">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table
            data={requestsArray} // Ensure this is always an array
            columns={columns}
            rowKey="id"
            pagination={requestsArray.length > 10} // Use requestsArray here
            rowsPerPage={10}
            radius="rounded-none"
          />
        )}
      </div>
    </div>
  );
};

export default InventoryRequest;
