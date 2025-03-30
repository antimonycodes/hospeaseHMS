import { Plus } from "lucide-react";
import Button from "../../../Shared/Button";
import SaNurseTable from "./SaNurseTable";
import AddNurseModal from "./AddNurseModal";
import { useEffect, useState } from "react";
import { useNurseStore } from "../../../store/super-admin/useNuseStore";

const SaNursesPage = () => {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    nurse_id: "",
    email: "",
    phone: "",
    religion: "",
    address: "",
    dob: "",
  });

  useEffect(() => {
    getNurses();
  }, []);

  const { isLoading, getNurses, nurses, createNurse } = useNurseStore();

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className=" w-full rounded-lg custom-shadow bg-white p-4">
      {/* header */}
      <div className=" w-full flex items-center justify-between mb-8">
        <div className=" flex gap-2">
          {/* title */}
          <h1>Nurses</h1>
          <span>3000</span>
        </div>
        {/* add button */}
        <div className=" md:w-auto">
          <Button
            onClick={() => setShowModal(true)}
            variant="primary"
            size="md"
            // onClick={handleOpenModal}
            className="flex items-center gap-2 px-4"
          >
            Add new
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {/* table */}
      <SaNurseTable nurses={nurses} isLoading={isLoading} />

      {/* Add Doctor Modal */}
      {showModal && (
        <AddNurseModal
          formData={formData}
          handleInputChange={handleInputChange}
          setShowModal={setShowModal}
          createNurse={createNurse}
        />
      )}
    </div>
  );
};

export default SaNursesPage;
