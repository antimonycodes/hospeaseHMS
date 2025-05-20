import { useState, useEffect, SetStateAction } from "react";
import ShiftManagementCalendar from "./ShiftManagementCalendar";
import { XIcon, PlusCircle, Loader2, PencilIcon } from "lucide-react";
import Button from "../../../Shared/Button";
import toast from "react-hot-toast";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import editIcon from "../../../assets/edit.svg";
import { useRole } from "../../../hooks/useRole";

const SaShiftPage = () => {
  const [activeTab, setActiveTab] = useState("shift");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const {
    isLoading,
    createShiftType,
    getShiftType,
    updateShiftType,
    shiftTypes,
  } = useGlobalStore();
  const role = useRole();

  // Form state
  const [shiftForm, setShiftForm] = useState({
    shift_type: "",
    start_time: "",
    end_time: "",
  });

  const padTime = (timeStr: string) => {
    const [hour, minute] = timeStr.split(":");
    const paddedHour = hour.padStart(2, "0");
    const paddedMinute = minute.padStart(2, "0");
    return `${paddedHour}:${paddedMinute}`;
  };

  // Handle form input changes
  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setShiftForm({
      ...shiftForm,
      [name]: value,
    });
  };

  useEffect(() => {
    if (role === "admin") {
      getShiftType();
    }
  }, [role, getShiftType]);

  const handleTabChange = (tab: SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const handleAddShift = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Form validation
    if (!shiftForm.shift_type.trim()) {
      toast.error("Shift type cannot be empty");
      return;
    }

    if (!shiftForm.start_time) {
      toast.error("Start time is required");
      return;
    }

    if (!shiftForm.end_time) {
      toast.error("End time is required");
      return;
    }

    // Call API to create shift type
    const result = await createShiftType(shiftForm);

    if (result) {
      // Reset form and close modal on success
      setShiftForm({
        shift_type: "",
        start_time: padTime(shiftForm.start_time),
        end_time: padTime(shiftForm.end_time),
      });
      setIsModalOpen(false);
    }
  };

  const handleUpdateShift = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Form validation
    if (!shiftForm.shift_type.trim()) {
      toast.error("Shift type cannot be empty");
      return;
    }

    if (!shiftForm.start_time) {
      toast.error("Start time is required");
      return;
    }

    if (!shiftForm.end_time) {
      toast.error("End time is required");
      return;
    }

    // Call API to update shift type
    if (!selectedShift) {
      toast.error("No shift selected for update");
      return;
    }
    const result = await updateShiftType(selectedShift.id, shiftForm);

    if (result) {
      // Reset form and close modal on success
      setShiftForm({
        shift_type: "",
        start_time: padTime(shiftForm.start_time),
        end_time: padTime(shiftForm.end_time),
      });
      setIsModalOpen(false);
      setIsEditMode(false);
      setSelectedShift(null);
    }
  };

  interface Shift {
    id: string;
    attributes: {
      shift_type: string;
      start_time: string;
      end_time: string;
    };
  }

  const openEditModal = (shift: Shift) => {
    setSelectedShift(shift);
    setShiftForm({
      shift_type: shift.attributes.shift_type,
      start_time: shift.attributes.start_time,
      end_time: shift.attributes.end_time,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedShift(null);
    setShiftForm({
      shift_type: "",
      start_time: "",
      end_time: "",
    });
  };
  console.log(role);
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Tab Navigation */}
      <div className="flex items-center text-xs gap-3 mb-8 pb-3">
        <h1
          className={`relative inline-block flex-none cursor-pointer text-sm md:text-base font-semibold ${
            activeTab === "shift" ? "text-primary" : "text-[#667185]"
          }`}
          onClick={() => handleTabChange("shift")}
        >
          Shifts
          <div
            className={`absolute left-0 -bottom-3 w-full h-[2px] ${
              activeTab === "shift" ? "bg-primary" : "bg-[#E4E7EC]"
            }`}
          ></div>
        </h1>
        {role == "admin" && (
          <h1
            className={`relative inline-block flex-none cursor-pointer text-sm md:text-base font-semibold ${
              activeTab === "settings" ? "text-primary" : "text-[#667185]"
            }`}
            onClick={() => handleTabChange("settings")}
          >
            Settings
            <div
              className={`absolute left-0 -bottom-3 w-full h-[2px] ${
                activeTab === "settings" ? "bg-primary" : "bg-[#E4E7EC]"
              }`}
            ></div>
          </h1>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "shift" && (
        <div>
          <ShiftManagementCalendar />
        </div>
      )}

      {activeTab === "settings" && (
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-primary">
                Shift Settings
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage all shift types and their time schedules
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                setIsEditMode(false);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Shift</span>
            </Button>
          </div>

          {/* Shifts Table */}
          <div className="overflow-x-auto mt-6 rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
                  >
                    S/N
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Shift Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Start Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    End Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!isLoading && shiftTypes && shiftTypes.length > 0 ? (
                  shiftTypes.map((shift, index) => (
                    <tr
                      key={shift.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {shift.attributes.shift_type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {shift.attributes.start_time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {shift.attributes.end_time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => openEditModal(shift)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit shift"
                        >
                          <img src={editIcon} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      {isLoading ? (
                        <div className="flex justify-center items-center">
                          <Loader2 className="w-6 h-6 text-primary animate-spin mr-2" />
                          <span>Loading shifts</span>
                        </div>
                      ) : (
                        <p className="text-gray-500">No shifts found</p>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Adding/Editing Shift */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {isEditMode ? "Edit Shift" : "Add New Shift"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={isEditMode ? handleUpdateShift : handleAddShift}>
                <div className="mb-4">
                  <label
                    htmlFor="shift_type"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Shift Type
                  </label>
                  <input
                    id="shift_type"
                    name="shift_type"
                    type="text"
                    value={shiftForm.shift_type}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter shift type (e.g., Morning, Night)"
                    autoFocus
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="start_time"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Start Time
                  </label>
                  <input
                    id="start_time"
                    name="start_time"
                    type="time"
                    value={shiftForm.start_time}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="end_time"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    End Time
                  </label>
                  <input
                    id="end_time"
                    name="end_time"
                    type="time"
                    value={shiftForm.end_time}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={closeModal}
                    className="min-w-24"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isLoading}
                    className="min-w-24"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isEditMode ? "Updating" : "Adding"}</span>
                      </div>
                    ) : isEditMode ? (
                      "Update Shift"
                    ) : (
                      "Add Shift"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaShiftPage;
