import { Plus } from "lucide-react";
import Button from "../../../Shared/Button";
import { useEffect, useState } from "react";
import { useMatronNurse, CreateNurseData } from "./useMatronNurse";
import MatronNurseModal from "./MatronNurseModal";
import MatronNurseTable from "./MatronNurseTable";
import MatronNurseShifts from "./MatronNurseShifts"; // ← import the shift component
import SaShiftPage from "../../Superadmin/shift/SaShiftPage";

const MatronNurse = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"nurses" | "shifts">("nurses");

  const [formData, setFormData] = useState<CreateNurseData>({
    first_name: "",
    last_name: "",
    nurse_id: "",
    email: "",
    phone: "",
    religion: "",
    address: "",
    dob: "",
    age: "",
  });

  const { isLoading, getNurses, nurses, createNurse, pagination } =
    useMatronNurse();

  const baseEndpoint = "/matron/nurse/fetch";
  useEffect(() => {
    getNurses("1", "100", baseEndpoint);
  }, [getNurses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="w-full rounded-lg custom-shadow bg-white p-4">
      {/* Tabs */}
      <div className="mb-6 flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("nurses")}
          className={`pb-2 px-4 font-medium ${
            activeTab === "nurses"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500"
          }`}
        >
          Nurses
        </button>
        <button
          onClick={() => setActiveTab("shifts")}
          className={`pb-2 px-4 font-medium ${
            activeTab === "shifts"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500"
          }`}
        >
          Nurse Shifts
        </button>
      </div>

      {/* Nurses tab */}
      {activeTab === "nurses" && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900">Nurses</h1>
              <span className="bg-[#F9F5FF] py-1 px-4 rounded-full text-[#6941C6] font-medium">
                {nurses.length}
              </span>
            </div>
            {/* <Button
              icon={<Plus size={16} />}
              onClick={() => setShowModal(true)}
              text="Add Nurse"
            /> */}
          </div>

          <MatronNurseTable
            nurses={nurses}
            isLoading={isLoading}
            pagination={pagination}
            baseEndpoint={baseEndpoint}
          />
        </>
      )}

      {/* Shifts tab */}
      {activeTab === "shifts" && <SaShiftPage />}
    </div>
  );
};

export default MatronNurse;
