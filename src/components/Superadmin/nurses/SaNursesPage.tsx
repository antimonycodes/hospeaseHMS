import { Plus } from "lucide-react";
import Button from "../../../Shared/Button";
import SaNurseTable from "./SaNurseTable";
import AddNurseModal from "./AddNurseModal";
import { useState } from "react";

const SaNursesPage = () => {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nurseId: "",
    email: "",
    phone: "",
    religion: "",
    houseAddress: "",
    password: "",
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="rounded-lg custom-shadow bg-white p-4">
      {/* header */}
      <div className=" flex items-center justify-between gap-24 mb-8">
        <div className=" flex gap-2">
          {/* title */}
          <h1>Nurses</h1>
          <span>3000</span>
        </div>
        {/* add button */}
        <div className="w-full md:w-auto">
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
      <SaNurseTable />

      {/* Add Doctor Modal */}
      {showModal && (
        <AddNurseModal
          formData={formData}
          handleInputChange={handleInputChange}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default SaNursesPage;
