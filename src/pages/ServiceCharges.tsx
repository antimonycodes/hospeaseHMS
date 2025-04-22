import { useState, useEffect } from "react";
import Button from "../Shared/Button";
import { XIcon, PlusCircle, Loader2, Edit, Trash2 } from "lucide-react";
import { useGlobalStore } from "../store/super-admin/useGlobal";
import toast from "react-hot-toast";
import Loader from "../Shared/Loader";
import { useCombinedStore } from "../store/super-admin/useCombinedStore";

interface Item {
  id: number;
  attributes: {
    name: string;
    price: number;
    amount: number;
    department: {
      name: string;
      id: number;
    };
  };
}

interface Role {
  id: number;
  role: string;
}

interface RolesState {
  [key: string]: Role;
}

const ServiceCharges = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    departmentId: "",
  });

  const {
    isLoading,
    isDeleting,
    createItem,
    getAllItems,
    updateItem,
    deleteItem,
    items,
  } = useCombinedStore();
  const { getAllRoles } = useGlobalStore();
  const roles = useGlobalStore((state) => state.roles) as RolesState;

  const allowedDepartments = ["pharmacist", "laboratory", "finance"];

  // Map for department display names
  const departmentDisplayNames = {
    pharmacist: "Pharmacy",
    laboratory: "Laboratory",
    finance: "Others",
  };

  const getDepartmentOptions = () => {
    if (!roles) return [];

    return allowedDepartments
      .filter((dept) => roles[dept])
      .map((dept) => ({
        id: roles[dept]?.id.toString(),
        name:
          departmentDisplayNames[dept as keyof typeof departmentDisplayNames] ||
          dept.charAt(0).toUpperCase() + dept.slice(1),
      }));
  };

  const departmentOptions = getDepartmentOptions();

  useEffect(() => {
    getAllItems();
    getAllRoles();
  }, [getAllItems, getAllRoles]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const { name, price, departmentId } = formData;

    if (!name || !price || !departmentId) {
      toast.error("Name, price, and department are required");
      return;
    }

    const itemData = {
      name,
      amount: parseFloat(price),
      department_id: parseInt(departmentId),
    };

    let result;
    if (isEditMode && editItem) {
      result = await updateItem(editItem.id, itemData);
      if (result) toast.success("Item updated successfully");
    } else {
      result = await createItem(itemData);
      if (result) toast.success("Item added successfully");
    }

    if (result) {
      resetForm();
      setIsModalOpen(false);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const result = await deleteItem(id);
      if (result) {
        toast.success("Item deleted successfully");
        getAllItems(); // Refresh the list after deletion
      }
    }
  };

  const openEditModal = (item: Item) => {
    setEditItem(item);

    // Find department ID
    const departmentId = item.attributes.department.id;

    setFormData({
      name: item.attributes.name,
      price: (item.attributes.amount || item.attributes.price).toString(),
      departmentId: departmentId.toString(),
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditItem(null);
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      departmentId: "",
    });
  };

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  // Get department display name by ID
  const getDepartmentDisplayName = (departmentId: number) => {
    const department = Object.values(roles || {}).find(
      (role) => role.id === departmentId
    );

    if (!department) return "Unknown";

    // Map the department role to its display name
    const roleName = department.role;
    return (
      departmentDisplayNames[roleName as keyof typeof departmentDisplayNames] ||
      roleName.charAt(0).toUpperCase() + roleName.slice(1)
    );
  };

  if (isLoading) return <Loader />;
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-primary">
            Services & Charges
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all billable items and services
          </p>
        </div>
        <Button
          variant="primary"
          onClick={openAddModal}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Item</span>
        </Button>
      </div>

      {/* Items Table */}
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
                Item Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Department
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!isLoading && items?.length > 0 ? (
              items.map((item, index) => {
                // Get the role name from department and map to display name
                const deptRole = item.attributes.department.name?.toLowerCase();
                const deptDisplayName =
                  departmentDisplayNames[
                    deptRole as keyof typeof departmentDisplayNames
                  ] || item.attributes.department.name;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.attributes.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₦{item.attributes.amount || item.attributes.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {deptDisplayName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <Loader2 className="w-6 h-6 text-primary animate-spin mr-2" />
                      <span>Loading items</span>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Add new items to get started
                    </p>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {isEditMode ? "Edit Item" : "Add New Item"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Item/Service Name*
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter name"
                    autoFocus
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Price*
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter price"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="departmentId"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Department*
                  </label>
                  <select
                    id="departmentId"
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 outline-none focus:ring-primary focus:border-primary bg-white"
                  >
                    <option value="">Select Department</option>
                    {departmentOptions.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsModalOpen(false)}
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
                        <span>{isEditMode ? "Updating" : "Adding"}</span>
                      </div>
                    ) : isEditMode ? (
                      "Update Item"
                    ) : (
                      "Add Item"
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

export default ServiceCharges;
