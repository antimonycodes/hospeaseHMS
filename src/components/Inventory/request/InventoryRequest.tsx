import React, { JSX, useEffect, useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Table from "../../../Shared/Table";
import AddRequestModal from "./AddRequestModal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getAllRequest();
  }, [getAllRequest]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  type Columns = {
    key: keyof RequestData;
    label: string;
    render?: (value: any, request: RequestData) => JSX.Element;
  };

  const requestsArray = Array.isArray(requests) ? requests : [];

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
      label: "Category",
      render: (value) => (
        <span className="text-[#667085] text-sm">{String(value)}</span>
      ),
    },
    {
      key: "item_name",
      label: "Item Name",
      render: (value) => (
        <span className="text-[#667085] text-sm">{String(value)}</span>
      ),
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (value) => (
        <span className="text-[#667085] text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

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
        ) : (
          <Table
            data={requestsArray}
            columns={columns}
            rowKey="id"
            pagination={requestsArray.length > 10}
            rowsPerPage={10}
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
