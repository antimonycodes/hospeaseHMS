import { useEffect, useState } from "react";
import { useCombinedStore } from "../store/super-admin/useCombinedStore";
import Loader from "../Shared/Loader";
import { FaMoneyBill, FaEdit, FaTimes } from "react-icons/fa";
import { useRole } from "../hooks/useRole";
import Button from "../Shared/Button";
import toast from "react-hot-toast";
import { useFinanceStore } from "../store/staff/useFinanceStore";

const Bills = () => {
  const { getAllBills, bills, isLoading, updateBill } = useCombinedStore();
  const { updatePayment } = useFinanceStore();
  const role = useRole();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  type BillType = {
    id: string | number;
    attributes: {
      name: string;
      amount: string;
      patient?: {
        id: string | number;
        first_name?: string;
        last_name?: string;
      };
      created_by: { first_name?: string; last_name?: string };
      created_at: string;
      finance_id?: string | number;
    };
  };
  const [currentBill, setCurrentBill] = useState<BillType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
  });

  useEffect(() => {
    getAllBills();
  }, [getAllBills]);

  const handleEditClick = (bill: any) => {
    setCurrentBill(bill);
    setFormData({
      name: bill.attributes.name,
      amount: bill.attributes.amount.replace(/,/g, ""),
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.amount) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      // First update the bill
      const response = await updateBill(currentBill?.id, {
        name: formData.name,
        amount: formData.amount,
        patient_id: currentBill?.attributes?.patient?.id,
      });

      if (response) {
        // toast.success("Bill updated successfully");
        console.log(response);

        // Now update the payment amount using the response data
        if (response) {
          const payload = {
            total_amount: response.attributes.amount.replace(/,/g, ""),
            // amount_paid: 24,
            // payment_type: null,
            // payment_method: null,
            // amount_paid: null,
          };

          await updatePayment(currentBill?.attributes.finance_id, payload);
          // toast.success("Payment amount updated successfully");
        }

        setIsEditModalOpen(false);
      }
    } catch (error) {
      // toast.error("Failed to update bill or payment amount");
      console.error(error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  // Handle case where bills might be undefined or empty
  const billsData = bills || [];
  if (billsData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-4xl mb-4">📄</div>
        <h3 className="text-lg font-medium mb-1">No Bills Found</h3>
        <p className="text-gray-500">
          There are no doctor bills to display at the moment.
        </p>
      </div>
    );
  }

  // Calculate total amount
  const totalAmount = billsData.reduce((sum, bill) => {
    const amount = parseFloat(bill.attributes.amount.replace(/,/g, ""));
    return sum + amount;
  }, 0);

  // Format currency in Nigerian Naira
  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Doctor Bills Management</h1>
        <p className="text-gray-500">Manage and view all doctor bill records</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaMoneyBill className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Total Bills</p>
              <p className="text-xl font-bold">{billsData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaMoneyBill className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Total Amount</p>
              <p className="text-xl font-bold">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>

        {role === "doctor" && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FaMoneyBill className="text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Created By</p>
                <p className="text-xl font-bold">
                  {billsData[0]?.attributes?.created_by}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold">All Bills</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S/N
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Created
                </th>
                {role === "admin" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billsData.map((bill, index) => (
                <tr key={bill.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bill.attributes.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{bill.attributes.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bill.attributes.created_by.first_name}{" "}
                    {bill.attributes.created_by.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bill.attributes.patient?.first_name}{" "}
                    {bill.attributes.patient?.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(bill.attributes.created_at).toLocaleDateString()}
                  </td>
                  {role === "admin" && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEditClick(bill)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FaEdit />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing 1 to {billsData.length} of {billsData.length} results
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal - Implemented directly */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#1E1E1E40]  flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Edit Bill</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  disabled
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;
