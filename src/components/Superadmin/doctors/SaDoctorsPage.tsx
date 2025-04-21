import { useEffect, useState } from "react";
import DoctorsTable from "./DoctorsTable";
import AddDoctorModal from "../../../Shared/AddDoctorModal";
import { Plus } from "lucide-react";
import Button from "../../../Shared/Button";
import { useDoctorStore } from "../../../store/super-admin/useDoctorStore";

const SaDoctorsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const {
    createDoctor,
    updateDoctor,
    getAllDoctors,
    doctors,
    createConsultant,
    isLoading,
    pagination,
  } = useDoctorStore();

  const initialFormState = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    religion: "",
    houseAddress: "",
    doctor_id: null,
    dob: "",
    id: "",
  };

  const [formData, setFormData] = useState(initialFormState);

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

  const openAddModal = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (doctor: any) => {
    setFormData({
      id: doctor.id,
      first_name: doctor.first_name,
      last_name: doctor.last_name,
      email: doctor.email,
      phone: doctor.phone,
      religion: doctor.religion || "",
      houseAddress: doctor.address || "",
      doctor_id: null,
      dob: doctor.dob || "",
    });
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div className="rounded-lg custom-shadow bg-white p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">Doctors</h1>
          <span className="bg-[#F9F5FF] py-1 px-4 rounded-full text-[#6941C6] font-medium">
            {doctors.length}
          </span>
        </div>
        <Button
          onClick={openAddModal}
          variant="primary"
          size="md"
          className="flex items-center gap-2 px-4"
        >
          Add new
          <Plus size={16} />
        </Button>
      </div>
      <DoctorsTable
        doctors={doctors}
        isLoading={isLoading}
        pagination={pagination}
        getAllDoctors={getAllDoctors}
        onEdit={openEditModal}
      />
      {showModal && (
        <AddDoctorModal
          formData={formData}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          setShowModal={setShowModal}
          createDoctor={createDoctor}
          createConsultant={createConsultant}
          updateDoctor={updateDoctor}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default SaDoctorsPage;
