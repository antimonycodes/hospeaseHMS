import { useEffect, useState } from "react";
import DoctorsTable from "./DoctorsTable";
import AddDoctorModal from "../../../Shared/AddDoctorModal";
import { Plus } from "lucide-react";
import Button from "../../../Shared/Button";
import { useDoctorStore } from "../../../store/super-admin/useDoctorStore";
import Bills from "../../../pages/Bills";

const SaDoctorsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("all-doctors");

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

  const tabs = [
    { id: "all-doctors", label: "All Doctors", count: doctors.length },
    { id: "doctors-bill", label: "Doctors Bill", count: 0 }, // You can update this count based on your data
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "all-doctors":
        return (
          <>
            <div className="flex items-center justify-end mb-6">
              {/* <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-gray-900">
                  All Doctors
                </h1>
                <span className="bg-[#F9F5FF] py-1 px-4 rounded-full text-[#6941C6] font-medium">
                  {doctors.length}
                </span>
              </div> */}
              <div className=" flex items-center justify-baseline">
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
            <DoctorsTable
              doctors={doctors}
              isLoading={isLoading}
              pagination={pagination}
              getAllDoctors={getAllDoctors}
              onEdit={openEditModal}
            />
          </>
        );
      case "doctors-bill":
        return (
          // <div className="flex items-center justify-center h-64">
          //   <div className="text-center">
          <Bills />
          //   </div>
          // </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg custom-shadow bg-white p-4">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activeTab === tab.id
                      ? "bg-[#F9F5FF] text-primary"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Modal */}
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
