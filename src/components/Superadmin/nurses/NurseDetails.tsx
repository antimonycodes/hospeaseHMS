import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNurseStore } from "../../../store/super-admin/useNuseStore";
import Button from "../../../Shared/Button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Loader from "../../../Shared/Loader";
import AddOrEditNurseModal from "./AddOrEditNurseModal";

const NurseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    getNurseById,
    selectedNurse,
    isLoading,
    deleteNurse,
    updateNurse,
    isDeleting,
  } = useNurseStore();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    nurse_id: null,
    email: "",
    phone: "",
    religion: "",
    address: "",
    dob: "",
  });

  useEffect(() => {
    if (id) {
      getNurseById(id);
    }
  }, [id, getNurseById]);

  // Update form data when selected nurse changes
  useEffect(() => {
    if (selectedNurse) {
      setFormData({
        first_name: selectedNurse.attributes.first_name || "",
        last_name: selectedNurse.attributes.last_name || "",
        nurse_id: selectedNurse.id,
        email: selectedNurse.attributes.email || "",
        phone: selectedNurse.attributes.phone || "",
        religion: selectedNurse.attributes.details?.religion || "",
        address: selectedNurse.attributes.details?.address || "",
        dob: selectedNurse.attributes.details?.dob || "",
      });
    }
  }, [selectedNurse]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    if (selectedNurse) {
      deleteNurse(selectedNurse.id);
      navigate(-1);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="bg-white rounded-lg shadow-md w-full">
      <div className="p-6 space-y-12">
        <div className="flex flex-col 2xs:flex-row justify-between gap-6 2xs:items-center">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-2 text-custom-black"
            >
              <ArrowLeft />
            </button>
            <h2 className="text-lg md:text-base font-medium text-custom-black">
              Nurse Details
            </h2>
          </div>
          <div className="flex space-x-2">
            <Button variant="edit" onClick={handleEdit}>
              Edit
            </Button>
            <Button
              variant="delete"
              onClick={handleDelete}
              disabled={!!isDeleting}
              className={`
                ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isDeleting ? (
                <>
                  Deleting
                  <Loader2 className=" size-6 mr-2 animate-spin" />
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Info
            label="First Name"
            value={selectedNurse?.attributes.first_name}
          />
          <Info label="Last Name" value={selectedNurse?.attributes.last_name} />
          <Info label="Staff ID" value={selectedNurse?.attributes.nurse_id} />
          <Info label="Age" value={selectedNurse?.attributes.details?.age} />
          <Info label="Gender" value={selectedNurse?.gender} />
          <Info
            label="Religion"
            value={selectedNurse?.attributes.details?.religion}
          />
          <Info label="Phone" value={selectedNurse?.attributes.phone} />
          <Info
            label="House Address"
            value={selectedNurse?.attributes.details?.address}
          />
        </div>
      </div>

      {/* Edit Nurse Modal */}
      {showEditModal && selectedNurse && (
        <AddOrEditNurseModal
          formData={formData}
          handleInputChange={handleInputChange}
          setShowModal={setShowEditModal}
          createNurse={() => null}
          updateNurse={updateNurse}
          // isLoading={isLoading}
          isEditMode={true}
          selectedNurseId={selectedNurse.id}
        />
      )}
    </div>
  );
};

const Info = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="mb-4">
    <p className="text-sm text-[#667085]">{label}</p>
    <p className="text-sm md:text-base font-medium text-custom-black">
      {value || "N/A"}
    </p>
  </div>
);

export default NurseDetails;
