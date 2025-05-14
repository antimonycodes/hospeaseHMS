import { useState, useEffect } from "react";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import {
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import SourceModal from "./SourceModal";
// import SourceModal from "./SourceModal";

type Pagination = {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
};

type Source = {
  id: string;
  attributes: {
    name: string;
    description: string;
    status: "active" | "inactive";
    created_at: string;
  };
};

const FsettingsTable = () => {
  const { getPaymentSource, deletePaymentSource, paymentSources, isLoading } =
    useFinanceStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sourceToEdit, setSourceToEdit] = useState<Source | null>(null);

  useEffect(() => {
    getPaymentSource();
  }, [getPaymentSource]);

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this payment source?")
    ) {
      try {
        await deletePaymentSource(id);
      } catch (error) {
        console.error("Error deleting payment source:", error);
      }
    }
  };

  const handleEdit = (source: Source) => {
    setSourceToEdit(source);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSourceToEdit(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSourceToEdit(null);
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mt-4">
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading payment sources...</p>
          </div>
        ) : !paymentSources || paymentSources.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No payment sources found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentSources.map((source) => (
                    <tr key={source.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {source.attributes.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(source.attributes.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(source)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(source.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <SourceModal onClose={handleCloseModal} sourceToEdit={sourceToEdit} />
      )}
    </div>
  );
};

export default FsettingsTable;
