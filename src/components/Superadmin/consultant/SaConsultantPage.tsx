import { useEffect, useState } from "react";
import DoctorsTable from "./ConsultantTable";
import AddDoctorModal from "../../../Shared/AddDoctorModal";
import Button from "../../../Shared/Button";
import { Plus } from "lucide-react";
import { useDoctorStore } from "../../../store/super-admin/useDoctorStore";
import ConsultantTable from "./ConsultantTable";
import { generateSixDigitId } from "../../../utils/randomNumber";

const SaConsultantPage = () => {
  const [showModal, setShowModal] = useState(false);
  const createConsultant = useDoctorStore((state) => state.createConsultant);
  const { getAllConsultants, consultants, createDoctor, isLoading } =
    useDoctorStore();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    religion: "",
    houseAddress: "",
    consultant_id: null,
    department_id: 0,
  });

  useEffect(() => {
    getAllConsultants();
  }, []);

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
        <div className="  flex items-center gap-">
          <h1 className="text-xl font-semibold text-gray-900">Consultants</h1>
          <span className="bg-[#F9F5FF] py-1 px-4 rounded-full text-[#6941C6] font-medium">
            {consultants.length}
          </span>
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

      <ConsultantTable consultants={consultants} isLoading={isLoading} />

      {/* Add Doctor Modal */}
      {showModal && (
        <AddDoctorModal
          formData={formData}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          setShowModal={setShowModal}
          createConsultant={createConsultant}
          createDoctor={createDoctor}
        />
      )}
    </div>
  );
};

export default SaConsultantPage;
