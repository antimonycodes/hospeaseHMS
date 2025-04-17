import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNurseStore } from "../../../store/super-admin/useNuseStore";
import Button from "../../../Shared/Button";
import { ArrowLeft } from "lucide-react";

const NurseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { getNurseById, selectedNurse, isLoading, deleteNurse } =
    useNurseStore();

  useEffect(() => {
    if (id) {
      getNurseById(id);
    }
  }, [id, getNurseById]);

  const handleDelete = () => {
    if (selectedNurse) {
      deleteNurse(selectedNurse.id);
      navigate(-1);
    }
  };
  console.log(selectedNurse);

  if (isLoading) return <p>Loading doctor details...</p>;

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
            <Button variant="edit">Edit</Button>
            <Button variant="delete" onClick={handleDelete}>
              Delete staff
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
          <Info label="Age" value={selectedNurse?.attributes.details.age} />
          <Info label="Gender" value={selectedNurse?.gender} />
          <Info
            label="Religion"
            value={selectedNurse?.attributes.details.religion}
          />
          <Info label="Phone" value={selectedNurse?.attributes.phone} />
          <Info
            label="House Address"
            value={selectedNurse?.attributes.details.address}
          />
        </div>
      </div>
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
