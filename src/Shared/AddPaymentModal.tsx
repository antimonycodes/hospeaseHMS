import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import debounce from "lodash.debounce";
import { usePatientStore } from "../store/super-admin/usePatientStore"; // Adjust path
import { useFinanceStore } from "../store/staff/useFinanceStore"; // Adjust path

interface FormData {
  patient_id: number;
  amount: string;
  purpose: string;
  payment_method: string;
  payment_type: string;
}

interface AddPaymentModalProps {
  onClose: () => void;
  endpoint?: string;
  refreshEndpoint?: string;
}

const AddPaymentModal = ({
  onClose,
  endpoint = "/finance/save-revenue",
  refreshEndpoint = "/finance/all-revenues",
}: AddPaymentModalProps) => {
  // const { searchPatients } = useFinanceStore();
  const { createPayment, isLoading } = useFinanceStore();

  const [formData, setFormData] = useState<FormData>({
    patient_id: 0,
    amount: "",
    purpose: "",
    payment_method: "",
    payment_type: "",
  });
  const [query, setQuery] = useState("");
  const [patientOptions, setPatientOptions] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Debounced patient search
  // const handleSearch = debounce(async (val: string) => {
  //   if (val.length > 2) {
  //     // const results = await searchPatients(val);
  //     setPatientOptions(results || []);
  //   } else {
  //     setPatientOptions([]);
  //   }
  // }, 300);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "query") {
      setQuery(value);
      // handleSearch(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "patient_id" ? Number(value) : value,
      }));
    }
  };

  // Handle patient selection
  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setFormData((prev) => ({ ...prev, patient_id: patient.id }));
    setQuery(
      `${patient.attributes.first_name} ${patient.attributes.last_name}`
    );
    setPatientOptions([]);
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
    )
      return;

    const success = await createPayment(formData, endpoint, refreshEndpoint);
    if (success) {
      setFormData({
        patient_id: 0,
        amount: "",
        purpose: "",
        payment_method: "",
        payment_type: "",
      });
      setQuery("");
      setSelectedPatient(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-6">
      <div className="bg-white w-full max-w-3xl h-[90%] p-6 overflow-y-auto rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center pb-4">
          <h2 className="text-xl font-semibold">Add New Payment</h2>
          <button onClick={onClose} className="text-gray-700 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Patient Search */}
          <div className="mt-4 relative">
            <input
              type="search"
              name="query"
              value={query}
              onChange={handleChange}
              placeholder="Search patient by name or card ID..."
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
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

          {/* Patient Info */}
          {selectedPatient && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {[
                {
                  label: "Payment ID",
                  value: `PAY-${selectedPatient.id}-${Date.now()
                    .toString()
                    .slice(-6)}`,
                }, // Example Payment ID
                {
                  label: "Patient’s First Name",
                  value: selectedPatient.attributes.first_name,
                },
                {
                  label: "Patient’s Last Name",
                  value: selectedPatient.attributes.last_name,
                },
              ].map((field, i) => (
                <div key={i}>
                  <label className="text-sm text-gray-600">{field.label}</label>
                  <input
                    value={field.value}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-3 py-4 bg-gray-100"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Payment Details */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-4"
                  placeholder="Enter amount"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Purpose</label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-4"
                  placeholder="Enter payment purpose"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Payment Method</label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-4"
                  disabled={isLoading}
                >
                  <option value="">Select Payment Method</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Payment Type</label>
                <select
                  name="payment_type"
                  value={formData.payment_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-4"
                  disabled={isLoading}
                >
                  <option value="">Select Payment Type</option>
                  <option value="half payment">Half Payment</option>
                  <option value="full payment">Full Payment</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition"
              disabled={isLoading}
            >
              {isLoading ? "Adding Payment..." : "Add Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModal;
