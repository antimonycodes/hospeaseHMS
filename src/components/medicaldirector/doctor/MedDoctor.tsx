import React, { useEffect, useState } from "react";
import MedDoctorTable from "./MedDoctorTable";
import Button from "../../../Shared/Button";
import { Plus } from "lucide-react";
import { useDoctorStore } from "../../../store/super-admin/useDoctorStore";
import AddDoctorModal from "../../../Shared/AddDoctorModal";

const MedDoctor = () => {
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
    dob: "", // Added dob
    doctor_id: null,
    endpoint: "",
    refreshEndpoint: "",
  });

  useEffect(() => {
    getAllDoctors("/medical-director/all-doctors");
    const intervalId = setInterval(() => {
      getAllDoctors("/medical-director/all-doctors");
    }, 60000);
    return () => clearInterval(intervalId);
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
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
      <MedDoctorTable doctors={doctors} isLoading={isLoading} />

      {showModal && (
        <AddDoctorModal
          formData={formData}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          setShowModal={setShowModal}
          createDoctor={createDoctor}
          createConsultant={createConsultant}
          endpoint="/medical-director/add-doctor"
          refreshEndpoint="/medical-director/all-doctors"
        />
      )}
    </div>
  );
};

export default MedDoctor;
