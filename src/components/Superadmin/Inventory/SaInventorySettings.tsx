// SaInventorySettings.tsx
import { JSX, useEffect, useState } from "react";
import { useInventoryStore } from "../../Inventory/overview/useInventoryStore";
import { Edit, Loader, Loader2, Trash2, XIcon } from "lucide-react";
import Table from "../../../Shared/Table";
import Button from "../../../Shared/Button";
import toast from "react-hot-toast";

type StockData = {
  item_name: string;
  id: number;
};

type Columns = {
  key: keyof StockData | "actions";
  label: string;
  render?: (value: any, stocks: StockData) => JSX.Element;
};

type SaInventoryStockProps = {
  isLoading: boolean;
  categorys: {
    attributes: {
      name: string;
    };
    id: number;
  }[];
};

const SaInventorySettings = ({
  categorys,
  isLoading,
}: SaInventoryStockProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItem, setEditItem] = useState<StockData | null>(null);
  const [formData, setFormData] = useState({
    item_name: "",
    id: 0,
  });

  const { updateSaCategory, deleteCategory } = useInventoryStore();

  const formattedStocks = (categorys || []).map((category) => ({
    id: category.id,
    item_name: category.attributes.name,
  }));

  const columns: Columns[] = [
    {
      key: "item_name",
      label: "Category Name",
      render: (_, category) => <span>{category.item_name}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex justify-center gap-3">
          <button
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => handleEdit(row)}
          >
            <Edit className="w-5 h-5" />
          </button>
          {/* <button
            className="text-red-600 hover:text-red-900"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="w-5 h-5" />
          </button> */}
        </div>
      ),
    },
  ];

  const resetForm = () => {
    setFormData({
      item_name: "",
      id: 0,
    });
    setIsEditMode(false);
    setEditItem(null);
    setIsModalOpen(false);
  };

  const handleEdit = (category: StockData) => {
    setIsEditMode(true);
    setEditItem(category);
    setFormData({
      item_name: category.item_name,
      id: category.id,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const success = await deleteCategory(id);
      if (success) {
        toast.success("Category deleted successfully");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.item_name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const categoryData = {
      name: formData.item_name,
    };

    const result =
      isEditMode && editItem
        ? await updateSaCategory(editItem.id, categoryData)
        : await createCategory(categoryData);

    if (result) {
      toast.success(
        isEditMode
          ? "Category updated successfully"
          : "Category added successfully"
      );
      resetForm();
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <Table
        data={formattedStocks}
        columns={columns}
        rowKey="id"
        loading={isLoading}
      />
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {isEditMode ? "Edit Category" : "Add New Category"}
                </h2>
                <button onClick={resetForm}>
                  <XIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="item_name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category Name
                  </label>
                  <input
                    type="text"
                    name="item_name"
                    value={formData.item_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
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
                      "Update Category"
                    ) : (
                      "Add Category"
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

export default SaInventorySettings;
function createCategory(categoryData: { name: string }) {
  throw new Error("Function not implemented.");
}
