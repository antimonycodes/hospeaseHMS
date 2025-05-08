import { useEffect, useState } from "react";
import Button from "../../../Shared/Button";
import { Plus, Search } from "lucide-react";
import AdministratorTable from "./AdministratorTable";
import DepartmentTable from "./DepartmentTable";
import AddDepartmentModal from "./AddDepartmentModal";
import {
  CreateStaff,
  useGlobalStore,
} from "../../../store/super-admin/useGlobal";
import AddHeadModal from "../Heads/AddHeadModal";
import StaffsList from "../Staffs/StaffsList";

const SaUsersPage = () => {
  const [activeTab, setActiveTab] = useState<
    "Matron" | "Medical-director" | "Admin"
  >("Matron");
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<
    "Matron" | "Medical-director" | "Admin"
  >("Matron");

  const [formData, setFormData] = useState<CreateStaff>({
    first_name: "",
    email: "",
    last_name: "",
    phone: "",
  });

  const department = activeTab === "Matron" ? "matron" : "medical-director";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    getDeptStaffs(department);
  }, [getDeptStaffs, department]);

  console.log(roles, "roles");

  const handleOpenModal = () => {
    setModalType(
      activeTab === "Matron"
        ? "Matron"
        : activeTab === "Medical-director"
        ? "Medical-director"
        : "Admin"
    );
    setOpenModal(true);
  };
  return (
    <div className=" rounded-lg custom-shadow bg-white p-4">
      <div className="flex flex-col-reverse md:flex-row  mb-4">
        {/* btns */}
        <div className=" flex">
          <button
            className={`px-4 py-2 mr-2 font-semibold ${
              activeTab === "Matron"
                ? "text-primary border-b-2 border-primary"
                : "text-[#667185]"
            }`}
            onClick={() => setActiveTab("Matron")}
          >
            Matron
          </button>
          <button
            className={`px-4 py-2 font-semibold  ${
              activeTab === "Medical-director"
                ? "text-primary border-b-2 border-primary"
                : "text-[#667185]"
            }`}
            onClick={() => setActiveTab("Medical-director")}
          >
            Medical-director
          </button>
          <button
            className={`px-4 py-2 font-semibold  ${
              activeTab === "Admin"
                ? "text-primary border-b-2 border-primary"
                : "text-[#667185]"
            }`}
            onClick={() => setActiveTab("Admin")}
          >
            Admin
          </button>
        </div>

        {/* Search and Add Button */}
        <div className=" w-full flex-1 flex md:flex-row items-center gap-2">
          <div className="relative w-full flex-1">
            <input
              type="text"
              placeholder="Type to search"
              className="w-full border border-gray-200 py-2 pl-10 pr-4 rounded-lg"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] size-4" />
          </div>

          <div className=" md:w-auto">
            <Button
              variant="primary"
              size="md"
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-4"
            >
              Add new
              <Plus size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* tables */}
      {activeTab === "Admin" ? (
        <AdministratorTable />
      ) : (
        <StaffsList
          staffs={staffs}
          isStaffLoading={isStaffLoading}
          pagination={pagination}
          getDeptStaffs={getDeptStaffs}
        />
      )}

      {/* modals */}
      {openModal && modalType === "Admin" && (
        <AddDepartmentModal onClose={() => setOpenModal(false)} />
      )}
      {openModal && modalType !== "Admin" && (
        <AddHeadModal
          formData={formData}
          onClose={() => setOpenModal(false)}
          department={department}
          handleInputChange={handleInputChange}
          createStaff={createStaff}
          isLoading={isLoading}
          roles={roles}
        />
      )}
    </div>
  );
};

export default SaUsersPage;
