import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Filter, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import Loader from "../../../Shared/Loader";
import Button from "../../../Shared/Button";

// Types
type ShiftCount = {
  Morning: number;
  Afternoon: number;
  Night: number;
  [key: string]: number; // Allow dynamic shift types
};

type ShiftData = {
  [date: string]: ShiftCount;
};

type DayData = {
  date: Date;
  dateString: string;
  shifts: any[];
  inCurrentMonth: boolean;
};

type DoctorShift = {
  shift_type: string;
  doctor: string;
  start_time: string;
  clinical_department: any[];
};

// Shift type colors mapping
const shiftColors: { [key: string]: string } = {
  Morning: "text-[#B13E00] bg-[#FFF3F0]",
  Afternoon: "text-[#016838] bg-[#E0FFF1]",
  Night: "text-[#101828] bg-[#EFF4FF]",
};

const ShiftManagementCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { getAllShifts, allShifts, isLoading, getShiftDetails, shiftDetails } =
    useGlobalStore();

  const [role, setRole] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedShiftType, setSelectedShiftType] = useState<string | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  const [shiftTypes, setShiftTypes] = useState<string[]>([]);
  const [processedShiftDetails, setProcessedShiftDetails] = useState<
    DoctorShift[]
  >([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState("month"); // "month" or "list" view

  // Set role from localStorage once
  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "admin";
    setRole(storedRole);
  }, []);

  // Extract available shift types from allShifts
  useEffect(() => {
    if (allShifts) {
      const types = new Set<string>();
      Object.values(allShifts).forEach((shifts: ShiftCount) => {
        Object.keys(shifts).forEach((type) => types.add(type));
      });
      setShiftTypes(Array.from(types));
    }
  }, [allShifts]);

  // Process shift details when they change
  useEffect(() => {
    if (shiftDetails) {
      // Check if shiftDetails has the expected structure with shifts property
      if (shiftDetails) {
        // Process the nested structure into a flat array
        const flatShifts: DoctorShift[] = [];

        Object.entries(shiftDetails).forEach(([shiftType, doctors]) => {
          // Ensure doctors is an array before processing
          if (Array.isArray(doctors)) {
            doctors.forEach((doctor: any) => {
              flatShifts.push({
                ...doctor,
                shift_type: shiftType,
              });
            });
          }
        });

        setProcessedShiftDetails(flatShifts);
      } else {
        // If shiftDetails is already a flat array, use it directly
        setProcessedShiftDetails(shiftDetails);
      }
    } else {
      setProcessedShiftDetails([]);
    }
  }, [shiftDetails]);

  const endpointManagent = (userRole: string) => {
    if (userRole === "admin") return "/admin/shift/user-records";
    if (userRole === "matron") return "/matron/shift/user-records";
    if (userRole === "medical-director")
      return "/medical-director/shift/user-records";
    return "/superadmin/staff-shift"; // fallback
  };

  useEffect(() => {
    if (role) {
      const endpoint = endpointManagent(role);
      getAllShifts(endpoint);
    }
  }, [getAllShifts, role]);

  // Check if device is mobile based on screen width
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Format a date to YYYY-MM-DD string
  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handle date click
  const handleDateClick = (dateString: string) => {
    setSelectedDate(dateString);
    getShiftDetails(dateString);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedShiftType(null);
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get shift data for a specific date
  const getShiftsForDate = (dateString: any) => {
    // Only access allShifts if it exists
    if (!allShifts) {
      // Return default empty shifts if allShifts is not available
      return [];
    }

    // Get the shift data for this date or use empty object
    const dateData = allShifts[dateString] || {};

    // Convert the shift data to the format needed for display
    return Object.entries(dateData).map(([title, count]) => ({
      title,
      count,
      color: shiftColors[title] || "text-gray-600 bg-gray-100", // Default color if type not in mapping
    }));
  };

  const generateCalendarData = (year: number, month: number): DayData[] => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // Get the weekday of the 1st of the month

    const calendarData: DayData[] = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    // Handle days from the previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = prevMonthLastDay - startingDayOfWeek + i + 1;
      const date = new Date(year, month - 1, prevMonthDay);
      const dateString = formatDateToString(date);
      calendarData.push({
        date,
        dateString,
        shifts: getShiftsForDate(dateString),
        inCurrentMonth: false,
      });
    }

    // Handle days for the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = formatDateToString(date);
      calendarData.push({
        date,
        dateString,
        shifts: getShiftsForDate(dateString),
        inCurrentMonth: true,
      });
    }

    // Handle days from the next month to fill the grid
    const totalDaysInGrid =
      Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;
    const remainingDays = totalDaysInGrid - calendarData.length;

    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      const dateString = formatDateToString(date);
      calendarData.push({
        date,
        dateString,
        shifts: getShiftsForDate(dateString),
        inCurrentMonth: false,
      });
    }

    return calendarData;
  };

  // Generate list view data for the current month
  const generateListViewData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const listData: DayData[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = formatDateToString(date);
      listData.push({
        date,
        dateString,
        shifts: getShiftsForDate(dateString),
        inCurrentMonth: true,
      });
    }

    // Sort by date
    return listData.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const calendarData = generateCalendarData(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const listViewData = generateListViewData();
  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Filter doctors based on selected shift type
  const filteredDoctors = selectedShiftType
    ? processedShiftDetails.filter(
        (doctor: DoctorShift) => doctor.shift_type === selectedShiftType
      )
    : processedShiftDetails;

  // Format time from 24hr format to AM/PM
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Format full date for list view
  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate the number of doctors on duty based on filtered results
  const doctorsOnDutyCount = filteredDoctors?.length || 0;

  if (isLoading) return <Loader />;

  return (
    <div className="w-full bg-white rounded-lg p-2 md:p-4">
      {/* Mobile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <div className="flex justify-between items-center w-full md:w-auto">
          <h1 className="text-lg md:text-2xl font-bold text-primary">
            Shift Management
          </h1>
          <button
            className="md:hidden p-2 border rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full md:w-auto mt-2 md:mt-0`}
        >
          {/* View toggle - Month/List */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              className={`px-3 py-1 text-sm rounded-md ${
                viewMode === "month" ? "bg-primary text-white" : "bg-gray-100"
              }`}
              onClick={() => setViewMode("month")}
            >
              Month
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${
                viewMode === "list" ? "bg-primary text-white" : "bg-gray-100"
              }`}
              onClick={() => setViewMode("list")}
            >
              List
            </button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start mt-2 md:mt-0">
            <button
              onClick={prevMonth}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={goToToday}
            >
              Today
            </button>
            <span className="text-sm font-medium min-w-24 text-center">
              {formatMonthYear(currentDate)}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Create Shift Button */}
          <Link
            to="/dashboard/create-shift"
            className="w-full md:w-auto mt-2 md:mt-0"
          >
            <Button className="w-full md:w-auto">Create New Shift</Button>
          </Link>
        </div>
      </div>

      {/* Month View Calendar */}
      {viewMode === "month" && (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-1 md:gap-4 px-1 md:px-4 py-2 md:py-6 border border-[#EAECF0] min-w-[700px]">
            {weekdays.map((day, index) => (
              <div
                key={`weekday-${index}`}
                className="text-center py-1 md:py-2 text-xs md:text-sm font-semibold"
              >
                {day}
              </div>
            ))}

            {calendarData.map((dayData, index) => (
              <div
                key={`day-${index}`}
                className={`px-1 md:px-2 py-2 md:py-4 border border-[#EAECF0] rounded-md shadow cursor-pointer hover:bg-gray-50 transition-colors ${
                  !dayData.inCurrentMonth ? "bg-gray-50" : "bg-white"
                } ${
                  isToday(dayData.date) && dayData.inCurrentMonth
                    ? "ring-2 ring-[#009952]"
                    : ""
                }`}
                onClick={() => handleDateClick(dayData.dateString)}
              >
                <div
                  className={`text-right text-xs md:text-sm mb-1 font-medium ${
                    isToday(dayData.date)
                      ? "text-primary"
                      : dayData.inCurrentMonth
                      ? "text-gray-700"
                      : "text-gray-400"
                  }`}
                >
                  {dayData.date.getDate()}
                </div>
                <div className="space-y-1 md:space-y-3">
                  {dayData.shifts
                    .slice(0, isMobile ? 2 : 3)
                    .map((shift, shiftIndex) => (
                      <div
                        key={`shift-${dayData.dateString}-${shiftIndex}`}
                        className={`${shift.color} text-xs p-1 rounded flex items-center justify-between`}
                      >
                        <span className="truncate max-w-12 md:max-w-none">
                          {shift.title}
                        </span>
                        <span>{shift.count}</span>
                      </div>
                    ))}
                  {dayData.shifts.length > (isMobile ? 2 : 3) && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayData.shifts.length - (isMobile ? 2 : 3)} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="border border-[#EAECF0] rounded-md">
          {listViewData.map((dayData, index) => (
            <div
              key={`list-${dayData.dateString}`}
              className={`border-b border-[#EAECF0] last:border-b-0 p-3 cursor-pointer hover:bg-gray-50 ${
                isToday(dayData.date) ? "bg-gray-50" : ""
              }`}
              onClick={() => handleDateClick(dayData.dateString)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      isToday(dayData.date) ? "bg-primary" : "bg-gray-300"
                    }`}
                  ></div>
                  <span
                    className={`font-medium ${
                      isToday(dayData.date) ? "text-primary" : ""
                    }`}
                  >
                    {formatFullDate(dayData.date)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {dayData.shifts.reduce(
                    (total, shift) => total + shift.count,
                    0
                  )}{" "}
                  staff
                </div>
              </div>

              {dayData.shifts.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {dayData.shifts.map((shift, shiftIndex) => (
                    <div
                      key={`list-shift-${shiftIndex}`}
                      className={`${shift.color} text-xs py-1 px-2 rounded-full flex items-center`}
                    >
                      <span>{shift.title}</span>
                      <span className="ml-1 bg-white bg-opacity-50 rounded-full w-5 h-5 flex items-center justify-center">
                        {shift.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 text-xs text-gray-400">
                  No shifts scheduled
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal for shift details - Responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-1 md:p-6">
          <div className="bg-white rounded-lg p-3 md:p-6 w-full max-w-2xl max-h-[80%] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold truncate">
                Shift Details -{" "}
                {selectedDate
                  ? new Date(`${selectedDate}T00:00:00Z`).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timeZone: "UTC", // Use UTC to prevent date shifting
                      }
                    )
                  : ""}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>

              <div className="text-sm text-gray-500 mt-1 md:mt-0">
                {doctorsOnDutyCount} staffs on duty
              </div>
            </div>

            {showFilters && (
              <div className="flex gap-2 mb-4 flex-wrap">
                <button
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedShiftType === null
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                  onClick={() => setSelectedShiftType(null)}
                >
                  All
                </button>
                {shiftTypes.map((type) => (
                  <button
                    key={type}
                    className={`px-3 py-1 rounded-md text-sm ${
                      selectedShiftType === type
                        ? type === "Morning"
                          ? "bg-[#B13E00] text-white"
                          : type === "Afternoon"
                          ? "bg-[#016838] text-white"
                          : type === "Night"
                          ? "bg-[#101828] text-white"
                          : "bg-blue-500 text-white"
                        : type === "Morning"
                        ? "bg-[#FFF3F0] text-[#B13E00]"
                        : type === "Afternoon"
                        ? "bg-[#E0FFF1] text-[#016838]"
                        : type === "Night"
                        ? "bg-[#EFF4FF] text-[#101828]"
                        : "bg-gray-100"
                    }`}
                    onClick={() => setSelectedShiftType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}

            {filteredDoctors && filteredDoctors.length > 0 ? (
              <div className="overflow-x-auto -mx-3 md:mx-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Staffs
                      </th>
                      <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dept
                      </th>
                      <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shift
                      </th>
                      <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDoctors.map(
                      (doctor: DoctorShift, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900 max-w-24 md:max-w-full truncate">
                            {doctor.doctor}
                          </td>
                          <td className="px-2 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-500">
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(doctor.clinical_department) ? (
                                doctor.clinical_department
                                  .slice(0, isMobile ? 1 : 3)
                                  .map((dept: any, i: number) => (
                                    <span
                                      key={`${dept}-${i}`}
                                      className="px-1 md:px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                                    >
                                      {dept}
                                    </span>
                                  ))
                              ) : (
                                <span className="px-1 md:px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                  N/A
                                </span>
                              )}
                              {Array.isArray(doctor.clinical_department) &&
                                doctor.clinical_department.length >
                                  (isMobile ? 1 : 3) && (
                                  <span className="text-xs text-gray-500">
                                    +
                                    {doctor.clinical_department.length -
                                      (isMobile ? 1 : 3)}
                                  </span>
                                )}
                            </div>
                          </td>
                          <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                            <span
                              className={`px-1 md:px-2 py-1 rounded-full text-xs ${
                                doctor.shift_type === "Morning"
                                  ? "bg-[#FFF3F0] text-[#B13E00]"
                                  : doctor.shift_type === "Afternoon"
                                  ? "bg-[#E0FFF1] text-[#016838]"
                                  : "bg-[#EFF4FF] text-[#101828]"
                              }`}
                            >
                              {doctor.shift_type}
                            </span>
                          </td>
                          <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                            {formatTime(doctor.start_time)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No staff scheduled for this{" "}
                  {selectedShiftType ? selectedShiftType + " shift" : "date"}.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftManagementCalendar;
