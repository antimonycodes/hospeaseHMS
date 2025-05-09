import { Plus } from "lucide-react";
import Button from "../../../Shared/Button";
import { useEffect, useState } from "react";
import { useMatronNurse, CreateNurseData } from "./useMatronNurse"; // Import CreateNurseData
import MatronNurseModal from "./MatronNurseModal";
import MatronNurseTable from "./MatronNurseTable";

const MatronNurse = () => {
  const [showModal, setShowModal] = useState(false);

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
    getNurses("1", "10", baseEndpoint);
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
      <div className="w-full flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">Nurses</h1>
          <span className="bg-[#F9F5FF] py-1 px-4 rounded-full text-[#6941C6] font-medium">
            {nurses.length}
          </span>
        </div>
        {/* <div className="md:w-auto">
          <Button
            onClick={() => setShowModal(true)}
            variant="primary"
            size="md"
            className="flex items-center gap-2 px-4"
          >
            Add new
            <Plus size={16} />
          </Button>
        </div> */}
      </div>

      <MatronNurseTable
        nurses={nurses}
        isLoading={isLoading}
        pagination={pagination}
        baseEndpoint={baseEndpoint}
      />
      {/* 
      {showModal && (
        <MatronNurseModal
          formData={formData}
          handleInputChange={handleInputChange}
          setShowModal={setShowModal}
          createNurse={createNurse}
        />
      )} */}
    </div>
  );
};

export default MatronNurse;
