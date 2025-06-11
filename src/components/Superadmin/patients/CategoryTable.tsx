import { useEffect, useState } from "react";
import { useCombinedStore } from "../../../store/super-admin/useCombinedStore";
import Button from "../../../Shared/Button";
import { Edit, Loader2, PlusCircle, Trash2 } from "lucide-react";
// import DeleteCategoryModal from "./deleteCategoryModal";
import AddCategoryModal from "./AddCategoryModal";
import DeleteCategoryModal from "./deleteCategoryModal";
// import DeleteCategoryModal from "./DeleteCategoryModal";

interface Category {
  id: string;
  attributes: {
    name: string;
    total_patient?: number;
  };
}

const CategoryTable = () => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const { getAllCategory, isLoading, categories } = useCombinedStore();
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    getAllCategory();
  }, [getAllCategory]);

  const openAddModal = () => {
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setIsEditMode(true);

    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsCategoryModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
    setIsEditMode(false);
  };

  return (
    <div className="branch-tab bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-primary">
            Categories
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all patients category
          </p>
        </div>
        <Button
          variant="primary"
          onClick={openAddModal}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Category Table */}
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
                Category Name
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
            {!isLoading && categories?.length > 0 ? (
              categories.map((category, index) => (
                <tr
                  key={category.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {category.attributes.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {category.attributes.total_patient || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => openEditModal(category)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit category"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(category)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete category"
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
                      <span>Loading categories...</span>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Add new category to get started
                    </p>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={closeModals}
        category={selectedCategory}
        isEditMode={isEditMode}
      />

      {isDeleteModalOpen && selectedCategory && (
        <DeleteCategoryModal
          category={selectedCategory}
          onClose={closeModals}
        />
      )}
    </div>
  );
};

export default CategoryTable;
