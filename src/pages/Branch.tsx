import { useState, useEffect, useRef } from "react";
import Button from "../Shared/Button";
import { XIcon } from "lucide-react";
import { useGlobalStore } from "../store/super-admin/useGlobal";
import toast from "react-hot-toast";
import Modal from "../Shared/Modal";

const Branch = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoading, getBranches, createBranch, branches } = useGlobalStore();
  const branchNameRef = useRef<HTMLInputElement>(null); // Use ref to manage input field

  useEffect(() => {
    // if (!branches?.length) {
    getBranches(); // Fetch branches if they are not already fetched
    // }
  }, [getBranches]);

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form from reloading the page

    const branchName = branchNameRef.current?.value.trim();
    if (branchName) {
      const newBranchData = { name: branchName };
      const result = await createBranch(newBranchData);
      if (result) {
        branchNameRef.current!.value = ""; // Clear the input field after adding
        setIsModalOpen(false); // Close the modal
      }
      console.log(newBranchData);
    } else {
      toast.error("Branch name cannot be empty");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-primary">Branches</h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Add Branch
        </Button>
      </div>

      {/* Branch List */}
      <div className="space-y-4">
        {branches?.length > 0 ? (
          branches.map((branch, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
            >
              <span className="text-gray-700">{branch.attributes.name}</span>
            </div>
          ))
        ) : (
          <p>No branches found</p>
        )}
      </div>

      {/* Modal for Adding Branch */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Add Branch
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                {/* <XIcon className="w-6 h-6" /> */}
              </button>
            </div>
            <form onSubmit={handleAddBranch}>
              <div className="mb-4">
                <input
                  id="branchName"
                  type="text"
                  ref={branchNameRef} // Assign the ref to the input field
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter branch name"
                />
              </div>
              <div className="flex justify-end">
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Branch"}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Branch;
