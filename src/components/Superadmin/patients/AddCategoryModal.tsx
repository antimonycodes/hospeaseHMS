import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useCombinedStore } from "../../../store/super-admin/useCombinedStore";

interface Category {
  id: string;
  attributes: {
    name: string;
    total_patient?: number;
  };
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  isEditMode: boolean;
}

const AddCategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category = null,
  isEditMode,
}) => {
  const [name, setName] = useState("");
  console.log(isEditMode);

  const {
    createPatientCategory,
    updatePatientsCategory,
    getAllCategory, // Add this to refresh data
    isLoading,
  } = useCombinedStore();

  // Set initial value when modal opens or category changes
  useEffect(() => {
    if (isOpen) {
      setName(category?.attributes?.name || "");
    }
  }, [isOpen, category]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted:", { isEditMode, category, name });

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    // Check if nothing changed in edit mode
    if (isEditMode && name.trim() === category?.attributes?.name) {
      toast.error("No changes made");
      return;
    }

    try {
      let success = false;

      if (isEditMode && category) {
        console.log("Updating category:", category.id, { name: name.trim() });

        // Update existing category
        success = await updatePatientsCategory(category.id, name.trim()); // ✅ FIXED

        console.log("Update result:", success);

        if (success) {
          toast.success("Category updated successfully!");
          // Refresh the categories list
          await getAllCategory();
        } else {
          toast.error("Failed to update category");
        }
      } else {
        console.log("Creating new category:", { name: name.trim() });

        // Create new category
        success = await createPatientCategory({ name: name.trim() });

        console.log("Create result:", success);

        if (success) {
          toast.success("Category created successfully!");
          // Refresh the categories list
          await getAllCategory();
        } else {
          toast.error("Failed to create category");
        }
      }

      if (success) {
        setName(""); // Reset input
        onClose(); // Close modal
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="p-4 md:p-12">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-lg font-semibold text-custom-black">
                {isEditMode ? "Edit Category" : "Add New Category"}
              </h2>
              <button type="button" onClick={onClose}>
                <X className="text-black" />
              </button>
            </div>

            {/* Debug info - remove this in production */}
            {/* {process.env.NODE_ENV === "development" && (
              <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                <p>Debug: Mode: {isEditMode ? "Edit" : "Add"}</p>
                {category && <p>Category ID: {category.id}</p>}
                <p>Current name: {name}</p>
                <p>Original name: {category?.attributes?.name}</p>
              </div>
            )} */}

            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter category name"
                required
                autoFocus
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md text-sm disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                disabled={isLoading || !name.trim()}
              >
                {isLoading
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                  ? "Update"
                  : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
