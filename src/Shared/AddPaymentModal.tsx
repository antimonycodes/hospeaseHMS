import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import debounce from "lodash.debounce"; // Optional: Install lodash if not already present
import { useFinanceStore } from "../store/staff/useFinanceStore"; // Adjust path as needed
import { usePatientStore } from "../store/super-admin/usePatientStore"; // Import patient store for search

interface FormData {
  patient_id: number; // Changed to number to match API
  amount: string;
  purpose: string;
  payment_method: string;
  payment_type: string;
}

const initialFormData: FormData = {
  patient_id: 0,
  amount: "",
  purpose: "",
  payment_method: "",
  payment_type: "",
};

interface AddPaymentModalProps {
  onClose: () => void;
  endpoint?: string; // Optional custom endpoint
  refreshEndpoint?: string; // Optional refresh endpoint
}

const AddPaymentModal = ({
  onClose,
  endpoint = "/finance/save-revenue", // Default endpoint
  refreshEndpoint = "/finance/all-revenues", // Default refresh endpoint
}: AddPaymentModalProps) => {
  const { createPayment, isLoading } = useFinanceStore();
  const { searchPatients } = usePatientStore();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [query, setQuery] = useState("");
  const [patientOptions, setPatientOptions] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  // Debounced patient search
  const handleSearch = debounce(async (val: string) => {
    if (val.length > 2) {
      // Only search if query is at least 3 chars
      const results = await searchPatients(val);
      setPatientOptions(results || []);
    } else {
      setPatientOptions([]);
    }
  }, 300);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "query") {
      setQuery(value);
      handleSearch(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "patient_id" ? parseInt(value) || 0 : value, // Convert patient_id to number
      }));
    }
  };

  // Handle patient selection from dropdown
  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setFormData((prev) => ({ ...prev, patient_id: patient.id }));
    setQuery(
      `${patient.attributes.first_name} ${patient.attributes.last_name}`
    );
    setPatientOptions([]); // Close dropdown
  };

  // Handle form submission

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.patient_id ||
      !formData.amount ||
      !formData.purpose ||
      !formData.payment_method ||
      !formData.payment_type
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const success = await createPayment(formData, endpoint, refreshEndpoint);
    if (success) {
      setFormData(initialFormData);
      setQuery("");
      setSelectedPatient(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white hide-scroll rounded-lg custom-shadow overflow-y-auto p-12 h-[90%] w-full max-w-[980px]">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Add New Payment</h2>
            <button type="button" onClick={onClose}>
              <X />
            </button>
          </div>

          {/* Patient Search */}
          <div className="mt-4 relative">
            <input
              type="search"
              name="query"
              value={query}
              onChange={handleInputChange}
              placeholder="Search patient by name or card ID..."
              className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
              disabled={isLoading}
            />
            {patientOptions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow max-h-60 overflow-y-auto">
                {patientOptions.map((p) => (
                  <li
                    key={p.id}
                    onClick={() => handleSelectPatient(p)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {p.attributes.first_name} {p.attributes.last_name} —{" "}
                    {p.attributes.card_id}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Patient Info (if selected) */}
          {selectedPatient && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {[
                { label: "Patient ID", value: selectedPatient.id },
                {
                  label: "First Name",
                  value: selectedPatient.attributes.first_name,
                },
                {
                  label: "Last Name",
                  value: selectedPatient.attributes.last_name,
                },
                { label: "Card ID", value: selectedPatient.attributes.card_id },
              ].map((field, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-custom-black mb-1">
                    {field.label}
                  </label>
                  <input
                    value={field.value}
                    disabled
                    className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm bg-gray-100"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Amount
              </label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Purpose
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Payment Method
              </label>
              <div className="relative">
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm appearance-none"
                  disabled={isLoading}
                >
                  <option value="">Select Payment Method</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="transfer">Transfer</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-custom-black">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Payment Type
              </label>
              <div className="relative">
                <select
                  name="payment_type"
                  value={formData.payment_type}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm appearance-none"
                  disabled={isLoading}
                >
                  <option value="">Select Payment Type</option>
                  <option value="half payment">Half Payment</option>
                  <option value="full payment">Full Payment</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-custom-black">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md text-sm"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModal;
