import { X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface AddCategoryModalProps {
  onClose: () => void;
  createEndpoint: string;
  Catendpoint?: string;
  createCategory: (
    data: { name: string },
    Catendpoint?: string,
    createEndpoint?: string
  ) => Promise<boolean>;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  Catendpoint,
  onClose,
  createCategory,
  createEndpoint,
}) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const success = await createCategory({ name }, Catendpoint, createEndpoint);
    if (success) {
      setName(""); // Reset input
      onClose(); // Close modal
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="p-4 md:p-12">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-lg font-semibold text-custom-black">
                Add New Category
              </h2>
              <button type="button" onClick={onClose}>
                <X className="text-black" />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
                placeholder="Enter category name"
                required
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md text-sm disabled:bg-gray-400"
                disabled={!name.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
