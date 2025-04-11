import { X } from "lucide-react";
import {
  CreateStaff,
  useGlobalStore,
} from "../../../store/super-admin/useGlobal";
import Button from "../../../Shared/Button";

interface AddStaffModalProps {
  formData: {
    email: string;
    phone: string;
    last_name: string;
    first_name: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: (value: boolean) => void;
  isLoading: boolean;
  createStaff: (data: CreateStaff, department: string) => Promise<any>;
  department: string;
  roles: Record<string, any>;
}
const AddHeadModal: React.FC<AddStaffModalProps> = ({
  formData,
  handleInputChange,
  onClose,
  isLoading,
  createStaff,
  department,
}) => {
  console.log(department);
  const roles = useGlobalStore((state) => state.roles);

  const { id, role } = roles[department];

  console.log(role, id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { id, role } = roles[department];

    const newStaffData = {
      ...formData,
      department_id: id,
      role,
    };

    await createStaff(newStaffData, role);
    onClose(false);
  };

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg custom-shadow overflow-y-auto w-full max-w-2xl h-[90%]">
        <div className="p-4 md:p-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-custom-black text-lg font-semibold">
              Add New Staff
            </h2>
            <button onClick={() => onClose(false)}>
              <X className="text-black" />
            </button>
          </div>

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
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-custom-black mb-1"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="+234 123 456 7890"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-custom-black mb-1"
                >
                  Department
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  value={department}
                  disabled
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
    </div>
  );
};

export default AddHeadModal;
