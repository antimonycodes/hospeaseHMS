import { useEffect, useState } from "react";
import Button from "../../../Shared/Button";
import { Plus } from "lucide-react";
import { useDoctorStore } from "../../../store/super-admin/useDoctorStore";
import ConsultantTable from "./ConsultantTable";
import AddDoctorModal from "../../../Shared/AddDoctorModal";

const SaConsultantPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const {
    createConsultant,
    updateConsultant,
    getAllConsultants,
    consultants,
    createDoctor,
    isLoading,
  } = useDoctorStore();

  const initialFormState = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    religion: "",
    houseAddress: "",
    consultant_id: null,
    dob: "",
    id: "",
    department_id: 0,
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    getAllConsultants();
  }, [getAllConsultants]);

  // Handle form input changes
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

  const openEditModal = (consultant: any) => {
    setFormData({
      id: consultant.id,
      first_name: consultant.first_name,
      last_name: consultant.last_name,
      email: consultant.email,
      phone: consultant.phone,
      religion: consultant.religion || "",
      houseAddress: consultant.address || "",
      consultant_id: consultant.consultant_id,
      dob: consultant.dob || "",
      department_id: consultant.department_id || 0,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div className="rounded-lg custom-shadow bg-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">Consultants</h1>
          <span className="bg-[#F9F5FF] py-1 px-4 rounded-full text-[#6941C6] font-medium">
            {consultants.length}
          </span>
        </div>
        {/* add button */}
        <div className=" md:w-auto">
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
      </div>
      <ConsultantTable
        consultants={consultants}
        isLoading={isLoading}
        onEdit={openEditModal}
      />
      {/* Add/Edit Consultant Modal */}
      {showModal && (
        <AddDoctorModal
          formData={formData}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          setShowModal={setShowModal}
          createConsultant={createConsultant}
          createDoctor={createDoctor}
          updateConsultant={updateConsultant}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default SaConsultantPage;
