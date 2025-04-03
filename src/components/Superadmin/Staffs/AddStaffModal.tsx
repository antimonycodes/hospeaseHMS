import { X } from "lucide-react";
import Button from "../../../Shared/Button";

interface AddStaffModalProps {
  formData: {
    name: string;
    email: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShowModal: (value: boolean) => void;
  isLoading: boolean;
  createStaff: (data: any) => Promise<void>;
  department?: any;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({
  formData,
  handleInputChange,
  setShowModal,
  isLoading,
  createStaff,
  department,
}) => {
  // Define department ID and role mappings
  const getDepartmentDetails = (dept: string) => {
    const departmentMapping: Record<string, { id: number; role: string }> = {
      laboratory: { id: 5, role: "laboratory" },
      pharmacy: { id: 7, role: "pharmacist" },
      finance: { id: 11, role: "finance" },
    };

    return departmentMapping[dept.toLowerCase()] || { id: 0, role: "staff" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // Get department ID and role based on department prop
    const { id, role } = getDepartmentDetails(department);
    e.preventDefault();

    const newStaffData = {
      ...formData,
      department_id: id,
      role: role,
    };

    console.log(newStaffData);

    await createStaff(newStaffData);
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg custom-shadow overflow-y-auto w-full max-w-2xl h-[90%]">
        <div className="p-4 md:p-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-custom-black text-lg font-semibold">
              Add New Staff
            </h2>
            <button onClick={() => setShowModal(false)} className="">
              <X className="text-black" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-custom-black mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email */}
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

            {/* Submit Button */}
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

export default AddStaffModal;
