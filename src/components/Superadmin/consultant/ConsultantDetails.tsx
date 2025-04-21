import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, Loader2 } from "lucide-react";
import { useDoctorStore } from "../../../store/super-admin/useDoctorStore";
import Button from "../../../Shared/Button";
import Loader from "../../../Shared/Loader";
import { useCombinedStore } from "../../../store/super-admin/useCombinedStore";
// import { useDoctorStore } from "../store/useDoctorStore";

export interface Consultant {
  id: string;
  attributes: {
    first_name: string;
    last_name: string;
    phone: string;
    user_id: string;
    age: number;
    religion: string;
    address: string;
  };
  gender: string;
}

const ConsultantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedConsultant, getConsultantById, isLoading } =
    useDoctorStore() as {
      selectedConsultant: Consultant | null;
      getConsultantById: (id: string, endpoint: string) => Promise<void>;
      isLoading: boolean;
    };
  const { deleteUser, isDeleting } = useCombinedStore();

  useEffect(() => {
    if (id) {
      getConsultantById(id, `/admin/consultant/fetch/${id}`);
    }
  }, [id, getConsultantById]);
  console.log(selectedConsultant);

  const handleDelete = async () => {
    const response = await deleteUser(selectedConsultant?.attributes.user_id);
    if (response) {
      navigate(-1);
    }
  };

  if (isLoading) return <Loader />;
  if (!selectedConsultant) return <p>Consultant not found</p>;

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
              Consultant Details
            </h2>
          </div>
          <div className="flex space-x-2">
            <Button variant="edit">Edit</Button>
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
            value={selectedConsultant.attributes.first_name}
          />
          <Info
            label="Last Name"
            value={selectedConsultant.attributes.last_name}
          />
          {/* <Info label="Staff ID" value={selectedConsultant.staffId} /> */}
          <Info label="Age" value={selectedConsultant.attributes.age} />
          <Info label="Gender" value={selectedConsultant.gender} />
          <Info
            label="Religion"
            value={selectedConsultant.attributes.religion}
          />
          <Info label="Phone" value={selectedConsultant.attributes.phone} />
          <Info
            label="House Address"
            value={selectedConsultant.attributes.address}
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

export default ConsultantDetails;
