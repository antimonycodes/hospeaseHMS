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

  useEffect(() => {
    if (selectedNurse) {
      getStaffShifts(
        selectedNurse.attributes.user_id,
        `/matron/shift/user-records/${selectedNurse.attributes.user_id}`
      );
    }
  }, [selectedNurse?.attributes.user_id, getStaffShifts]);

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

  const handleAddShift = async () => {
    if (!selectedDate || !shiftType || !startTime || !endTime) return;

    const payload = {
      user_id: selectedNurse.attributes.user_id,
      shifts: [
        {
          date: selectedDate.toISOString().split("T")[0],
          shift_type: shiftType,
          start_time: startTime,
          end_time: endTime,
          department_id: null,
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
        editingShift.id,
        payload,
        `/matron/shift/update/${editingShift.id}`
      );
      if (response) {
        setIsEditModalOpen(false);
        setEditingShift(null);
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

        {/* Shifts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-gray-500 text-xs">
                <th className="px-2 py-1">Day</th>
                <th className="px-2 py-1">Shift type</th>
                <th className="px-2 py-1">Start Time</th>
                <th className="px-2 py-1">End Time</th>
                <th className="px-2 py-1 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffShift.map((shift) => (
                <tr key={shift.id} className="bg-white rounded-md shadow-sm">
                  <td className="px-2 py-2 ">{shift.attributes.date}</td>
                  <td className="px-2 py-2">{shift.attributes.shift_type}</td>
                  <td className="px-2 py-2">{shift.attributes.start_time}</td>
                  <td className="px-2 py-2">{shift.attributes.end_time}</td>
                  <td className="px-2 py-2 text-right flex justify-end gap-2">
                    <button
                      className="text-gray-500 hover:text-primary"
                      onClick={() => {
                        setEditingShift(shift);
                        setSelectedDate(new Date(shift.date));
                        setShiftType(shift.shift_type);
                        setStartTime(shift.start_time);
                        setEndTime(shift.end_time);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="text-gray-500 hover:text-red-500"
                      onClick={() => handleDeleteShift(shift.id)}
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {staffShift.length === 0 && (
            <p className="text-sm text-gray-500 text-center mt-4">
              No shifts assigned yet.
            </p>
          )}
        </div>
      </div>

      {/* Edit Shift Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1E1E1E40] flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Shift</h2>
            <input
              type="date"
              value={selectedDate?.toISOString().split("T")[0] || ""}
              onChange={(e) =>
                setSelectedDate(
                  e.target.value ? new Date(e.target.value) : null
                )
              }
              className="border border-gray-300 px-4 py-2 rounded-md w-full mb-2"
            />
            <select
              value={shiftType}
              onChange={(e) => setShiftType(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full mb-2"
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
              className="border border-gray-300 px-4 py-2 rounded-md w-full mb-2"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingShift(null);
                  setSelectedDate(null);
                  setShiftType("");
                  setStartTime("");
                  setEndTime("");
                }}
                className="text-gray-600 hover:text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateShift}
                className="bg-primary text-white px-4 py-2 rounded-md"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatronNurseDetails;
