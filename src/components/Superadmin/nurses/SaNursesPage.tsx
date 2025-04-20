import { Plus } from "lucide-react";
import Button from "../../../Shared/Button";
import SaNurseTable from "./SaNurseTable";
import AddOrEditNurseModal from "./AddOrEditNurseModal";
import { useEffect, useState } from "react";
import {
  useNurseStore,
  CreateNurseData,
} from "../../../store/super-admin/useNuseStore";

const SaNursesPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedNurseId, setSelectedNurseId] = useState<string | undefined>(
    undefined
  );

  const [formData, setFormData] = useState<CreateNurseData>({
    first_name: "",
    last_name: "",
    nurse_id: null,
    email: "",
    phone: "",
    religion: "",
    address: "",
    dob: "",
  });

  const {
    isCreating,
    getNurses,
    nurses,
    isLoading,
    createNurse,
    pagination,
    updateNurse,
  } = useNurseStore();

  useEffect(() => {
    getNurses();
  }, [getNurses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddNewClick = () => {
    // Reset form data for adding a new nurse
    setFormData({
      first_name: "",
      last_name: "",
      nurse_id: null,
      email: "",
      phone: "",
      religion: "",
      address: "",
      dob: "",
    });
    setIsEditMode(false);
    setSelectedNurseId(undefined);
    setShowModal(true);
  };

  // const handleEditClick = (nurse: any) => {
  //   // Populate form data with selected nurse details
  //   setFormData({
  //     first_name: nurse.first_name,
  //     last_name: nurse.last_name,
  //     nurse_id: nurse.id,
  //     email: nurse.email,
  //     phone: nurse.phone,
  //     religion: nurse.religion || "",
  //     address: nurse.address || "",
  //     dob: nurse.dob || "",
  //   });
  //   setIsEditMode(true);
  //   setSelectedNurseId(nurse.id);
  //   setShowModal(true);
  // };

  return (
    <div className="w-full rounded-lg custom-shadow bg-white p-4">
      {/* header */}
      <div className="w-full flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">Nurses</h1>
          <span className="bg-[#F9F5FF] py-1 px-4 rounded-full text-[#6941C6] font-medium">
            {nurses.length}
          </span>
        </div>
        {/* add button */}
        <div className="md:w-auto">
          <Button
            onClick={handleAddNewClick}
            variant="primary"
            size="md"
            className="flex items-center gap-2 px-4"
          >
            Add new
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {/* table */}
      <SaNurseTable
        nurses={nurses}
        isLoading={isLoading}
        pagination={pagination}
        getNurses={getNurses}
        // onEditClick={handleEditClick}
      />

      {/* Add/Edit Nurse Modal */}
      {showModal && (
        <AddOrEditNurseModal
          formData={formData}
          handleInputChange={handleInputChange}
          setShowModal={setShowModal}
          createNurse={createNurse}
          updateNurse={updateNurse}
          // isCreating={isCreating}
          isEditMode={isEditMode}
          selectedNurseId={selectedNurseId}
        />
      )}
    </div>
  );
};

export default SaNursesPage;
