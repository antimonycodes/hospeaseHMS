import { ArrowLeft } from "lucide-react";
import React, { useEffect } from "react";
import Button from "../../../Shared/Button";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../../Shared/Loader";
import { useMatronNurse } from "./useMatronNurse";

interface Nurse {
  id: number;
  attributes: {
    first_name: string;
    last_name: string;
    user_id: number;
    email: string;
    phone: string;
    nurse_id: string;
    gender: string;
    age?: number;
    religion?: string;
    address?: string;
  };
}

const Info = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="mb-4">
    <p className="text-sm text-[#667085]">{label}</p>
    <p className="text-sm md:text-base font-medium text-custom-black">
      {value ?? "N/A"}
    </p>
  </div>
);

const MatronNurseDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedNurse, getNurseById, isLoading } = useMatronNurse() as {
    selectedNurse: Nurse | null;
    getNurseById: (id: string) => void;
    isLoading: boolean;
  };
  useEffect(() => {
    if (id) {
      getNurseById(id);
    }
  }, [id, getNurseById]);

  if (isLoading) return <Loader />;

  return (
    <div className="bg-white rounded-lg shadow-md w-full">
      {/* Nurse info */}
      <div className=" p-6 space-y-12">
        {" "}
        <div className="flex flex-col 2xs:flex-row justify-between gap-6 2xs:items-center">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-2 text-custom-black"
            >
              <ArrowLeft />
            </button>
            <h2 className="text-lg md:text-base font-medium text-custom-black">
              Nurse
            </h2>
          </div>
          <div className="flex space-x-2">
            <Button variant="edit">Edit</Button>
            <Button variant="delete">Block staff</Button>
          </div>
        </div>
        {/* nurse */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Info
            label="First Name"
            value={selectedNurse?.attributes?.first_name}
          />
          <Info
            label="Last Name"
            value={selectedNurse?.attributes?.last_name}
          />
          <Info label="Age" value={selectedNurse?.attributes?.age} />
          <Info label="Gender" value={selectedNurse?.attributes?.gender} />
          <Info label="Religion" value={selectedNurse?.attributes?.religion} />
          <Info label="Phone" value={selectedNurse?.attributes?.phone} />
          <Info
            label="House Address"
            value={selectedNurse?.attributes?.address}
          />
        </div>
      </div>
    </div>
  );
};

export default MatronNurseDetails;
