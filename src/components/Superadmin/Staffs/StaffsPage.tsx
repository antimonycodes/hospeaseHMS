import { Plus } from "lucide-react";
import Button from "../../../Shared/Button";
import { useEffect, useState } from "react";
import AddStaffModal from "./AddStaffModal";
import {
  useGlobalStore,
  CreateStaff,
} from "../../../store/super-admin/useGlobal";
import StaffsList from "./StaffsList";

interface StaffsPageProps {
  department: string;
}

const StaffsPage: React.FC<StaffsPageProps> = ({ department }) => {
  const [showModal, setShowModal] = useState(false);
  const {
    createStaff,
    isLoading,
    isStaffLoading,
    getDeptStaffs,
    staffs,
    pagination,
  } = useGlobalStore();

  const {
    getAllRoles,
    roles,
  }: { getAllRoles: () => void; roles: Record<string, any> } = useGlobalStore();

  useEffect(() => {
    getAllRoles();
  }, [getAllRoles]);

  console.log(department);

  console.log(roles, "roles");

  const [formData, setFormData] = useState<CreateStaff>({
    first_name: "",
    email: "",
    last_name: "",
    phone: "",
  });

  useEffect(() => {
    getDeptStaffs(
      department.toLowerCase() === "pharmacy"
        ? "Pharmacist"
        : department.toString().toLowerCase()
    );
  }, [getDeptStaffs, department]);

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

      {/* table */}
      <StaffsList
        staffs={staffs}
        isStaffLoading={isStaffLoading}
        pagination={pagination}
        getDeptStaffs={getDeptStaffs}
      />

      {/* Add Staff Modal */}
      {showModal && (
        <AddStaffModal
          formData={formData}
          handleInputChange={handleInputChange}
          setShowModal={setShowModal}
          createStaff={createStaff}
          isLoading={isLoading}
          department={department}
          roles={roles}
        />
      )}
    </div>
  );
};

export default StaffsPage;
