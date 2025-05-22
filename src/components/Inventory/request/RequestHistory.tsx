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

// Helper function to format dates
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Not available";

  // If it's already formatted (like "May 22, 2025"), return as is
  if (dateString.includes(",")) return dateString;

  // Otherwise, try to parse and format
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

const RequestHistory = () => {
  const { allPharmacyRequest, allPharRequest, isLoading } = useInventoryStore();

  useEffect(() => {
    allPharmacyRequest();
  }, [allPharmacyRequest]);

  // Improved data validation and type safety
  const pharmacyRequestsArray: PharmacyRequestData[] = Array.isArray(
    allPharRequest
  )
    ? allPharRequest
    : [];

  const requestHistoryColumns: Column<PharmacyRequestData>[] = [
    {
      key: "id",
      label: "Request ID",
      render: (_, request) => (
        <span className="text-custom-black font-medium">#{request.id}</span>
      ),
    },
    {
      key: "type",
      label: "Request Type",
      render: (_, request) => (
        <div className="max-w-32">
          <span className="text-gray-700 text-sm font-medium">
            {request.type}
          </span>
        </div>
      ),
    },
    {
      key: "attributes",
      label: "Item Requested",
      render: (_, request) => (
        <span className="text-gray-700 text-sm font-medium">
          {request.attributes.item_requested}
        </span>
      ),
    },
    {
      key: "attributes",
      label: "From Department",
      render: (_, request) => (
        <span className="text-gray-600 text-sm">
          {request.attributes.from_department.name}
        </span>
      ),
    },
    {
      key: "attributes",
      label: "To Department",
      render: (_, request) => (
        <span className="text-gray-600 text-sm">
          {request.attributes.to_department.name}
        </span>
      ),
    },
    {
      key: "attributes",
      label: "Status",
      render: (_, request) => {
        const status = request.attributes.approval_status.toLowerCase() as
          | "pending"
          | "approved"
          | "rejected";

        const statusConfig = {
          pending: {
            bg: "bg-amber-50",
            text: "text-amber-700",
            border: "border-amber-200",
          },
          approved: {
            bg: "bg-green-50",
            text: "text-green-700",
            border: "border-green-200",
          },
          rejected: {
            bg: "bg-red-50",
            text: "text-red-700",
            border: "border-red-200",
          },
        };

        const config = statusConfig[status] || {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
        };

        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      key: "attributes",
      label: "Date Requested",
      render: (_, request) => (
        <span className="text-gray-600 text-sm">
          {formatDate(request.attributes.created_at)}
        </span>
      ),
    },
    {
      key: "attributes",
      label: "Actioned Date",
      render: (_, request) => (
        <span className="text-gray-600 text-sm">
          {request.attributes.actioned_at
            ? formatDate(request.attributes.actioned_at)
            : "—"}
        </span>
      ),
    },
    {
      key: "attributes",
      label: "Actions",
      render: (_, request) => (
        <div className="flex items-center space-x-2">
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={() => console.log("View details for request:", request.id)}
          >
            View
          </button>
          {request.attributes.approval_status === "pending" && (
            <>
              <span className="text-gray-300">|</span>
              <button
                className="text-green-600 hover:text-green-800 text-sm font-medium"
                onClick={() => console.log("Approve request:", request.id)}
              >
                Approve
              </button>
              <button
                className="text-red-600 hover:text-red-800 text-sm font-medium"
                onClick={() => console.log("Reject request:", request.id)}
              >
                Reject
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-b-lg shadow-sm">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading request history...</p>
        </div>
      </div>
    );
  }

  if (pharmacyRequestsArray.length === 0) {
    return (
      <div className="w-full bg-white rounded-b-lg shadow-sm">
        <div className="p-8 text-center text-gray-500">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2 text-gray-900">
            No Request History
          </h3>
          <p className="text-gray-600">
            No pharmacy requests have been made yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-b-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Request History ({pharmacyRequestsArray.length})
        </h2>
      </div>
      <Table
        data={pharmacyRequestsArray}
        columns={requestHistoryColumns}
        rowKey="id"
        loading={false}
        radius="rounded-none"
      />
    </div>
  );
};

export default RequestHistory;
