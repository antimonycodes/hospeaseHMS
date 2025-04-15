import { useState, useEffect, useRef } from "react";
import Button from "../Shared/Button";
import { XIcon, PlusCircle, Loader2 } from "lucide-react";
import { useGlobalStore } from "../store/super-admin/useGlobal";
import toast from "react-hot-toast";
import Modal from "../Shared/Modal";
import Loader from "../Shared/Loader";

const Branch = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoading, getBranches, createBranch, branches } = useGlobalStore();
  const branchNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getBranches();
  }, [getBranches]);

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    const branchName = branchNameRef.current?.value.trim();
    if (branchName) {
      const newBranchData = { name: branchName };
      const result = await createBranch(newBranchData);
      if (result) {
        branchNameRef.current!.value = "";
        setIsModalOpen(false);
      }
    } else {
      toast.error("Branch name cannot be empty");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-primary">
            Branches
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all hospital branches
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Branch</span>
        </Button>
      </div>

      {/* Branch Table */}
      <div className="overflow-x-auto mt-6 rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
              >
                S/N
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Branch Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                No. of Patients
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!isLoading && branches?.length > 0 ? (
              branches.map((branch, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {branch.attributes.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {branch.attributes.total_patient || 0}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <Loader2 className="w-6 h-6 text-primary animate-spin mr-2" />
                      <span>Loading branches</span>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Add new branch to get started
                    </p>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding Branch */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6 ">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Branch
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddBranch}>
                <div className="mb-6">
                  <label
                    htmlFor="branchName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Branch Name
                  </label>
                  <input
                    id="branchName"
                    type="text"
                    ref={branchNameRef}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter branch name"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isLoading}
                    className="min-w-24"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Adding</span>
                      </div>
                    ) : (
                      "Add Branch"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branch;
