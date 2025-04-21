import { Plus } from "lucide-react";
import Button from "../../../Shared/Button";
import { useEffect, useState } from "react";
// import StaffModal from "./StaffModal";
import {
  useGlobalStore,
  CreateStaff,
} from "../../../store/super-admin/useGlobal";
import StaffsList from "./StaffsList";
import AddStaffModal from "./AddStaffModal";

interface StaffsPageProps {
  department: string;
}

const StaffsPage: React.FC<StaffsPageProps> = ({ department }) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStaffId, setCurrentStaffId] = useState<number | undefined>(
    undefined
  );

  const {
    createStaff,
    updateStaff,
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

  const openAddModal = () => {
    setFormData({
      first_name: "",
      email: "",
      last_name: "",
      phone: "",
    });
    setIsEditing(false);
    setCurrentStaffId(undefined);
    setShowModal(true);
  };

  const openEditModal = (staff: any) => {
    setFormData({
      first_name: staff.first_name,
      email: staff.email,
      last_name: staff.last_name,
      phone: staff.phone,
    });
    setIsEditing(true);
    setCurrentStaffId(staff.id);
    setShowModal(true);
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
            onClick={openAddModal}
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
        // onEditStaff={openEditModal}
      />

      {/* Staff Modal (Add/Edit) */}
      {showModal && (
        <AddStaffModal
          formData={formData}
          handleInputChange={handleInputChange}
          setShowModal={setShowModal}
          createStaff={createStaff}
          updateStaff={updateStaff}
          isLoading={isLoading}
          department={department}
          isEditing={isEditing}
          staffId={currentStaffId}
          // roles={roles}
        />
      )}
    </div>
  );
};

export default StaffsPage;
