import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "./Button";
import { useDoctorStore } from "../store/super-admin/useDoctorStore";
import Loader from "./Loader";
import { ArrowLeft, ChevronLeft } from "lucide-react";

interface Doctor {
  id: string;
  attributes: {
    first_name: string;
    last_name: string;
    phone: string;
    details: {
      age: number;
      religion: string;
      address: string;
    };
  };
  gender: string;
}

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedDoctor, getDoctorById, isLoading, deleteDoctor } =
    useDoctorStore() as {
      selectedDoctor: Doctor | null;
      getDoctorById: (id: string) => void;
      isLoading: boolean;
      deleteDoctor: (id: string) => void;
    };

  useEffect(() => {
    if (id) {
      getDoctorById(id);
    }
  }, [id, getDoctorById]);

  console.log(id);

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
            <Button variant="edit">Edit</Button>
            <Button variant="delete" onClick={handleDelete}>
              Delete staff
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
