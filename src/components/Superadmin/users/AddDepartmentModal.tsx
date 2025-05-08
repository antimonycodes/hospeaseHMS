import { X } from "lucide-react";
import { useState } from "react";
import Button from "../../../Shared/Button";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";

interface formData {
  email: string;
  last_name: string;
  first_name: string;
}

const AddDepartmentModal = ({
  onClose,
}: {
  onClose: (value: boolean) => void;
}) => {
  const [formData, setFormData] = useState<formData>({
    email: "",
    last_name: "",
    first_name: "",
  });
  const { createSubAdmin, isLoading } = useGlobalStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createSubAdmin(formData);
    onClose(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1E1E1E40] px-6 ">
      <div className="bg-white w-full max-w-3xl p-6 shadow-lg h-fit overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-4">
          <h2 className="text-lg font-semibold">Add New Admin</h2>
          <button onClick={() => onClose(false)} className="text-black">
            <X size={20} />
          </button>
        </div>
        {/* form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-custom-black mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                placeholder="Doe"
                required
              />
            </div>
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-custom-black mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-custom-black mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                placeholder="johndoe@example.com"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Staff"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartmentModal;
