import React, { useState, useEffect } from "react";
import { useFinanceStore } from "../../store/staff/useFinanceStore";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

// Type definitions
interface Patient {
  id: number;
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
    department_id: string;
    created_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    created_at: string;
  };
}

interface PaymentSource {
  type: string;
  id: number;
  attributes: {
    name: string;
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
  const [selectedPaymentSource, setSelectedPaymentSource] = useState("");
  const [amount, setAmount] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const {
    createDoctorBill,
    isBillLoading,
    createPayment,
    paymentSources,
    getPaymentSource,
  } = useFinanceStore();

  // Load user data on component mount
  useEffect(() => {
    getPaymentSource(); // Fetch payment sources on mount
    const storedUser = localStorage.getItem("user-info");
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

  console.log(paymentSources, "payment sources");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (!user) {
    //   setStatusMessage({
    //     type: "error",
    //     message: "User information not available",
    //   });
    //   return;
    // }

    if (!patientIdToBeUsed) {
      setStatusMessage({
        type: "error",
        message: "Patient information not available",
      });
      return;
    }

    if (!selectedPaymentSource) {
      setStatusMessage({
        type: "error",
        message: "Please select a bill type",
      });
      return;
    }

    setIsProcessing(true);
    setStatusMessage(null);

    try {
      const billData = {
        name: selectedPaymentSource,
        amount: Number(amount) || 0,
        patient_id: Number(patientIdToBeUsed),
      };

      const [billResponse] = await Promise.all([createDoctorBill(billData)]);

      if (billResponse) {
        const createdBill = billResponse as CreatedBill;
        console.log("Bill created:", createdBill);

        // Step 2: Create payment using the created bill data
        const paymentSuccess = await handleCreatePayment(createdBill);

        if (paymentSuccess) {
          // Clear form only on complete success
          setSelectedPaymentSource("");
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
      setIsProcessing(false);
    }
  };

  const handleCreatePayment = async (
    createdBill: CreatedBill
  ): Promise<boolean> => {
    const paymentSourceName = selectedPaymentSource;

    const billAmount = parseFloat(
      createdBill.attributes.amount.replace(/,/g, "")
    );

    // Fixed: Correctly access department_id from the created bill
    const departmentId = createdBill?.attributes?.department_id || 158;

    console.log("Department ID from created bill:", departmentId);

    if (!departmentId) {
      setStatusMessage({
        type: "error",
        message: "Department information not available from created bill",
      });
      return false;
    }

    const payload = {
      payment_source: paymentSourceName,
      payment_type: "pending",
      total_amount: billAmount.toString(),
      part_amount: null,
      payment_method: "cash",
      from_doctor: createdBill?.attributes?.created_by,
      patient_id: Number(patientIdToBeUsed),
      department_id: [Number(departmentId) || 158],
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
      return !!success;
    } catch (error) {
      console.error("Payment creation error:", error);
      setStatusMessage({ type: "error", message: "Payment processing failed" });
      return false;
    }
  };

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
        <label htmlFor="paymentSource" className="block font-medium">
          Bill type
        </label>
        <select
          id="paymentSource"
          name="paymentSource"
          value={selectedPaymentSource}
          onChange={(e) => setSelectedPaymentSource(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          required
          disabled={isButtonDisabled}
        >
          <option value="">Select bill type</option>
          {paymentSources?.map((source: PaymentSource) => (
            <option key={source.id} value={source.attributes.name}>
              {source.attributes.name}
            </option>
          ))}
        </select>
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
          disabled={isButtonDisabled}
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
