import { useState, useEffect, useRef } from "react";
import Button from "../Shared/Button";
import { XIcon, PlusCircle, Loader2, Edit, Trash2 } from "lucide-react";
import { useGlobalStore } from "../store/super-admin/useGlobal";
import toast from "react-hot-toast";
import Modal from "../Shared/Modal";
import Loader from "../Shared/Loader";

const Branch = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<{
    id: string;
    attributes: { name: string; total_patient?: number };
  } | null>(null);
  const {
    isLoading,
    getBranches,
    createBranch,
    branches,
    updateBranch,
    deleteBranch,
  } = useGlobalStore();
  const branchNameRef = useRef<HTMLInputElement>(null);
  const editBranchNameRef = useRef<HTMLInputElement>(null);

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
        setIsAddModalOpen(false);
      }
    } else {
      toast.error("Branch name cannot be empty");
    }
  };

  const handleUpdateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    const branchName = editBranchNameRef.current?.value.trim();
    if (!branchName) {
      toast.error("Branch name cannot be empty");
      return;
    }

    if (selectedBranch) {
      const updateData = { name: branchName };
      const result = await updateBranch(selectedBranch.id, updateData);
      if (result) {
        setIsEditModalOpen(false);
        setSelectedBranch(null);
      }
    }
  };

  const handleDeleteBranch = async () => {
    if (selectedBranch) {
      const result = await deleteBranch(selectedBranch.id);
      if (result) {
        setIsDeleteModalOpen(false);
        setSelectedBranch(null);
      }
    }
  };

  const openEditModal = (branch: any) => {
    setSelectedBranch(branch);
    setIsEditModalOpen(true);
    // Use setTimeout to ensure the modal is rendered before setting the value
    setTimeout(() => {
      if (editBranchNameRef.current) {
        editBranchNameRef.current.value = branch.attributes.name;
      }
    }, 0);
  };

  const openDeleteModal = (branch: any) => {
    setSelectedBranch(branch);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="branch-tab bg-white rounded-lg shadow-lg p-6">
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
          onClick={() => setIsAddModalOpen(true)}
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
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => openEditModal(branch)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit Branch"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(branch)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Branch"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
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
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Branch
                </h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
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

      {/* Modal for Editing Branch */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Edit Branch</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleUpdateBranch}>
                <div className="mb-6">
                  <label
                    htmlFor="editBranchName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Branch Name
                  </label>
                  <input
                    id="editBranchName"
                    type="text"
                    ref={editBranchNameRef}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter branch name"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="min-w-24"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isLoading}
                    className="min-w-24"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating</span>
                      </div>
                    ) : (
                      "Update"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Deleting Branch */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Delete Branch
                </h2>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-700">
                  Are you sure you want to delete this branch? This action
                  cannot be undone.
                </p>
                {selectedBranch && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="font-medium">
                      Branch:{" "}
                      <span className="text-gray-700">
                        {selectedBranch.attributes.name}
                      </span>
                    </p>
                    {(selectedBranch.attributes.total_patient ?? 0) > 0 && (
                      <p className="text-red-500 mt-2 text-sm">
                        Warning: This branch has{" "}
                        {selectedBranch.attributes.total_patient} patient(s)
                        associated with it.
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="min-w-24"
                >
                  Cancel
                </Button>
                <Button
                  variant="delete"
                  type="button"
                  onClick={handleDeleteBranch}
                  disabled={isLoading}
                  className="min-w-24"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Deleting</span>
                    </div>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branch;
