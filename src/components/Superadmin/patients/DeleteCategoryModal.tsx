import { X, AlertTriangle } from "lucide-react";
import React from "react";
import { useCombinedStore } from "../../../store/super-admin/useCombinedStore";

interface Category {
  id: string;
  attributes: {
    name: string;
    total_patient?: number;
  };
}

interface DeleteCategoryModalProps {
  category: Category;
  onClose: () => void;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  category,
  onClose,
}) => {
  const { deletePatientsCategory, isLoading } = useCombinedStore();

  const handleDelete = async () => {
    const success = await deletePatientsCategory(category.id);
    if (success) {
      onClose(); // Close modal
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-custom-black">
              Delete Category
            </h2>
            <button type="button" onClick={onClose}>
              <X className="text-black" />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-500">
              You are about to delete the category "{category.attributes.name}".
              {category.attributes.total_patient &&
                category.attributes.total_patient > 0 && (
                  <span className="block mt-2 text-red-600 font-medium">
                    This category has {category.attributes.total_patient}{" "}
                    patient(s) associated with it.
                  </span>
                )}
              This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;
