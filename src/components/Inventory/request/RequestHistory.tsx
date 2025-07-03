import { useEffect, JSX, useState } from "react";
import { useInventoryStore } from "../overview/useInventoryStore";
import Table from "../../../Shared/Table";
import ApprovalModal from "./ApprovalModal";
// import ApprovalModal from "./ApprovalModal";

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
    return date.toLocaleDateString("en-NG", {
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

  const [activeTab, setActiveTab] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<PharmacyRequestData | null>(null);

  useEffect(() => {
    allPharmacyRequest();
  }, [allPharmacyRequest]);

  // Improved data validation and type safety
  const pharmacyRequestsArray: PharmacyRequestData[] = Array.isArray(
    allPharRequest
  )
    ? allPharRequest
    : [];

  // Filter requests by status
  const filteredRequests = pharmacyRequestsArray.filter(
    (request) => request.attributes.approval_status.toLowerCase() === activeTab
  );

  // Get counts for each status
  const statusCounts = {
    pending: pharmacyRequestsArray.filter(
      (r) => r.attributes.approval_status.toLowerCase() === "pending"
    ).length,
    approved: pharmacyRequestsArray.filter(
      (r) => r.attributes.approval_status.toLowerCase() === "approved"
    ).length,
    rejected: pharmacyRequestsArray.filter(
      (r) => r.attributes.approval_status.toLowerCase() === "rejected"
    ).length,
  };

  // Handle approval process
  const handleApproveClick = (request: PharmacyRequestData) => {
    setSelectedRequest(request);
    setShowApprovalModal(true);
  };

  const handleModalClose = () => {
    setShowApprovalModal(false);
    setSelectedRequest(null);
  };

  const handleApprovalSuccess = () => {
    setShowApprovalModal(false);
    setSelectedRequest(null);
    // Refresh the pharmacy requests
    allPharmacyRequest();
  };

  const requestHistoryColumns: Column<PharmacyRequestData>[] = [
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
          {request.attributes.approval_status === "pending" && (
            <button
              className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 rounded border border-green-200 hover:bg-green-50"
              onClick={() => handleApproveClick(request)}
            >
              Approve
            </button>
          )}
          {request.attributes.approval_status === "rejected" &&
            request.attributes.rejection_reason && (
              <span className="text-red-600 text-xs bg-red-50 px-2 py-1 rounded">
                {request.attributes.rejection_reason}
              </span>
            )}
        </div>
      ),
    },
  ];

  const TabButton = ({
    status,
    label,
    count,
    isActive,
    onClick,
  }: {
    status: "pending" | "approved" | "rejected";
    label: string;
    count: number;
    isActive: boolean;
    onClick: () => void;
  }) => {
    const getTabStyles = () => {
      const baseStyles =
        "px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2";

      if (isActive) {
        switch (status) {
          case "pending":
            return `${baseStyles} bg-[#FEF3CD] text-[#B58A00]  border border-amber-200`;
          case "approved":
            return `${baseStyles} bg-[#CCFFE7] text-[#009952] border border-primary`;
          case "rejected":
            return `${baseStyles} bg-[#FBE1E1] text-[#F83E41] border border-red-200`;
        }
      }

      return `${baseStyles} bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200`;
    };

    return (
      <button onClick={onClick} className={getTabStyles()}>
        <span>{label}</span>
        <span className="bg-white px-2 py-0.5 rounded-full text-xs font-semibold">
          {count}
        </span>
      </button>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-b-lg shadow-sm">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          {/* <p className="text-gray-600">Loading request history...</p> */}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-white rounded-b-lg shadow-sm">
        {/* Header with Tabs */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            {/* <h2 className="text-lg font-semibold text-gray-900">
              Request History ({pharmacyRequestsArray.length})
            </h2> */}
          </div>

          {/* Status Tabs */}
          <div className="flex space-x-2">
            <TabButton
              status="pending"
              label="Pending"
              count={statusCounts.pending}
              isActive={activeTab === "pending"}
              onClick={() => setActiveTab("pending")}
            />
            <TabButton
              status="approved"
              label="Approved"
              count={statusCounts.approved}
              isActive={activeTab === "approved"}
              onClick={() => setActiveTab("approved")}
            />
            {/* <TabButton
              status="rejected"
              label="Rejected"
              count={statusCounts.rejected}
              isActive={activeTab === "rejected"}
              onClick={() => setActiveTab("rejected")}
            /> */}
          </div>
        </div>

        {/* Table Content */}
        {filteredRequests.length === 0 ? (
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
              No {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
              Requests
            </h3>
            <p className="text-gray-600">
              No {activeTab} pharmacy requests found.
            </p>
          </div>
        ) : (
          <Table
            data={filteredRequests}
            columns={requestHistoryColumns}
            rowKey="id"
            loading={false}
            radius="rounded-none"
          />
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedRequest && (
        <ApprovalModal
          request={selectedRequest}
          onClose={handleModalClose}
          onSuccess={handleApprovalSuccess}
        />
      )}
    </>
  );
};

export default RequestHistory;
