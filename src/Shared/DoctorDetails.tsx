import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "./Button";
import { useDoctorStore } from "../store/super-admin/useDoctorStore";
import Loader from "./Loader";
import { ArrowLeft, ChevronLeft, Loader2 } from "lucide-react";
import AddDoctorModal from "./AddDoctorModal";

interface Doctor {
  id: string;
  attributes: {
    email: string;
    user_id: null;
    first_name: string;
    last_name: string;
    phone: string;
    details: {
      dob: string;
      age: number;
      religion: string;
      address: string;
    };
  };
  gender: string;
}

const DoctorDetails = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    religion: "",
    houseAddress: "",
    doctor_id: null,
    dob: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedDoctor,
    getDoctorById,
    isLoading,
    deleteDoctor,
    createDoctor,
    createConsultant,
    updateDoctor,
  } = useDoctorStore() as {
    selectedDoctor: Doctor | null;
    getDoctorById: (id: string) => void;
    isLoading: boolean;
    deleteDoctor: (id: string) => void;
    createDoctor: (data: any) => void;
    createConsultant: (data: any) => void;
    updateDoctor: (data: any, id: any) => void;
  };

  const isDeleting = useDoctorStore((state) => state.isDeleting);

  useEffect(() => {
    if (id) {
      getDoctorById(id);
    }
  }, [id, getDoctorById]);

  useEffect(() => {
    if (selectedDoctor) {
      setFormData({
        id: selectedDoctor.id,
        first_name: selectedDoctor.attributes.first_name,
        last_name: selectedDoctor.attributes.last_name,
        email: selectedDoctor.attributes.email,
        phone: selectedDoctor.attributes.phone,
        religion: selectedDoctor.attributes.details.religion || "",
        houseAddress: selectedDoctor.attributes.details.address || "",
        doctor_id: selectedDoctor.attributes.user_id || null,
        dob: selectedDoctor.attributes.details.dob || "",
      });
    }
  }, [selectedDoctor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // console.log(selectedDoctor.id);

  const handleDelete = () => {
    if (selectedDoctor) {
      deleteDoctor(selectedDoctor.id);
      navigate(-1);
    }
  };

  if (isLoading) return <Loader />;
  if (!selectedDoctor) return <p>Doctor not found</p>;

  return (
    <div className="bg-white rounded-lg shadow-md w-full">
      <div className="p-6 space-y-12">
        <div className="flex flex-col 2xs:flex-row justify-between gap-6 2xs:items-center">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-2 text-gray-600 hover:text-primary"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg md:text-base font-medium text-custom-black">
              Doctor Details
            </h2>
          </div>
          <div className="flex space-x-2">
            <Button variant="edit" onClick={() => setShowEditModal(true)}>
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
            value={selectedDoctor?.attributes?.first_name}
          />
          <Info
            label="Last Name"
            value={selectedDoctor?.attributes?.last_name}
          />
          <Info label="Age" value={selectedDoctor?.attributes?.details?.age} />
          <Info label="Gender" value={selectedDoctor?.gender} />
          <Info
            label="Religion"
            value={selectedDoctor?.attributes?.details?.religion}
          />
          <Info label="Phone" value={selectedDoctor?.attributes?.phone} />
          <Info
            label="House Address"
            value={selectedDoctor?.attributes?.details?.address}
          />
        </div>
      </div>

      {showEditModal && (
        <AddDoctorModal
          formData={formData}
          handleInputChange={handleInputChange}
          setShowModal={setShowEditModal}
          createDoctor={async (data, endpoint, refreshEndpoint) =>
            createDoctor(data)
          }
          createConsultant={async (data, endpoint, refreshEndpoint) =>
            createConsultant(data)
          }
          updateDoctor={async (id, data, endpoint, refreshEndpoint) =>
            updateDoctor(id, data)
          }
          isLoading={isLoading}
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

export default DoctorDetails;
