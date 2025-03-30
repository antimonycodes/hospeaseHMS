import { useEffect, useState } from "react";
import DoctorsTable from "./DoctorsTable";
import AddDoctorModal from "../../../Shared/AddDoctorModal";
import { Plus } from "lucide-react";
import Button from "../../../Shared/Button";
import { useDoctorStore } from "../../../store/super-admin/useDoctorStore";

const SaDoctorsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const createDoctor = useDoctorStore((state) => state.createDoctor);
  const { getAllDoctors, doctors, createConsultant } = useDoctorStore();

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
    getAllDoctors();
  }, [getAllDoctors]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="rounded-lg custom-shadow bg-white p-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Doctors</h1>
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
          handleInputChange={handleInputChange}
          setShowModal={setShowModal}
          createDoctor={createDoctor} // Pass createDoctor function
          createConsultant={createConsultant} // Pass createConsultant function
        />
      )}
    </div>
  );
};

export default SaDoctorsPage;
