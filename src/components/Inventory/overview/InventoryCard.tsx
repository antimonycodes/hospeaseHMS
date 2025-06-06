import { JSX, useEffect, useState } from "react";
import { useInventoryStore } from "../../../store/staff/useInventoryStore";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Table from "../../../Shared/Table";

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

const InventoryCard = () => {
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
        const imageSrc = request.attributes.hospital.logo
          ? request.attributes.hospital.logo
          : "https://placehold.co/600x400?text=img";

        const requestedBy = request.attributes.requested_by;

        return (
          <div className="flex items-center gap-2">
            <img
              src={imageSrc}
              className="h-10 w-10 border rounded-full object-cover border-gray-300"
              alt="Staff"
            />
            <h1 className="text-custom-black font-medium">
              {requestedBy
                ? `${requestedBy.first_name} ${requestedBy.last_name}`
                : "N/A"}
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
      <Tablehead tableTitle="Requests" showButton={false} />
      <div className="w-full bg-white rounded-b-[8px] shadow-table">
        {isLoading ? (
          <p>Loading...</p>
        ) : requestsArray.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No requests available</p>
        ) : (
          <Table
            data={requestsArray.slice(0, 5)}
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

export default InventoryCard;
