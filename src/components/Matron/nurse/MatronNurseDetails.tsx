import { ArrowLeft } from "lucide-react";
import React from "react";
import Button from "../../../Shared/Button";
import { useParams, useNavigate } from "react-router-dom";

interface Nurse {
  id: number;
  attributes: {
    first_name: string;
    last_name: string;
    user_id: number;
    email: string;
    phone: string;
    nurse_id: string;
  };
}
const MatronNurseDetails = () => {
  const navigate = useNavigate();
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
      </div>
      {/* nurse */}
    </div>
  );
};

export default MatronNurseDetails;
