import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../Shared/Loader";
import { ArrowLeft, Pencil, Trash } from "lucide-react";
import Button from "../../../Shared/Button";
import { useDoctorStore } from "../../../store/super-admin/useDoctorStore";
import MedDShifts from "../shifts/MedDShifts";
import { useMedicalDStore } from "../../../store/staff/useMedicalDStore";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";

interface Doctor {
  id: string;
  attributes: {
    first_name: string;
    last_name: string;
    phone: string;
    gender: string;
    user_id: number;
    details: {
      age: number;
      religion: string;
      address: string;
    };
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

const MedDoctorDetail = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [shiftType, setShiftType] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<any | null>(null);
  const [staffShift, setStaffShift] = useState<any[]>([]);

  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedDoctor, getDoctorById, isLoading } = useMedicalDStore() as {
    selectedDoctor: Doctor;
    getDoctorById: (id: string) => void;
    isLoading: boolean;
  };
  const { assignShifts, updateShift, deleteShift } = useGlobalStore();

  // Fetch nurse shifts
  const getStaffShifts = async (userId: number, url: string) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setStaffShift(data || []);
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getDoctorById(id);
    }
  }, [id, getDoctorById]);

  useEffect(() => {
    if (selectedDoctor?.attributes.user_id) {
      getStaffShifts(
        selectedDoctor.attributes.user_id,
        `/medical-director/shift/user-records/${selectedDoctor.attributes.user_id}`
      );
    }
  }, [selectedDoctor?.attributes.user_id]);

  const handleAddShift = async () => {
    if (!selectedDate || !shiftType || !startTime || !endTime) return;

    const payload = {
      user_id: selectedDoctor.attributes.user_id,
      shifts: [
        {
          date: selectedDate.toISOString().split("T")[0],
          shift_type: shiftType,
          start_time: startTime,
          end_time: endTime,
          department_id: null, // Assuming nurse department_id is 2
        },
      ],
    };

    try {
      setLoading(true);
      const response = await assignShifts(
        payload,
        "/medical-director/shift/assign"
      );
      if (response) {
        setSelectedDate(null);
        setShiftType("");
        setStartTime("");
        setEndTime("");
        getStaffShifts(
          selectedDoctor.attributes.user_id,
          `/medical-director/shift/user-records/${selectedDoctor.attributes.user_id}`
        );
      }
    } catch (error) {
      console.error("Shift assignment failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateShift = async () => {
    if (
      !selectedDate ||
      !shiftType ||
      !startTime ||
      !endTime ||
      !editingShift?.id
    )
      return;

    const payload = {
      user_id: selectedDoctor.attributes.user_id,
      department_id: 2, // Assuming nurse department_id is 2
      date: selectedDate.toISOString().split("T")[0],
      shift_type: shiftType,
      start_time: startTime,
      end_time: endTime,
    };

    try {
      setLoading(true);
      const response = await updateShift(
        editingShift.id,
        payload,
        `/medical-director/shift/update/${editingShift.id}`
      );
      if (response) {
        setIsEditModalOpen(false);
        setEditingShift(null);
        setSelectedDate(null);
        setShiftType("");
        setStartTime("");
        setEndTime("");
        getStaffShifts(
          selectedDoctor.attributes.user_id,
          `/medical-director/shift/user-records/${selectedDoctor.attributes.user_id}`
        );
      }
    } catch (error) {
      console.error("Shift update failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShift = async (shiftId: number) => {
    try {
      setLoading(true);
      const response = await deleteShift(
        shiftId,
        `/medical-directory/shift/delete/${shiftId}`
      );
      if (response) {
        getStaffShifts(
          selectedDoctor.attributes.user_id,
          `/medical-director/shift/user-records/${selectedDoctor.attributes.user_id}`
        );
      }
    } catch (error) {
      console.error("Shift deletion failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !selectedDoctor) return <Loader />;

  if (!selectedDoctor) return <p>Doctor not found</p>;

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
            <div className="flex space-x-2">
              <Button variant="edit">Edit</Button>
              <Button variant="delete">Block staff</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Info
              label="First Name"
              value={selectedDoctor.attributes.first_name}
            />
            <Info
              label="Last Name"
              value={selectedDoctor.attributes.last_name}
            />
            <Info label="Staff ID" value={selectedDoctor.attributes.user_id} />
            <Info label="Age" value={selectedDoctor.attributes.details.age} />
            <Info label="Gender" value={selectedDoctor.attributes.gender} />
            <Info
              label="Religion"
              value={selectedDoctor.attributes.details.religion}
            />
            <Info label="Phone" value={selectedDoctor.attributes.phone} />
            <Info
              label="House Address"
              value={selectedDoctor.attributes.details.address}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default MedDoctorDetail;
