import React, { useState, useEffect } from "react";
import { useFinanceStore } from "../../store/staff/useFinanceStore";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

// Type definitions
interface Patient {
  id: number;
  // Add other patient properties as needed
}

interface User {
  attributes: {
    first_name: string;
    last_name: string;
    department?: {
      id: number;
    };
  };
}

interface CreatedBill {
  id: number;
  attributes: {
    name: string;
    amount: string;
    created_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    created_at: string;
  };
}

interface DoctorBillFormProps {
  patient?: Patient;
  selectedPatient?: Patient;
  patientId?: any;
}

const DoctorBillForm: React.FC<DoctorBillFormProps> = ({
  patient,
  selectedPatient,
  patientId,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // New state for complete process
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const { id } = useParams<{ id: string }>();
  console.log(selectedPatient, "wefvhg");
  const selectedPatientId = selectedPatient?.id;
  console.log(selectedPatientId);
  console.log(patientId);

  const patientIdToBeUsed = selectedPatientId || patientId;
  // const patientId = patient?.id || (idFromParams ? Number(idFromParams) : null);

  const { createDoctorBill, isBillLoading, createPayment } = useFinanceStore();

  // Load user data on component mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user-info");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log("User loaded:", parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.log("No user found in sessionStorage");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      setStatusMessage({
        type: "error",
        message: "User information not available",
      });
      return;
    }

    if (!patientIdToBeUsed) {
      setStatusMessage({
        type: "error",
        message: "Patient information not available",
      });
      return;
    }

    setIsProcessing(true); // Start processing - disable button
    setStatusMessage(null); // Clear any previous messages

    try {
      // Step 1: Create the doctor bill
      const billData = {
        name: description.trim(),
        amount: Number(amount) || 0,
      };

      // Run both operations concurrently for better performance
      const [billResponse] = await Promise.all([
        createDoctorBill(billData),
        // We can't run createPayment concurrently since it needs the bill ID
        // But we can prepare the payment data while the bill is being created
      ]);

      if (billResponse) {
        const createdBill = billResponse as CreatedBill;
        console.log("Bill created:", createdBill);

        // Step 2: Create payment using the created bill data
        const paymentSuccess = await handleCreatePayment(createdBill);

        if (paymentSuccess) {
          // Clear form only on complete success
          setDescription("");
          setAmount("");
          setStatusMessage({
            type: "success",
            message:
              "Doctor bill has been successfully created. The patient may now proceed to the front desk for further processing",
          });
        }
      } else {
        setStatusMessage({
          type: "error",
          message: "Failed to create doctor bill",
        });
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setStatusMessage({
        type: "error",
        message: "Failed to process doctor bill",
      });
    } finally {
      setIsProcessing(false); // Re-enable button
    }
  };

  const handleCreatePayment = async (
    createdBill: CreatedBill
  ): Promise<boolean> => {
    if (!user) {
      setStatusMessage({ type: "error", message: "Missing user information" });
      return false;
    }

    const departmentId = user.attributes?.department?.id;

    if (!departmentId) {
      setStatusMessage({
        type: "error",
        message: "Department information not available",
      });
      return false;
    }

    // Create payment source from user's first and last name
    const paymentSource = `${user.attributes.first_name} ${user.attributes.last_name}`;

    // Parse the amount correctly - remove commas and convert to number
    const billAmount = parseFloat(
      createdBill.attributes.amount.replace(/,/g, "")
    );

    const payload = {
      payment_source: paymentSource,
      payment_type: "pending",
      total_amount: billAmount.toString(),
      part_amount: null,
      payment_method: "cash",
      patient_id: Number(patientIdToBeUsed),
      department_id: Number(departmentId),
      payments: [
        {
          patient_id: Number(patientIdToBeUsed),
          amount: billAmount,
          service_charge_id: null,
          request_pharmacy_id: null,
          doctor_bill_id: Number(createdBill.id),
          quantity: null,
          item_name: createdBill.attributes.name,
        },
      ],
    };

    console.log("Payment payload:", payload);

    try {
      const success = await createPayment(payload);
      return !!success; // Convert to boolean
    } catch (error) {
      console.error("Payment creation error:", error);
      setStatusMessage({ type: "error", message: "Payment processing failed" });
      return false;
    }
  };

  // Button should be disabled during any processing
  const isButtonDisabled = isBillLoading || isProcessing;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {/* Status Message Display */}
      {statusMessage && (
        <div
          className={`p-4 rounded-lg border flex items-center justify-between ${
            statusMessage.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center space-x-2">
            {statusMessage.type === "success" ? (
              <svg
                className="w-5 h-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="font-medium">{statusMessage.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className={`text-xl font-bold hover:opacity-70 transition-opacity ${
              statusMessage.type === "success"
                ? "text-green-600"
                : "text-red-600"
            }`}
            aria-label="Close message"
          >
            ×
          </button>
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="description" className="block font-medium">
          Description
        </label>
        <input
          id="description"
          name="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
          disabled={isButtonDisabled}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="amount" className="block font-medium">
          Amount (₦)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
          disabled={isButtonDisabled} // Disable input during processing
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={isButtonDisabled}
        >
          {isProcessing ? "Processing…" : "Create Bill"}
        </button>
      </div>
    </form>
  );
};

export default DoctorBillForm;
