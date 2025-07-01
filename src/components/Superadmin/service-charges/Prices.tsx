import { useState, useEffect, useCallback, useMemo } from "react";
import {
  X,
  PlusCircle,
  Loader2,
  Edit,
  Trash2,
  AlertTriangle,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCombinedStore } from "../../../store/super-admin/useCombinedStore";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import Loader from "../../../Shared/Loader";
import Button from "../../../Shared/Button";
import Table from "../../../Shared/Table";

interface Item {
  id: number;
  index: number;
  actions: string;
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

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T, index?: number) => React.ReactNode;
}

const allowedDepartments = ["pharmacist", "laboratory", "finance"];

const departmentDisplayNames: Record<string, string> = {
  pharmacist: "Pharmacy",
  laboratory: "Laboratory",
  finance: "Others",
};

// Debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Prices = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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
    pagination,
  } = useCombinedStore();

  const { getAllRoles } = useGlobalStore();
  const roles = useGlobalStore((state) => state.roles) as RolesState;
  const [perPage, setPerPage] = useState(pagination?.per_page || 10);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const getDepartmentOptions = () =>
    allowedDepartments
      .filter((dept) => roles[dept])
      .map((dept) => ({
        id: roles[dept].id.toString(),
        name: departmentDisplayNames[dept] || dept,
      }));

  // Fetch items with search
  const fetchItems = useCallback(
    (page = 1, search = "") => {
      setCurrentPage(page);
      getAllItems(page.toString(), perPage.toString(), search);
    },
    [getAllItems, perPage]
  );

  useEffect(() => {
    getAllRoles();
  }, [getAllRoles]);

  // Initial load
  useEffect(() => {
    fetchItems(1);
  }, [fetchItems]);

  // Search effect
  useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
      fetchItems(1, debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, fetchItems]);

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      departmentId: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    const result =
      isEditMode && editItem
        ? await updateItem(editItem.id, itemData)
        : await createItem(itemData);

    if (result) {
      toast.success(
        isEditMode ? "Item updated successfully" : "Item added successfully"
      );
      resetForm();
      setIsModalOpen(false);
      // Refresh with current search
      fetchItems(currentPage, debouncedSearchTerm);
    }
  };

  const handleDeleteItem = async (id: number) => {
    const result = await deleteItem(id);
    if (result) {
      toast.success("Item deleted successfully");
      // Refresh with current search
      fetchItems(currentPage, debouncedSearchTerm);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const openDeleteModal = (item: Item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const openEditModal = (item: Item) => {
    setEditItem(item);
    setFormData({
      name: item.attributes.name,
      price: (item.attributes.amount || item.attributes.price).toString(),
      departmentId: item.attributes.department.id.toString(),
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const columns: Column<Item>[] = [
    {
      key: "id",
      label: "S/N",
      render: (_, __, index) => (typeof index === "number" ? index + 1 : "1"),
    },
    {
      key: "name",
      label: "Item Name",
      render: (_, row) => row.attributes.name,
    },
    {
      key: "amount",
      label: "Amount",
      render: (_, row) => row.attributes.amount || row.attributes.price,
    },
    {
      key: "department",
      label: "Department",
      render: (_, row) => {
        const deptName = row.attributes.department.name.toLowerCase();
        return (
          departmentDisplayNames[deptName] || row.attributes.department.name
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => openEditModal(row)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="text-red-600 hover:text-red-900"
            disabled={isDeleting}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  const handlePageChange = useCallback(
    (page: number) => {
      fetchItems(page, debouncedSearchTerm);
    },
    [fetchItems, debouncedSearchTerm]
  );

  if (isLoading && !items?.length) return <Loader />;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-primary">
            Services & Charges
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all billable items and services
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setIsEditMode(false);
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search items by name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
          />
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            {isLoading ? "Searching..." : `Showing results for "${searchTerm}"`}
          </p>
        )}
      </div>

      <Table
        columns={columns}
        data={items || []}
        rowKey="id"
        loading={isLoading}
        pagination
        paginationData={pagination}
        onPageChange={handlePageChange}
      />

      {/* Add/Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {isEditMode ? "Edit Item" : "Add New Item"}
                </h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <div onSubmit={handleSubmit}>
                {["name", "price"].map((field) => (
                  <div key={field} className="mb-4">
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {field === "name" ? "Item/Service Name*" : "Price*"}
                    </label>
                    <input
                      id={field}
                      name={field}
                      type={field === "price" ? "number" : "text"}
                      value={(formData as any)[field]}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
                      placeholder={`Enter ${field}`}
                    />
                  </div>
                ))}
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none bg-white"
                  >
                    <option value="">Select Department</option>
                    {getDepartmentOptions().map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="min-w-24"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="min-w-24"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {isEditMode ? "Updating" : "Adding"}
                      </div>
                    ) : isEditMode ? (
                      "Update Item"
                    ) : (
                      "Add Item"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-6 text-red-600">
                <AlertTriangle className="w-8 h-8 mr-3" />
                <h2 className="text-xl font-bold">Confirm Deletion</h2>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">
                    {itemToDelete.attributes.name}
                  </span>
                  ?
                </p>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <p className="text-red-700">
                    <strong>Warning:</strong> Deleting this service charge item
                    will automatically delete the item in inventory stock and
                    pharmacy stock.
                  </p>
                </div>
                <p className="text-gray-600 text-sm">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="min-w-24"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="delete"
                  onClick={() => handleDeleteItem(itemToDelete.id)}
                  disabled={isDeleting}
                  className="min-w-24  hover:bg-red-700 hover:text-white"
                >
                  {isDeleting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </div>
                  ) : (
                    "Delete Item"
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

export default Prices;
