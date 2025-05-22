import { useEffect, JSX } from "react";
import { useInventoryStore } from "../overview/useInventoryStore";
import Table from "../../../Shared/Table";
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

// Pharmacy Request Data Type
export type PharmacyRequestData = {
  id: number;
  type: string;
  attributes: {
    inventory: {
      id: number;
      item: string;
    };
    from_department: {
      id: number;
      name: string;
    };
    to_department: {
      id: number;
      name: string;
    };
    item_requested: string;
    rejection_reason: string | null;
    actioned_by: any;
    actioned_at: string | null;
    approval_status: string;
    created_at: string;
  };
};
const RequestHistory = () => {
  const { allPharmacyRequest, allPharRequest, isLoading } =
    useInventoryStore() as unknown as {
      allPharmacyRequest: () => void;
      allPharRequest: {
        data: PharmacyRequestData[];
        pagination: object;
      } | null;
      isLoading: boolean;
    };

  useEffect(() => {
    allPharmacyRequest();
  }, [allPharmacyRequest]);

  console.log(allPharRequest, "allPharRequest");

  const pharmacyRequestsArray =
    allPharRequest && allPharRequest.data && Array.isArray(allPharRequest.data)
      ? allPharRequest.data
      : [];

  const requestHistoryColumns = [
    {
      key: "id" as keyof PharmacyRequestData,
      label: "Request ID",
      render: (_, request) => (
        <span className="text-custom-black font-medium">#{request.id}</span>
      ),
    },
    {
      key: "type" as keyof PharmacyRequestData,
      label: "Request Type",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">{request.type}</span>
      ),
    },
    {
      key: "id" as keyof PharmacyRequestData,
      label: "Item Requested",
      render: (_, request) => (
        <span className="text-[#667085] text-sm font-medium">
          {request.attributes.item_requested}
        </span>
      ),
    },
    {
      key: "id" as keyof PharmacyRequestData,
      label: "From Department",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">
          {request.attributes.from_department.name}
        </span>
      ),
    },
    {
      key: "id" as keyof PharmacyRequestData,
      label: "To Department",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">
          {request.attributes.to_department.name}
        </span>
      ),
    },
    {
      key: "id" as keyof PharmacyRequestData,
      label: "Status",
      render: (_, request) => {
        const status = request.attributes.approval_status as
          | "pending"
          | "approved"
          | "rejected";
        const statusColors: Record<
          "pending" | "approved" | "rejected",
          string
        > = {
          pending: "bg-yellow-100 text-yellow-800",
          approved: "bg-green-100 text-green-800",
          rejected: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      key: "id" as keyof PharmacyRequestData,
      label: "Date Requested",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">
          {request.attributes.created_at}
        </span>
      ),
    },
    {
      key: "id" as keyof PharmacyRequestData,
      label: "Actioned Date",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">
          {request.attributes.actioned_at || "Not actioned"}
        </span>
      ),
    },
  ] as Column<PharmacyRequestData>[];

  return (
    <div className="w-full bg-white rounded-b-[8px] shadow-table">
      {isLoading ? (
        <div className="p-8 text-center">
          <p>Loading request history...</p>
        </div>
      ) : pharmacyRequestsArray.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <h3 className="text-lg font-medium mb-2">Request History</h3>
          <p>No request history available</p>
        </div>
      ) : (
        <Table
          data={pharmacyRequestsArray}
          columns={requestHistoryColumns}
          rowKey="id"
          loading={isLoading}
          radius="rounded-none"
        />
      )}
    </div>
  );
};
export default RequestHistory;
