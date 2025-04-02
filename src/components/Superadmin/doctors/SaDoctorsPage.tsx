import { useEffect, useState } from "react";
import DoctorsTable from "./DoctorsTable";
import AddDoctorModal from "../../../Shared/AddDoctorModal";
import { Plus } from "lucide-react";
import Button from "../../../Shared/Button";
import { useDoctorStore } from "../../../store/super-admin/useDoctorStore";
import { generateSixDigitId } from "../../../utils/randomNumber";

const SaDoctorsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { createDoctor, getAllDoctors, doctors, createConsultant, isLoading } =
    useDoctorStore();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    religion: "",
    houseAddress: "",
    doctor_id: null,
  });

  useEffect(() => {
    // Fetch doctors data once on component mount
    getAllDoctors();

    // Optional: set up a reasonable refresh interval if needed
    const intervalId = setInterval(() => {
      getAllDoctors();
    }, 60000); // Refresh every minute

    // Clean up on component unmount
    return () => clearInterval(intervalId);
  }, [getAllDoctors]); // Only depend on the fetch function

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="rounded-lg custom-shadow bg-white p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="  flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">Doctors</h1>
          <span className="bg-[#F9F5FF] py-1 px-4 rounded-full text-[#6941C6] font-medium">
            {doctors.length}
          </span>
        </div>
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
      <DoctorsTable doctors={doctors} />
      {showModal && (
        <AddDoctorModal
          formData={formData}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          setShowModal={setShowModal}
          createDoctor={createDoctor}
          createConsultant={createConsultant}
        />
      )}
    </div>
  );
};

export default SaDoctorsPage;
