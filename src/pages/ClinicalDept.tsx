import { useState, useEffect, useRef } from "react";
import Button from "../Shared/Button";
import { XIcon } from "lucide-react";
import { useGlobalStore } from "../store/super-admin/useGlobal";
import toast from "react-hot-toast";
import Modal from "../Shared/Modal";
import Loader from "../Shared/Loader";

const ClinicalDept = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoading, getClinicaldept, clinicaldepts, createClinicaldept } =
    useGlobalStore();
  const clinicaldepNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // if (!branches?.length) {
    getClinicaldept();
    // }
  }, [getClinicaldept]);

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();

    const branchName = clinicaldepNameRef.current?.value.trim();
    if (branchName) {
      const newBranchData = { name: branchName };
      const result = await createClinicaldept(newBranchData);
      if (result) {
        clinicaldepNameRef.current!.value = "";
        setIsModalOpen(false);
      }
      console.log(newBranchData);
    } else {
      toast.error("Department name cannot be empty");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h1 className="text-base md:text-xl lg:text-2xl font-semibold text-primary">
          Clinical Departments
        </h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Add Department
        </Button>
      </div>

      {/* Branch List */}
      <div className="space-y-4">
        {clinicaldepts?.length > 0 ? (
          clinicaldepts.map((branch, index) => (
            <div
              key={index}
              className="flex justify-between items-center px-4 py-2 border border-gray-200 rounded-lg "
            >
              <span className="text-gray-700">{branch.attributes.name}</span>
            </div>
          ))
        ) : (
          <Loader />
        )}
      </div>

      {/* Modal for Adding Branch */}
      {isModalOpen && (
        // <Modal onClose={() => setIsModalOpen(false)}>
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg custom-shadow overflow-y-auto w-full max-w-2xl h-fit">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Add Department
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddBranch}>
                <div className="mb-4">
                  <input
                    id="branchName"
                    type="text"
                    ref={clinicaldepNameRef} // Assign the ref to the input field
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter department name"
                  />
                </div>
                <div className="flex justify-end">
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add department"}
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

export default ClinicalDept;
