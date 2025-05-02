import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Calendar,
  Clock,
  Search,
} from "lucide-react";
import {
  AssignShift,
  ShiftData,
  useGlobalStore,
} from "../../../store/super-admin/useGlobal";

// Updated types
interface Shift {
  id: string;
  date: string;
  shiftType: string;
  departments: any[];
  startTime: string;
  endTime: string;
}

interface StaffModule {
  id: string;
  staffName: string;
  staffId: string;
  isCollapsed: boolean;
  shifts: Shift[];
}

interface StaffData {
  id: number;
  attributes: {
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
  };
}

interface Department {
  id: string;
  name: string;
  attributes?: {
    name: string;
  };
}

// Updated shift type interface to match the actual API response structure
interface ShiftType {
  id: number;
  type: string;
  attributes: {
    shift_type: string;
    start_time: string;
    end_time: string;
    created_at: string;
  };
}

const padTime = (timeStr: string) => {
  const [hour, minute] = timeStr.split(":");
  const paddedHour = hour.padStart(2, "0");
  const paddedMinute = minute.padStart(2, "0");
  return `${paddedHour}:${paddedMinute}`;
};

const formatDataForSubmission = (
  staffModules: StaffModule[],
  shiftTypesData: any[]
): AssignShift[] => {
  return staffModules.map((module) => ({
    user_id: parseInt(module.staffId, 10),
    shifts: module.shifts.map((shift) => {
      // Find the shift type object by ID to get the actual shift_type value
      const shiftTypeObj = shiftTypesData.find(
        (st) => st.id.toString() === shift.shiftType
      );
      const shiftTypeName = shiftTypeObj
        ? shiftTypeObj.attributes.shift_type
        : "";

      // Format time to ensure H:i format (hour:minute)
      const formatTimeToHi = (timeString: string) => {
        if (!timeString) return "";
        try {
          // Extract hours and minutes from the time string
          const [hours, minutes] = timeString.split(":");
          return `${hours}:${minutes}`;
        } catch (e) {
          return timeString;
        }
      };

      return {
        date: shift.date,
        shift_type: shiftTypeName, // Send the name instead of ID
        start_time: padTime(shift.startTime),
        end_time: padTime(shift.endTime),
        department_id: null,
        clinical_dept: shift.departments.map((id) => parseInt(id, 10)),
      };
    }),
  }));
};

const CreateShift = () => {
  const [staffModules, setStaffModules] = useState<StaffModule[]>([
    {
      id: "1",
      staffName: "",
      staffId: "",
      isCollapsed: false,
      shifts: [
        {
          id: "1-1",
          date: "",
          shiftType: "",
          departments: [],
          startTime: "",
          endTime: "",
        },
      ],
    },
  ]);

  const [searchTerms, setSearchTerms] = useState<{ [key: string]: string }>({});
  const [showSuggestions, setShowSuggestions] = useState<{
    [key: string]: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    getAllStaffs,
    allStaffs,
    clinicaldepts,
    getClinicaldept,
    assignShifts,
    getShiftType,
    shiftTypes,
  } = useGlobalStore();

  const [staffsLoaded, setStaffsLoaded] = useState(false);
  const [role, setRole] = useState("superadmin");

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "superadmin";
    setRole(storedRole);
  }, []);

  const endpointManagement = () => {
    if (role === "admin") return "/admin/shift/assign";
    if (role === "matron") return "/matron/shift/assign";
    if (role === "medical-director") return "/medical-director/shift/assign";
    return "/admin/staff-shift";
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([getClinicaldept(), getAllStaffs(), getShiftType()]);
        setStaffsLoaded(true);
      } catch (error) {
        console.error("Error initializing data:", error);
        setError("Failed to load required data. Please refresh and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [getAllStaffs, getClinicaldept, getShiftType]);

  const toggleCollapse = (moduleId: string) => {
    setStaffModules((modules) =>
      modules.map((module) =>
        module.id === moduleId
          ? { ...module, isCollapsed: !module.isCollapsed }
          : module
      )
    );
  };

  const addShift = (moduleId: string) => {
    setStaffModules((modules) =>
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              shifts: [
                ...module.shifts,
                {
                  id: `${moduleId}-${module.shifts.length + 1}`,
                  date: "",
                  shiftType: "",
                  departments: [],
                  startTime: "",
                  endTime: "",
                },
              ],
            }
          : module
      )
    );
  };

  const removeShift = (moduleId: string, shiftId: string) => {
    setStaffModules((modules) =>
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              shifts: module.shifts.filter((shift) => shift.id !== shiftId),
            }
          : module
      )
    );
  };

  const addStaffModule = () => {
    const newId = (staffModules.length + 1).toString();
    setStaffModules([
      ...staffModules,
      {
        id: newId,
        staffName: "",
        staffId: "",
        isCollapsed: false,
        shifts: [
          {
            id: `${newId}-1`,
            date: "",
            shiftType: "",
            departments: [],
            startTime: "",
            endTime: "",
          },
        ],
      },
    ]);
  };

  const removeStaffModule = (moduleId: string) => {
    setStaffModules((modules) =>
      modules.filter((module) => module.id !== moduleId)
    );

    setSearchTerms((prev) => {
      const newTerms = { ...prev };
      delete newTerms[moduleId];
      return newTerms;
    });

    setShowSuggestions((prev) => {
      const newShow = { ...prev };
      delete newShow[moduleId];
      return newShow;
    });
  };

  const updateShift = (
    moduleId: string,
    shiftId: string,
    updates: Partial<Shift>
  ) => {
    setStaffModules((modules) =>
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              shifts: module.shifts.map((shift) =>
                shift.id === shiftId ? { ...shift, ...updates } : shift
              ),
            }
          : module
      )
    );
  };

  const handleShiftTypeChange = (
    moduleId: string,
    shiftId: string,
    shiftTypeId: string
  ) => {
    // Fixed to work with the new shift type structure
    const selectedShift = shiftTypes.find(
      (st) => st.id.toString() === shiftTypeId
    );
    if (selectedShift) {
      updateShift(moduleId, shiftId, {
        shiftType: shiftTypeId,
        startTime: selectedShift.attributes.start_time,
        endTime: selectedShift.attributes.end_time,
      });
    }
  };

  const handleDepartmentChange = (
    moduleId: string,
    shiftId: string,
    deptId: any,
    checked: boolean
  ) => {
    setStaffModules((modules) =>
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              shifts: module.shifts.map((shift) =>
                shift.id === shiftId
                  ? {
                      ...shift,
                      departments: checked
                        ? [...shift.departments, deptId]
                        : shift.departments.filter((id) => id !== deptId),
                    }
                  : shift
              ),
            }
          : module
      )
    );
  };

  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateString.toString();
    }
  };

  const handleSearchChange = (moduleId: string, term: string) => {
    setSearchTerms((prev) => ({
      ...prev,
      [moduleId]: term,
    }));

    setShowSuggestions((prev) => ({
      ...prev,
      [moduleId]: true,
    }));

    if (!term) {
      setStaffModules((modules) =>
        modules.map((module) =>
          module.id === moduleId
            ? { ...module, staffName: "", staffId: "" }
            : module
        )
      );
    }
  };

  const selectStaff = (moduleId: string, staff: StaffData) => {
    const fullName =
      `${staff.attributes.first_name} ${staff.attributes.last_name}`.trim();

    setStaffModules((modules) =>
      modules.map((module) =>
        module.id === moduleId
          ? { ...module, staffName: fullName, staffId: staff.id.toString() }
          : module
      )
    );

    setSearchTerms((prev) => ({
      ...prev,
      [moduleId]: "",
    }));

    setShowSuggestions((prev) => ({
      ...prev,
      [moduleId]: false,
    }));
  };

  const getFilteredSuggestions = (term: string) => {
    if (!term || term.length < 2) return [];
    if (!allStaffs || !Array.isArray(allStaffs)) return [];

    const lowercaseTerm = term.toLowerCase();

    return allStaffs.filter((staff) => {
      if (!staff || !staff.attributes) return false;

      const firstName = staff.attributes.first_name || "";
      const lastName = staff.attributes.last_name || "";
      const fullName = `${firstName} ${lastName}`.toLowerCase();

      return (
        firstName.toLowerCase().includes(lowercaseTerm) ||
        lastName.toLowerCase().includes(lowercaseTerm) ||
        fullName.includes(lowercaseTerm)
      );
    });
  };

  const handleSubmit = async () => {
    const hasEmptyFields = staffModules.some(
      (module) =>
        !module.staffName ||
        !module.staffId ||
        module.shifts.some(
          (shift) =>
            !shift.date || shift.departments.length === 0 || !shift.shiftType
        )
    );

    if (hasEmptyFields) {
      setError("Please fill in all required fields before submitting.");
      return;
    }

    const validModules = staffModules.filter(
      (module) => module.staffId && module.shifts.length > 0
    );

    if (validModules.length === 0) {
      setError("No valid shifts to submit.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Pass shiftTypes to formatDataForSubmission to access shift type names
      const formattedData = formatDataForSubmission(validModules, shiftTypes);
      console.log("Formatted data before submission:", formattedData);

      const response = await assignShifts(formattedData, endpointManagement());
      console.log("Shift assignment response:", response);

      // Reset form after successful submission
      setStaffModules([
        {
          id: "1",
          staffName: "",
          staffId: "",
          shifts: [
            {
              id: "1-1",
              date: "",
              shiftType: "",
              departments: [],
              startTime: "",
              endTime: "",
            },
          ],
          isCollapsed: false,
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error submitting shifts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".staff-search-container")) {
        setShowSuggestions({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className=" p-6 bg-white rounded-lg shadow">
      <div className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronDown className="rotate-90 w-5 h-5 mr-2" />
          <span className="text-lg font-medium">Create New Shifts</span>
        </button>
      </div>

      {isLoading && !staffsLoaded && (
        <div className="p-4 mb-4 text-center bg-blue-50 rounded-lg">
          <div className="inline-flex items-center">
            <svg
              className="animate-spin mr-2 h-5 w-5 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading staff data...
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {staffModules.map((module) => (
        <div
          key={module.id}
          className="mb-6 border border-[#e4e4e7] rounded-lg overflow-hidden"
        >
          <div className="flex items-center justify-between bg-green-50 p-4">
            <div className="flex items-center">
              <button
                onClick={() => toggleCollapse(module.id)}
                className="mr-2 text-gray-600 hover:text-gray-900"
              >
                {module.isCollapsed ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </button>
              <span className="font-medium">
                {module.staffName || "New Staff Member"}
              </span>
            </div>
            <button onClick={() => removeStaffModule(module.id)} className="">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!module.isCollapsed && (
            <div className="p-4">
              <div className="mb-4 relative staff-search-container">
                <label
                  htmlFor={`staff-search-${module.id}`}
                  className="block text-sm font-medium text-[#98A2B3] mb-1"
                >
                  Search Staff Member
                </label>
                <div className="flex items-center border border-[#E4E4E7] rounded-lg px-3 py-4">
                  <Search className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    id={`staff-search-${module.id}`}
                    type="text"
                    placeholder="Type to search staff"
                    value={searchTerms[module.id] || ""}
                    onChange={(e) =>
                      handleSearchChange(module.id, e.target.value)
                    }
                    className="w-full bg-transparent border border-none focus:outline-none text-sm"
                    onFocus={() => {
                      setShowSuggestions({
                        ...showSuggestions,
                        [module.id]: true,
                      });
                    }}
                  />
                </div>

                {showSuggestions[module.id] && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-[#e4e4e7] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {isLoading ? (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Loading staff data...
                      </div>
                    ) : !staffsLoaded ? (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Waiting for staff data...
                      </div>
                    ) : !allStaffs || !Array.isArray(allStaffs) ? (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Unable to load staff data.
                      </div>
                    ) : !searchTerms[module.id] ||
                      searchTerms[module.id].length < 2 ? (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Type at least 2 characters to search staff.
                      </div>
                    ) : getFilteredSuggestions(searchTerms[module.id]).length >
                      0 ? (
                      getFilteredSuggestions(searchTerms[module.id]).map(
                        (staff) => (
                          <div
                            key={staff.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => selectStaff(module.id, staff)}
                          >
                            {staff.attributes.first_name}{" "}
                            {staff.attributes.last_name}
                          </div>
                        )
                      )
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No staff found matching "{searchTerms[module.id]}".
                      </div>
                    )}
                  </div>
                )}
              </div>

              {module.staffId && (
                <div className="mb-4 px-3 py-2 bg-blue-50 rounded-lg text-primary text-sm">
                  Selected: {module.staffName}
                </div>
              )}

              {module.shifts.map((shift, shiftIndex) => (
                <div
                  key={shift.id}
                  className="mb-6 last:mb-0 p-4 border border-[#e4e4e7] rounded-lg"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-sm">
                      {shift.date
                        ? formatDate(shift.date).toString()
                        : `Shift ${shiftIndex + 1}`}
                    </h3>
                    {module.shifts.length > 1 && (
                      <button
                        onClick={() => removeShift(module.id, shift.id)}
                        className=""
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <label
                        htmlFor={`date-${shift.id}`}
                        className="block text-sm font-medium text-[#98A2B3] mb-1"
                      >
                        Select Date
                      </label>
                      <div className="relative">
                        <div className="flex items-center border border-[#e4e4e7] rounded-lg px-3 py-4">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <input
                            id={`date-${shift.id}`}
                            type="date"
                            value={shift.date}
                            onChange={(e) =>
                              updateShift(module.id, shift.id, {
                                date: e.target.value,
                              })
                            }
                            className="w-full border border-none focus:outline-none text-sm"
                            placeholder="Select date"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor={`shiftType-${shift.id}`}
                        className="block text-sm font-medium text-[#98A2B3] mb-1"
                      >
                        Select Shift Type
                      </label>
                      <select
                        id={`shiftType-${shift.id}`}
                        value={shift.shiftType}
                        onChange={(e) =>
                          handleShiftTypeChange(
                            module.id,
                            shift.id,
                            e.target.value
                          )
                        }
                        className="w-full border border-[#e4e4e7] rounded-lg px-3 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select shift type</option>
                        {Array.isArray(shiftTypes) &&
                          shiftTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.attributes.shift_type}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <label className="block text-sm font-medium text-[#98A2B3] mb-2">
                        Select Departments
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {clinicaldepts?.map((dept) => (
                          <label
                            key={dept.id}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={shift.departments.includes(dept.id)}
                              onChange={(e) =>
                                handleDepartmentChange(
                                  module.id,
                                  shift.id,
                                  dept.id,
                                  e.target.checked
                                )
                              }
                              className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary"
                            />
                            <span className="text-sm">
                              {dept.attributes?.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#98A2B3] mb-1">
                        Shift Times
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="flex items-center border border-[#e4e4e7] rounded-lg px-3 py-4 bg-gray-100">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                              type="text"
                              value={shift.startTime}
                              readOnly
                              className="w-full bg-transparent border-none focus:outline-none text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center border border-[#e4e4e7] rounded-lg px-3 py-4 bg-gray-100">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                              type="text"
                              value={shift.endTime}
                              readOnly
                              className="w-full bg-transparent border-none focus:outline-none text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => addShift(module.id)}
                  className="flex items-center text-sm text-green-600 border border-primary px-4 py-2 rounded-lg font-medium hover:bg-green-100"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add More
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-col xs:flex-row justify-between mt-6">
        <button
          onClick={addStaffModule}
          className="flex items-center text-sm text-green-600 border border-[#e4e4e7] px-4 py-2 rounded-lg font-medium hover:bg-green-50"
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-1" /> Add Staff Member
        </button>

        <button
          onClick={handleSubmit}
          className={`text-sm ${
            isLoading ? "bg-gray-400" : "bg-primary hover:bg-green-700"
          } text-white px-8 py-2 rounded-lg font-medium flex items-center justify-center`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateShift;
