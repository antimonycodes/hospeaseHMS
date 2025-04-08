import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import Button from "../../../Shared/Button";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../../Shared/Loader";
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
  const [staffShift, setStaffShift] = useState([]);

  const { assignShifts, updateShift, deleteShift } = useGlobalStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedNurse, getNurseById, isLoading } = useMatronNurse() as {
    selectedNurse: Nurse;
    getNurseById: (id: string) => void;
    isLoading: boolean;
  };

  const getStaffShifts = async (userId: number, url: string) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Shifts fetched:", data);
      // Ensure the data is being set to the state
      setStaffShift(data);
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getNurseById(id);
    }
  }, [id, getNurseById]);

  useEffect(() => {
    if (selectedNurse?.attributes.user_id) {
      getStaffShifts(
        selectedNurse.attributes.user_id,
        `/matron/shift/user-records/${selectedNurse.attributes.user_id}`
      );
    }
  }, [selectedNurse?.attributes.user_id, getStaffShifts]);

  useEffect(() => {
    console.log("Updated staffShift:", staffShift);
  }, [staffShift]);

  const handleAddShift = async () => {
    if (!selectedDate || !shiftType || !startTime || !endTime) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      user_id: selectedNurse.attributes.user_id,
      shifts: [
        {
          date: selectedDate.toISOString().split("T")[0],
          shift_type: shiftType,
          start_time: startTime,
          end_time: endTime,
          department_id: 2, // Assuming nurse department_id is 2 based on roleToDepartment
        },
      ],
    };

    try {
      setLoading(true);
      const response = await assignShifts(payload, "/matron/shift/assign");
      if (response) {
        setSelectedDate(null);
        setShiftType("");
        setStartTime("");
        setEndTime("");
        getStaffShifts(
          selectedNurse.attributes.user_id,
          `/matron/shift/user-records/${selectedNurse.attributes.user_id}`
        );
      }
    } catch (error) {
      console.error("Shift assignment failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateShift = async (shiftId: number) => {
    if (!selectedDate || !shiftType || !startTime || !endTime || !shiftId) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      user_id: selectedNurse.attributes.user_id,
      department_id: 2, // Assuming nurse department_id is 2
      date: selectedDate.toISOString().split("T")[0],
      shift_type: shiftType,
      start_time: startTime,
      end_time: endTime,
    };

    try {
      setLoading(true);
      const response = await updateShift(
        shiftId,
        payload,
        `/matron/shift/update/${shiftId}`
      );
      if (response) {
        setSelectedDate(null);
        setShiftType("");
        setStartTime("");
        setEndTime("");
        getStaffShifts(
          selectedNurse.attributes.user_id,
          `/matron/shift/user-records/${selectedNurse.attributes.user_id}`
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
        `/matron/shift/delete/${shiftId}`
      );
      if (response) {
        getStaffShifts(
          selectedNurse.attributes.user_id,
          `/matron/shift/user-records/${selectedNurse.attributes.user_id}`
        );
      }
    } catch (error) {
      console.error("Shift deletion failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !selectedNurse) return <Loader />;

  return (
    <div className="w-full flex flex-col gap-6 p-4">
      {/* Nurse info */}
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
          {/* Nurse Details */}
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
      <div className="p-4 bg-white rounded-lg custom-shadow">
        <h2 className="text-base font-semibold mb-4">Set Shifts</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <input
            type="date"
            value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              setSelectedDate(e.target.value ? new Date(e.target.value) : null)
            }
            className="border border-gray-300 px-4 py-2 rounded-md text-sm"
          />
          <select
            className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full sm:w-auto"
            value={shiftType}
            onChange={(e) => setShiftType(e.target.value)}
          >
            <option value="">Shift type</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Night">Night</option>
          </select>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md text-sm"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md text-sm"
          />
          <button
            disabled={loading}
            onClick={handleAddShift}
            className="bg-primary text-white px-5 py-2 text-sm rounded-md ml-auto w-full sm:w-auto"
          >
            {loading ? "Adding..." : "Add Shift"}
          </button>
        </div>

        {/* Display Shifts */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2">Assigned Shifts</h3>
          {staffShift.length > 0 ? (
            <ul className="space-y-2">
              {staffShift.map((shift: any) => (
                <li
                  key={shift.id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <div>
                    <p>
                      {shift.date} - {shift.shift_type}
                    </p>
                    <p className="text-sm text-gray-600">
                      {shift.start_time} to {shift.end_time}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="edit"
                      onClick={() => {
                        setSelectedDate(new Date(shift.date));
                        setShiftType(shift.shift_type);
                        setStartTime(shift.start_time);
                        setEndTime(shift.end_time);
                        handleUpdateShift(shift.id);
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="delete"
                      onClick={() => handleDeleteShift(shift.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No shifts assigned yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatronNurseDetails;
