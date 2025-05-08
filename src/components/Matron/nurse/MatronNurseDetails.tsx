import React, { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Trash } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../../Shared/Loader";
import Button from "../../../Shared/Button";
import { useMatronNurse } from "./useMatronNurse";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [shiftType, setShiftType] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<any | null>(null);
  // const [staffShift, setStaffShift] = useState<any[]>([]);

  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedNurse, getNurseById, isLoading } = useMatronNurse() as {
    selectedNurse: Nurse;
    getNurseById: (id: string) => void;
    isLoading: boolean;
  };
  const { assignShifts, updateShift, deleteShift, getStaffShifts, staffShift } =
    useGlobalStore();

  console.log(selectedNurse, "fghjklhgf");

  // Fetch nurse shifts
  // const getStaffShifts = async (userId: number, url: string) => {
  //   try {
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     setStaffShift(data || []);
  //   } catch (error) {
  //     console.error("Error fetching shifts:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (selectedNurse) {
  //     getStaffShifts(
  //       selectedNurse.attributes.user_id,
  //       `/matron/shift/user-records/${selectedNurse.attributes.user_id}`
  //     );
  //   }
  // }, [selectedNurse?.attributes.user_id, getStaffShifts]);

  useEffect(() => {
    if (id) {
      getNurseById(id);
    }
  }, [id, getNurseById]);

  // useEffect(() => {
  //   if (selectedNurse) {
  //     getStaffShifts(
  //       selectedNurse.attributes.user_id,
  //       `/matron/shift/user-records/${selectedNurse.attributes.user_id}`
  //     );
  //   }
  // }, [selectedNurse?.attributes.user_id]);

  console.log(selectedNurse?.attributes.user_id, "fghjk");

  if (isLoading || !selectedNurse) return <Loader />;

  return (
    <div className="w-full flex flex-col gap-6 p-4">
      {/* Nurse Info */}
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
            {/* <div className="flex space-x-2">
              <Button variant="edit">Edit</Button>
              <Button variant="delete">Block staff</Button>
            </div> */}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Info
              label="First Name"
              value={selectedNurse.attributes.first_name}
            />
            <Info
              label="Last Name"
              value={selectedNurse.attributes.last_name}
            />
            <Info label="Staff ID" value={selectedNurse.attributes.nurse_id} />
            <Info label="Age" value={selectedNurse.attributes.age} />
            <Info label="Gender" value={selectedNurse.attributes.gender} />
            <Info label="Religion" value={selectedNurse.attributes.religion} />
            <Info label="Phone" value={selectedNurse.attributes.phone} />
            <Info
              label="House Address"
              value={selectedNurse.attributes.address}
            />
          </div>
        </div>
      </div>

      {/* Shift Assignment */}
    </div>
  );
};

export default MatronNurseDetails;
