import { useState } from "react";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import { X } from "lucide-react";
// import { XMarkIcon } from "@heroicons/react/24/outline";

type AddSourceModalProps = {
  onClose: () => void;
};

const AddSourceModal = ({ onClose }: AddSourceModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { createPaymentSource, isLoading } = useFinanceStore();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Source name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await createPaymentSource(formData);
      onClose();
    } catch (error) {
      console.error("Error adding payment source:", error);
      setErrors((prev) => ({
        ...prev,
        general: "Failed to add payment source. Please try again.",
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-[#1E1E1E40]">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 ">
          <h2 className="text-lg font-medium">Add New Payment Source</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {errors.general && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {errors.general}
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1 font-medium">Source Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter source name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-white bg-primary rounded  disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSourceModal;
