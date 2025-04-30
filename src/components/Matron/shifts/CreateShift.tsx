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

// Define types
interface Shift {
  id: string;
  date: string;
  shiftType: string;
  department: string;
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

// Format data for backend submission - Fixed version
const formatDataForSubmission = (staffModules: any[]): AssignShift => {
  // The backend expects an array of objects, not AssignShift type
  return staffModules.map((module) => {
    // Each object should have user_id and shifts properties
    return {
      user_id: parseInt(module.staffId, 10),
      shifts: module.shifts.map((shift: Shift) => ({
        date: shift.date,
        shift_type: shift.shiftType,
        start_time: shift.startTime,
        end_time: shift.endTime,
        department_id: null,
        clinical_dept: parseInt(shift.department, 10) || null,
      })),
    };
  });
};

// Main component
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
          department: "",
          startTime: "",
          endTime: "",
        },
      ],
    },
  ]);

  // Separate search terms state for each module
  const [searchTerms, setSearchTerms] = useState<{ [key: string]: string }>({});
  const [showSuggestions, setShowSuggestions] = useState<{
    [key: string]: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get staffs from global store
  const {
    getAllStaffs,
    allStaffs,
    clinicaldepts,
    getClinicaldept,
    assignShifts,
  } = useGlobalStore();
  const [staffsLoaded, setStaffsLoaded] = useState(false);

  // Define shift types as simple strings
  const shiftTypes = ["Morning", "Afternoon", "Night", "On-Call"];

  // Load clinicaldepts and staff data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        // Fetch both departments and staff data in parallel
        await Promise.all([getClinicaldept(), getAllStaffs()]);
        setStaffsLoaded(true);
      } catch (error) {
        console.error("Error initializing data:", error);
        setError("Failed to load required data. Please refresh and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [getAllStaffs, getClinicaldept]);

  // Toggle collapse state of a module
  const toggleCollapse = (moduleId: string) => {
    setStaffModules((modules) =>
      modules.map((module) =>
        module.id === moduleId
          ? { ...module, isCollapsed: !module.isCollapsed }
          : module
      )
    );
  };

  // Add a new shift to a staff module
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
                  department: "",
                  startTime: "",
                  endTime: "",
                },
              ],
            }
          : module
      )
    );
  };

  // Remove a shift from a staff module
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

  // Add a new staff module
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
            department: "",
            startTime: "",
            endTime: "",
          },
        ],
      },
    ]);
  };

  // Remove a staff module
  const removeStaffModule = (moduleId: string) => {
    setStaffModules((modules) =>
      modules.filter((module) => module.id !== moduleId)
    );

    // Clean up any search terms for this module
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

  // Update a shift's field
  const updateShift = (
    moduleId: string,
    shiftId: string,
    field: keyof Shift,
    value: string
  ) => {
    setStaffModules((modules) =>
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              shifts: module.shifts.map((shift) =>
                shift.id === shiftId ? { ...shift, [field]: value } : shift
              ),
            }
          : module
      )
    );
  };

  // Format date for display
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

  // Handle search input change
  const handleSearchChange = (moduleId: string, term: string) => {
    // Update the search term for this specific module
    setSearchTerms((prev) => ({
      ...prev,
      [moduleId]: term,
    }));

    // Show suggestions when typing
    setShowSuggestions((prev) => ({
      ...prev,
      [moduleId]: true,
    }));

    // When searching, update only the displayed name but don't clear the staffId yet
    if (!term) {
      // Only clear staffId and name if the search is completely empty
      setStaffModules((modules) =>
        modules.map((module) =>
          module.id === moduleId
            ? { ...module, staffName: "", staffId: "" }
            : module
        )
      );
    }
  };

  // Handle staff selection from suggestions
  const selectStaff = (moduleId: string, staff: StaffData) => {
    const fullName =
      `${staff.attributes.first_name} ${staff.attributes.last_name}`.trim();

    // Update the staff module with the selected staff
    setStaffModules((modules) =>
      modules.map((module) =>
        module.id === moduleId
          ? { ...module, staffName: fullName, staffId: staff.id.toString() }
          : module
      )
    );

    // Clear search term and hide suggestions
    setSearchTerms((prev) => ({
      ...prev,
      [moduleId]: "",
    }));

    setShowSuggestions((prev) => ({
      ...prev,
      [moduleId]: false,
    }));
  };

  // Filter staff suggestions based on search term
  const getFilteredSuggestions = (term: string) => {
    if (!term || term.length < 2) return [];
    if (!allStaffs || !Array.isArray(allStaffs)) return [];

    const lowercaseTerm = term.toLowerCase();

    return allStaffs.filter((staff) => {
      // Check if staff and attributes exist
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

  // Save shifts for an individual staff module
  const saveModuleShifts = (moduleId: string) => {
    const module = staffModules.find((m) => m.id === moduleId);
    if (
      !module ||
      !module.staffId ||
      module.shifts.some((s) => !s.date || !s.department || !s.shiftType)
    ) {
      // alert("Please fill in all required fields before saving.");
      return;
    }

    // Could implement individual module save logic here
    // alert(`Saved shifts for ${module.staffName}`);
  };
  const [role, setRole] = useState("superadmin");

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "superadmin";
    setRole(storedRole);
  }, []);

  const endpointManagent = () => {
    if (role === "admin") return "/admin/shift/assign";
    if (role === "matron") return "/matron/shift/assign";
    if (role === "medical-director") return "/medical-director/shift/assign";
    return "/admin/staff-shift";
  };

  // Submit all shifts to backend
  // Submit all shifts to backend - Fixed version
  const handleSubmit = async () => {
    // Validate data before submission
    const hasEmptyFields = staffModules.some(
      (module) =>
        !module.staffName ||
        !module.staffId ||
        module.shifts.some(
          (shift) =>
            !shift.date ||
            !shift.department ||
            !shift.shiftType ||
            !shift.startTime ||
            !shift.endTime
        )
    );

    if (hasEmptyFields) {
      // alert("Please fill in all required fields before submitting.");
      return;
    }

    // Filter out modules with no shifts
    const validModules = staffModules.filter(
      (module) => module.staffId && module.shifts.length > 0
    );

    if (validModules.length === 0) {
      // alert("No valid shifts to submit.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Format data for backend submission
      const formattedData = formatDataForSubmission(validModules);

      console.log("Submitting data:", formattedData); // Debug logging

      // FIXED: Submit the entire array of data in a single request
      // const endpoint = "/matron/shift/assign";
      const response = await assignShifts(formattedData, endpointManagent());
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
              department: "",
              startTime: "",
              endTime: "",
            },
          ],
          isCollapsed: false,
        },
      ]);

      // alert("Shifts assigned successfully!");
      // Optional: redirect after submission
      // window.location.href = '/shifts';
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error submitting shifts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clicks outside of the suggestions dropdown
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
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronDown className="rotate-90 w-5 h-5 mr-2" />
          <span className="text-lg font-medium">Create New Shifts</span>
        </button>
      </div>

      {/* Loading indicator */}
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

      {/* Error message */}
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {/* Staff modules */}
      {staffModules.map((module) => (
        <div
          key={module.id}
          className="mb-6 border border-[#e4e4e7] rounded-lg overflow-hidden"
        >
          {/* Module header */}
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

          {/* Module content (shown when not collapsed) */}
          {!module.isCollapsed && (
            <div className="p-4">
              {/* Staff search */}
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

                {/* Staff suggestions dropdown */}
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

              {/* Selected staff info */}
              {module.staffId && (
                <div className="mb-4 px-3 py-2 bg-blue-50 rounded-lg text-primary text-sm">
                  Selected: {module.staffName}
                </div>
              )}

              {/* Shifts */}
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
                    {/* Date picker */}
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
                              updateShift(
                                module.id,
                                shift.id,
                                "date",
                                e.target.value
                              )
                            }
                            className="w-full border border-none focus:outline-none text-sm"
                            placeholder="Select date"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shift type dropdown */}
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
                          updateShift(
                            module.id,
                            shift.id,
                            "shiftType",
                            e.target.value
                          )
                        }
                        className="w-full border border-[#e4e4e7] rounded-lg px-3 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select shift type</option>
                        {shiftTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    {/* Department dropdown */}
                    <div>
                      <label
                        htmlFor={`department-${shift.id}`}
                        className="block text-sm font-medium text-[#98A2B3] mb-1"
                      >
                        Select Department
                      </label>
                      <select
                        id={`department-${shift.id}`}
                        value={shift.department}
                        onChange={(e) =>
                          updateShift(
                            module.id,
                            shift.id,
                            "department",
                            e.target.value
                          )
                        }
                        className="w-full border border-[#e4e4e7] rounded-lg px-3 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select department</option>
                        {clinicaldepts &&
                          clinicaldepts.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.attributes.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Time pickers */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label
                          htmlFor={`startTime-${shift.id}`}
                          className="block text-sm font-medium text-[#98A2B3] mb-1"
                        >
                          Start Time
                        </label>
                        <div className="flex items-center border border-[#e4e4e7] rounded-lg px-3 py-4">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <input
                            id={`startTime-${shift.id}`}
                            type="time"
                            value={shift.startTime}
                            onChange={(e) =>
                              updateShift(
                                module.id,
                                shift.id,
                                "startTime",
                                e.target.value
                              )
                            }
                            className="w-full border border-none focus:outline-none text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor={`endTime-${shift.id}`}
                          className="block text-sm font-medium text-[#98A2B3] mb-1"
                        >
                          End Time
                        </label>
                        <div className="flex items-center border border-[#e4e4e7] rounded-lg px-3 py-4">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <input
                            id={`endTime-${shift.id}`}
                            type="time"
                            value={shift.endTime}
                            onChange={(e) =>
                              updateShift(
                                module.id,
                                shift.id,
                                "endTime",
                                e.target.value
                              )
                            }
                            className="w-full border border-none focus:outline-none text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Module actions */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => addShift(module.id)}
                  className="flex items-center text-sm text-green-600 border border-primary px-4 py-2 rounded-lg font-medium hover:bg-green-100"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add More
                </button>
                {/* 
                <button
                  onClick={() => saveModuleShifts(module.id)}
                  className="text-sm bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
                >
                  Save
                </button> */}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Global actions */}
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
