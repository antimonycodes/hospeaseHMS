import { useEffect, JSX, useState } from "react";
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
  const {
    allPharmacyRequest,
    allPharRequest,
    isLoading,
    createRequest,
    changePharmacyRequestStatus,
  } = useInventoryStore();
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<PharmacyRequestData | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    allPharmacyRequest();
  }, [allPharmacyRequest]);

  // Improved data validation and type safety
  const pharmacyRequestsArray: PharmacyRequestData[] = Array.isArray(
    allPharRequest
  )
    ? allPharRequest
    : [];

  // Handle approval process
  const handleApproveClick = (request: PharmacyRequestData) => {
    setSelectedRequest(request);
    setQuantity(1);
    setShowApprovalModal(true);
  };

  const handleApprovalSubmit = async () => {
    if (!selectedRequest) return;

    setIsProcessing(true);
    try {
      // First, create the dispensing request
      const dispensingData = {
        requested_by: null,
        status: "approved",
        inventory_id: selectedRequest.attributes.inventory.id,
        quantity: quantity,
        requested_department_id: selectedRequest.attributes.from_department.id,
      };

      console.log("Starting dispensing request...", dispensingData);
      const dispensingSuccess = await createRequest(
        dispensingData,
        "/inventory/requests/create",
        "/inventory/requests/all-records"
      );

      console.log("Dispensing request result:", dispensingSuccess);

      // Check if dispensing was successful (the createRequest function might be returning false for status 200)
      // Let's proceed to status update regardless if the first operation completed
      if (dispensingSuccess !== false) {
        // Then update the pharmacy request status
        const statusData = {
          status: "approved",
        };

        console.log(
          "Starting status update...",
          statusData,
          "Request ID:",
          selectedRequest.id
        );
        const statusSuccess = await changePharmacyRequestStatus(
          selectedRequest.id,
          statusData
        );
        console.log("Status update result:", statusSuccess);

        if (statusSuccess) {
          setShowApprovalModal(false);
          setSelectedRequest(null);
          // Refresh the pharmacy requests
          allPharmacyRequest();
        } else {
          console.error("Status update failed");
        }
      } else {
        console.error(
          "Dispensing request failed, not proceeding with status update"
        );
      }
    } catch (error) {
      console.error("Error processing approval:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModalClose = () => {
    if (!isProcessing) {
      setShowApprovalModal(false);
      setSelectedRequest(null);
      setQuantity(1);
    }
  };

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
                onClick={() => handleApproveClick(request)}
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
    <>
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

      {/* Approval Modal */}
      {showApprovalModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Approve Request
              </h3>
              <button
                onClick={handleModalClose}
                disabled={isProcessing}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">
                      Request ID:
                    </span>
                    <p className="text-gray-900">#{selectedRequest.id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Item:</span>
                    <p className="text-gray-900">
                      {selectedRequest.attributes.item_requested}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">From:</span>
                    <p className="text-gray-900">
                      {selectedRequest.attributes.from_department.name}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">To:</span>
                    <p className="text-gray-900">
                      {selectedRequest.attributes.to_department.name}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Quantity to Dispense <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  disabled={isProcessing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100"
                  placeholder="Enter quantity"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">
                      Approval Process
                    </p>
                    <p className="text-blue-700 mt-1">
                      This will dispense <strong>{quantity}</strong> unit(s) of{" "}
                      <strong>
                        {selectedRequest.attributes.item_requested}
                      </strong>{" "}
                      to the pharmacy and update the request status to approved.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleModalClose}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApprovalSubmit}
                disabled={isProcessing || quantity < 1}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Approve & Dispense"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestHistory;
