import { useState } from "react";
import Button from "../../../Shared/Button";
import { Plus, Search } from "lucide-react";
import AdministratorTable from "./AdministratorTable";
import DepartmentTable from "./DepartmentTable";
import AddDepartmentModal from "./AddDepartmentModal";

const SaUsersPage = () => {
  const [activeTab, setActiveTab] = useState<"Department" | "Administrator">(
    "Department"
  );
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<"Department" | "Administrator">(
    "Department"
  );

  const handleOpenModal = () => {
    setModalType(activeTab === "Department" ? "Department" : "Administrator");
    setOpenModal(true);
  };
  return (
    <div className=" rounded-lg custom-shadow bg-white p-4">
      <div className="flex flex-col-reverse md:flex-row  mb-4">
        {/* btns */}
        <div className=" flex">
          <button
            className={`px-4 py-2 mr-2 font-semibold ${
              activeTab === "Department"
                ? "text-primary border-b-2 border-primary"
                : "text-[#667185]"
            }`}
            onClick={() => setActiveTab("Department")}
          >
            Department
          </button>
          <button
            className={`px-4 py-2 font-semibold  ${
              activeTab === "Administrator"
                ? "text-primary border-b-2 border-primary"
                : "text-[#667185]"
            }`}
            onClick={() => setActiveTab("Administrator")}
          >
            Administrator
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
      {activeTab === "Administrator" ? (
        <AdministratorTable />
      ) : (
        <DepartmentTable />
      )}

      {/* modals */}
      {openModal && modalType === "Department" && (
        <AddDepartmentModal onclose={() => setOpenModal(false)} />
      )}
    </div>
  );
};

export default SaUsersPage;
