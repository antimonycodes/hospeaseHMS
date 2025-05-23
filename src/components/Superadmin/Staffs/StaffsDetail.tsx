import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import { ChevronLeft, Loader2, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import Loader from "../../../Shared/Loader";
import Button from "../../../Shared/Button";
import { useCombinedStore } from "../../../store/super-admin/useCombinedStore";
import AddStaffModal from "./AddStaffModal";

const StaffsDetail = ({ setShowModal }: any) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [shiftType, setShiftType] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<any | null>(null);
  const [isStaffEditModalOpen, setIsStaffEditModalOpen] = useState(false);
  const [staffFormData, setStaffFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const navigate = useNavigate();
  const staff = useGlobalStore((state) => state.selectedStaff);
  const roles = useGlobalStore((state) => state.roles);

  const {
    assignShifts,
    getStaffShifts,
    staffShift,
    updateShift,
    deleteShift,
    updateStaff,
  } = useGlobalStore();

  const { deleteUser, isDeleting } = useCombinedStore();

  useEffect(() => {
    if (!staff) {
      navigate(-1);
    } else {
      // Initialize staff form data
      setStaffFormData({
        first_name: staff.first_name || "",
        last_name: staff.last_name || "",
        email: staff.email || "",
        phone: staff.phone || "",
      });
    }
  }, [staff, navigate]);

  // Handle staff form input change
  const handleStaffInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStaffFormData({
      ...staffFormData,
      [name]: value,
    });
  };

  // useEffect(() => {
  //   if (staff) {
  //     getStaffShifts(staff.id, `/admin/shift/user-records/${staff.id}`);
  //   }
  // }, [staff, getStaffShifts]);

  // Get department ID dynamically from roles
  const getDepartmentId = () => {
    const staffRole = staff?.role?.toLowerCase();
    if (!staffRole || !roles || !roles[staffRole]) {
      console.warn(`Role not found: ${staffRole}`);
      return null;
    }
    return roles[staffRole].id;
  };

  // const handleAddShift = async () => {
  //   if (!selectedDate || !shiftType || !startTime || !endTime) return;

  //   const department_id = getDepartmentId();

  //   if (!department_id) return;

  //   const payload = {
  //     user_id: staff.id,
  //     shifts: [
  //       {
  //         date: selectedDate.toISOString().split("T")[0],
  //         shift_type: shiftType,
  //         start_time: startTime,
  //         end_time: endTime,
  //         department_id: null,
  //       },
  //     ],
  //   };

  //   try {
  //     setLoading(true);
  //     const response = await assignShifts(payload, "/admin/shift/assign");
  //     if (response) {
  //       setSelectedDate(null);
  //       setShiftType("");
  //       setStartTime("");
  //       setEndTime("");
  //       getStaffShifts(staff.id, `/admin/shift/user-records/${staff.id}`);
  //     }
  //   } catch (error) {
  //     console.error("Shift assignment failed", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleUpdateShift = async () => {
  //   if (
  //     !selectedDate ||
  //     !shiftType ||
  //     !startTime ||
  //     !endTime ||
  //     !editingShift?.id
  //   )
  //     return;

  //   const department_id = getDepartmentId();

  //   if (!department_id) return;

  //   const payload = {
  //     user_id: staff.id,
  //     department_id,
  //     date: selectedDate.toISOString().split("T")[0],
  //     shift_type: shiftType,
  //     start_time: startTime,
  //     end_time: endTime,
  //   };

  //   try {
  //     setLoading(true);
  //     const response = await updateShift(
  //       editingShift.id,
  //       payload,
  //       `/admin/shift/update/${staff.id}`
  //     );
  //     if (response) {
  //       setIsEditModalOpen(false);
  //       setEditingShift(null);
  //       getStaffShifts(staff.id, `/admin/shift/user-records/${staff.id}`);
  //     }
  //   } catch (error: any) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleDeleteShift = async (shiftId: number) => {
  //   const response = await deleteShift(
  //     shiftId,
  //     `/admin/shift/delete/${shiftId}`
  //   );
  //   if (response) {
  //     getStaffShifts(staff.id, `/admin/shift/user-records/${staff.id}`);
  //   }
  // };

  const handleDelete = async () => {
    const response = await deleteUser(staff.id);
    if (response) {
      navigate(-1);
    }
  };
  const openStaffEditModal = () => {
    setIsStaffEditModalOpen(true);
  };

  if (!staff) return <Loader />;

  return (
    <div className="px-2 sm:px-0">
      <div className="p-4 bg-white rounded-lg custom-shadow mb-6">
        <div className=" flex items-center justify-between">
          <div
            className="flex items-center text-gray-600 hover:text-primary mb-6"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={16} />
            <span className="ml-1">Staffs</span>
          </div>
          {/* btns */}
          <div className="flex space-x-2">
            <Button variant="edit" onClick={openStaffEditModal}>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <InfoRow label="First Name" value={staff.first_name} />
          <InfoRow label="Last Name" value={staff.last_name} />
          <InfoRow label="Phone" value={staff.phone} />
          <InfoRow label="Email" value={staff.email} />
          <InfoRow label="Department" value={staff.role} />
        </div>
      </div>

      {/* <div className="p-4 bg-white rounded-lg custom-shadow">
        <h2 className="text-base font-semibold mb-4">Set shifts</h2>

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
              {staffShift.map((shift, index) => (
                <tr
                  key={shift.id || index}
                  className="bg-white rounded-md shadow-sm"
                >
                  <td className="px-2 py-2">{shift.attributes.date}</td>
                  <td className="px-2 py-2">{shift.attributes.shift_type}</td>
                  <td className="px-2 py-2">{shift.attributes.start_time}</td>
                  <td className="px-2 py-2">{shift.attributes.end_time}</td>
                  <td className="px-2 py-2 text-right flex justify-end gap-2">
                    <button
                      className="text-gray-500 hover:text-primary"
                      onClick={() => {
                        setEditingShift(shift);
                        setSelectedDate(new Date(shift.attributes.date));
                        setShiftType(shift.attributes.shift_type);
                        setStartTime(shift.attributes.start_time);
                        setEndTime(shift.attributes.end_time);
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
        </div>
      </div> */}

      {/* {isEditModalOpen && (
        <div className="fixed inset-0 z-50  bg-[#1E1E1E40] flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Shift</h2>

            <input
              type="date"
              value={selectedDate?.toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
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
      )} */}

      {/* Staff Edit Modal */}
      {isStaffEditModalOpen && (
        <AddStaffModal
          formData={staffFormData}
          handleInputChange={handleStaffInputChange}
          setShowModal={setIsStaffEditModalOpen}
          createStaff={() => Promise.resolve(null)} // This won't be used in edit mode
          updateStaff={updateStaff}
          isLoading={false}
          department={staff.role.toLowerCase()}
          isEditing={true}
          staffId={staff.id}
          // roles={roles}
        />
      )}
    </div>
  );
};

export default StaffsDetail;

const InfoRow = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value?: string | null;
  className?: string;
}) => (
  <div className={className}>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium">{value || "N/A"}</p>
  </div>
);
