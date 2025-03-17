import { useState } from "react";
import DoctorsTable from "./ConsultantTable";
import AddDoctorModal from "../../../Shared/AddDoctorModal";
import Button from "../../../Shared/Button";
import { Plus } from "lucide-react";

const SaConsultantPage = () => {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    religion: "",
    houseAddress: "",
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
    <div className="  rounded-lg custom-shadow bg-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Consultants{" "}
          <span className="text-[#6941C6] bg-[#F9F5FF] py-1 px-4 rounded-full text-sm">
            {/* {doctors.length} */}
          </span>
        </h1>
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

      <DoctorsTable />

      {/* Add Doctor Modal */}
      {showModal && (
        <AddDoctorModal
          formData={formData}
          handleInputChange={handleInputChange}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default SaConsultantPage;
