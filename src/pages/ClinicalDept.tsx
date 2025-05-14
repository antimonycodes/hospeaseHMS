import { useState, useEffect, useRef } from "react";
import Button from "../Shared/Button";
import { XIcon, PlusCircle, Loader2, Edit, Trash2 } from "lucide-react";
import { useGlobalStore } from "../store/super-admin/useGlobal";
import toast from "react-hot-toast";

const ClinicalDept = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  interface Department {
    id: string;
    attributes: {
      name: string;
      total_patient?: number;
    };
  }

  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const {
    isLoading,
    getClinicaldept,
    clinicaldepts,
    createClinicaldept,
    deleteClinicaldept,
    updateClinicaldept,
  } = useGlobalStore();

  const clinicaldepNameRef = useRef<HTMLInputElement>(null);
  const editDeptNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getClinicaldept();
  }, [getClinicaldept]);

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    const deptName = clinicaldepNameRef.current?.value.trim();
    if (deptName) {
      const newDeptData = { name: deptName };
      const result = await createClinicaldept(newDeptData);
      if (result) {
        clinicaldepNameRef.current!.value = "";
        setIsAddModalOpen(false);
      }
    } else {
      toast.error("Department name cannot be empty");
    }
  };

  const handleUpdateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    const deptName = editDeptNameRef.current?.value.trim();
    if (!deptName) {
      toast.error("Department name cannot be empty");
      return;
    }

    if (selectedDept) {
      const updateData = { name: deptName };
      const result = await updateClinicaldept(selectedDept.id, updateData);
      if (result) {
        setIsEditModalOpen(false);
        setSelectedDept(null);
      }
    }
  };

  const handleDeleteDept = async () => {
    if (selectedDept) {
      const result = await deleteClinicaldept(selectedDept.id);
      if (result) {
        setIsDeleteModalOpen(false);
        setSelectedDept(null);
      }
    }
  };

  const openEditModal = (dept: any) => {
    setSelectedDept(dept);
    setIsEditModalOpen(true);
    // Use setTimeout to ensure the modal is rendered before setting the value
    setTimeout(() => {
      if (editDeptNameRef.current) {
        editDeptNameRef.current.value = dept.attributes.name;
      }
    }, 0);
  };

  const openDeleteModal = (dept: any) => {
    setSelectedDept(dept);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-primary">
            Clinical Departments
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all clinical departments and patient distributions
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Department</span>
        </Button>
      </div>

      {/* Department Table */}
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
                Department Name
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
            {!isLoading && clinicaldepts?.length > 0 ? (
              clinicaldepts.map((dept, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {dept.attributes.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {dept.attributes.total_patient || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => openEditModal(dept)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit Department"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(dept)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Department"
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
                      <span>Loading departments</span>
                    </div>
                  ) : (
                    <p className="text-gray-500">No departments found</p>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding Clinical department */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6 ">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Department
                </h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddDept}>
                <div className="mb-6">
                  <label
                    htmlFor="departmentName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Department Name
                  </label>
                  <input
                    id="departmentName"
                    type="text"
                    ref={clinicaldepNameRef}
                    className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter department name"
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
                      "Add Department"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Editing Department */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Edit Department
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleUpdateDept}>
                <div className="mb-6">
                  <label
                    htmlFor="editDepartmentName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Department Name
                  </label>
                  <input
                    id="editDepartmentName"
                    type="text"
                    ref={editDeptNameRef}
                    className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter department name"
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

      {/* Modal for Deleting Department */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Delete Department
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
                  Are you sure you want to delete this department? This action
                  cannot be undone.
                </p>
                {selectedDept && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="font-medium">
                      Department:{" "}
                      <span className="text-gray-700">
                        {selectedDept.attributes.name}
                      </span>
                    </p>
                    {(selectedDept.attributes.total_patient ?? 0) > 0 && (
                      <p className="text-red-500 mt-2 text-sm">
                        Warning: This department has{" "}
                        {selectedDept.attributes.total_patient} patient(s)
                        associated with it.
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3">
                {/* <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="min-w-24"
                >
                  Cancel
                </Button> */}
                <Button
                  variant="delete"
                  type="button"
                  onClick={handleDeleteDept}
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

export default ClinicalDept;
