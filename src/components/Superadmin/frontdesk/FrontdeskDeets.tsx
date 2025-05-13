import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNurseStore } from "../../../store/super-admin/useNuseStore";
import Button from "../../../Shared/Button";
import { ChevronLeft, Loader2 } from "lucide-react";
import Loader from "../../../Shared/Loader";
import { useCombinedStore } from "../../../store/super-admin/useCombinedStore";
import AddFrontDeskModal from "./AddFrontDeskModal";
import toast from "react-hot-toast";

// interface Frontdesk {
//   id: string;
//   attributes: {
//     email: string;
//     user_id: null | number;
//     first_name: string;
//     last_name: string;
//     phone: string;
//     details?: {
//       dob: string;
//       age: number;
//       religion: string;
//       address: string;
//     };
//   };
//   gender: string;
// }

const FrontdeskDeets = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    getFrontdeskById,
    createFrontdesk,
    selectedFrontdesk,
    isLoading,
    updateFrontdek,
  } = useNurseStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const { deleteUser, isDeleting } = useCombinedStore();
  const [formData, setFormData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (id) {
      getFrontdeskById(id);
    }
  }, [id, getFrontdeskById]);

  useEffect(() => {
    if (selectedFrontdesk) {
      console.log("selectedFrontdesk:", selectedFrontdesk);
      console.log(
        "selectedFrontdesk.attributes.email:",
        selectedFrontdesk.attributes.email
      );
      setFormData({
        id: selectedFrontdesk.id,
        first_name: selectedFrontdesk.attributes.first_name,
        last_name: selectedFrontdesk.attributes.last_name,
        email: selectedFrontdesk.attributes.email,
        phone: selectedFrontdesk.attributes.phone,
        address: selectedFrontdesk.attributes.address,
      });
    }
  }, [selectedFrontdesk]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDelete = () => {
    if (selectedFrontdesk && selectedFrontdesk.attributes.user_id) {
      deleteUser(selectedFrontdesk.attributes.user_id);
      navigate(-1);
    } else {
      toast.error("Cannot delete: User ID not found");
    }
  };

  if (isLoading) return <Loader />;
  if (!selectedFrontdesk) return <p>Frontdesk not found</p>;

  return (
    <div className="bg-white rounded-lg shadow-md w-full">
      <div className="p-6 space-y-12">
        <div className="flex flex-col 2xs:flex-row justify-between gap-6 2xs:items-center">
          <div
            className="flex items-center text-gray-600 hover:text-primary cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={16} />
            <span className="ml-1">Frontdesk Details</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="edit" onClick={() => setShowEditModal(true)}>
              Edit
            </Button>
            <Button
              variant="delete"
              onClick={handleDelete}
              disabled={isDeleting}
              className={isDeleting ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isDeleting ? (
                <>
                  Deleting
                  <Loader2 className="size-6 mr-2 animate-spin" />
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
            value={selectedFrontdesk.attributes.first_name}
          />
          <Info
            label="Last Name"
            value={selectedFrontdesk.attributes.last_name}
          />
          <Info
            label="Email"
            value={selectedFrontdesk.attributes.email ?? "N/A"}
          />
          <Info label="Phone" value={selectedFrontdesk.attributes.phone} />
          <Info
            label="Address"
            value={selectedFrontdesk.attributes.address ?? "N/A"}
          />
        </div>
      </div>
      {showEditModal && (
        <AddFrontDeskModal
          formData={formData}
          handleInputChange={handleInputChange}
          setShowModal={setShowEditModal}
          createFrontdesk={createFrontdesk}
          updateFrontdesk={updateFrontdek}
          isEditing={true}
        />
      )}
    </div>
  );
};

const Info = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="mb-4">
    <p className="text-sm text-[#667085]">{label}</p>
    <p className="text-sm md:text-base font-medium text-custom-black">
      {value ?? "N/A"}
    </p>
  </div>
);

export default FrontdeskDeets;
