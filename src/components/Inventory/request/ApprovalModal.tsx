import { useState } from "react";
import { useInventoryStore } from "../overview/useInventoryStore";
import { PharmacyRequestData } from "./RequestHistory";

interface ApprovalModalProps {
  request: PharmacyRequestData;
  onClose: () => void;
  onSuccess: () => void;
}

const ApprovalModal = ({ request, onClose, onSuccess }: ApprovalModalProps) => {
  const { createRequest, changePharmacyRequestStatus } = useInventoryStore();
  const [quantity, setQuantity] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprovalSubmit = async () => {
    if (!request) return;

    setIsProcessing(true);
    try {
      // First, create the dispensing request
      const dispensingData = {
        requested_by: null,
        status: "approved",
        inventory_id: request.attributes.inventory.id,
        quantity: quantity,
        requested_department_id: request.attributes.from_department.id,
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
          request.id
        );
        const statusSuccess = await changePharmacyRequestStatus(
          request.id,
          statusData
        );
        console.log("Status update result:", statusSuccess);

        if (statusSuccess) {
          onSuccess();
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

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Approve Request
          </h3>
          <button
            onClick={handleClose}
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
                <span className="font-medium text-gray-600">Request ID:</span>
                <p className="text-gray-900">#{request.id}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Item:</span>
                <p className="text-gray-900">
                  {request.attributes.item_requested}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">From:</span>
                <p className="text-gray-900">
                  {request.attributes.from_department.name}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">To:</span>
                <p className="text-gray-900">
                  {request.attributes.to_department.name}
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
                <p className="font-medium text-blue-800">Approval Process</p>
                <p className="text-blue-700 mt-1">
                  This will dispense <strong>{quantity}</strong> unit(s) of{" "}
                  <strong>{request.attributes.item_requested}</strong> to the
                  pharmacy and update the request status to approved.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleClose}
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
  );
};

export default ApprovalModal;
