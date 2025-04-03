import { Plus } from "lucide-react";
import Button from "../../../Shared/Button";
import { useState } from "react";
import AddStaffModal from "./AddStaffModal";
import {
  useGlobalStore,
  CreateStaff,
} from "../../../store/super-admin/useGlobal";

interface StaffsPageProps {
  department: string;
}

const StaffsPage: React.FC<StaffsPageProps> = ({ department }) => {
  const [showModal, setShowModal] = useState(false);
  const { createStaff, isLoading } = useGlobalStore();

  const [formData, setFormData] = useState<CreateStaff>({
    name: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="w-full rounded-lg custom-shadow bg-white p-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">
            {department.charAt(0).toUpperCase() + department.slice(1)}
          </h1>
        </div>
        {/* Add Button */}
        <div className="md:w-auto">
          <Button
            onClick={() => setShowModal(true)}
            variant="primary"
            size="md"
            className="flex items-center gap-2 px-4"
          >
            Add new
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <AddStaffModal
          formData={formData}
          handleInputChange={handleInputChange}
          setShowModal={setShowModal}
          createStaff={createStaff}
          isLoading={isLoading}
          department={department}
        />
      )}
    </div>
  );
};

export default StaffsPage;
