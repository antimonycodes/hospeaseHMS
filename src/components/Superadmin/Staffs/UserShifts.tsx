import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Calendar,
  List,
  X,
} from "lucide-react";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";

// Types
type ShiftData = {
  shift_type: string;
  start_time: string;
  end_time: string;
  clinical_departments: string[];
};

type StaffShiftData = {
  [date: string]: {
    [shiftType: string]: ShiftData[];
  };
};

type DayData = {
  date: Date;
  dateString: string;
  shifts: {
    type: string;
    color: string;
    startTime?: string;
    endTime?: string;
    departments?: string[];
  }[];
  inCurrentMonth: boolean;
};

// For list view data
type ShiftListItem = {
  date: Date;
  dateString: string;
  shifts: {
    type: string;
    color: string;
    startTime?: string;
    endTime?: string;
    departments?: string[];
  }[];
};

// Modal data type
type ModalData = {
  isOpen: boolean;
  date: Date | null;
  shifts: {
    type: string;
    color: string;
    startTime?: string;
    endTime?: string;
    departments?: string[];
  }[];
};

// Shift type colors mapping
const shiftColors: { [key: string]: string } = {
  Morning: "text-[#B13E00] bg-[#FFF3F0]",
  Afternoon: "text-[#016838] bg-[#E0FFF1]",
  Night: "text-[#101828] bg-[#EFF4FF]",
  night: "text-[#101828] bg-[#EFF4FF]",
  morning: "text-[#B13E00] bg-[#FFF3F0]",
  afternoon: "text-[#016838] bg-[#E0FFF1]",
  default: "text-gray-700 bg-gray-100",
};

const UserShifts = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [processedShifts, setProcessedShifts] = useState<StaffShiftData>({});
  const [viewMode, setViewMode] = useState("month"); // "month" or "list"
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Modal state
  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    date: null,
    shifts: [],
  });

  const { getStaffShifts, staffShift, isLoading } = useGlobalStore();

  // Check if device is mobile based on screen width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Format date to display month and year
  const formatMonthYear = (date: Date) =>
    date.toLocaleString("default", { month: "long", year: "numeric" });

  // Navigate to previous month
  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );

  // Navigate to next month
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  // Go to today
  const goToToday = () => setCurrentDate(new Date());

  // Determine endpoint based on role
  const endpointManagent = (role: string, id: string) => {
    if (role === "nurse") return `/nurses/shift/user-records/${id}`;
    if (role === "doctor") return `/doctor/my-shifts/${id}`;
    if (role === "medical-director")
      return `/medical-director/shift/user-records/${id}`;
    if (role === "laboratory") return `/laboratory/user-records/${id}`;
    if (role === "pharmacy") return `/pharmacy/user-records/${id}`;
  };

  // Get role from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "";
    setRole(storedRole);
  }, []);

  // Fetch shifts data
  useEffect(() => {
    const storedId = localStorage.getItem("uid");
    if (storedId && role) {
      const endpoint = endpointManagent(role, storedId);
      setUserId(storedId);
      getStaffShifts(storedId, endpoint);
    }
  }, [role, getStaffShifts]);

  // Format date for lookup
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Get shifts for a specific date
  const getShiftsForDate = (date: Date) => {
    const formattedDate: any = formatDate(date);
    const dateShifts = staffShift[formattedDate] || {};

    // Convert object to array of shift objects
    return Object.entries(dateShifts).map(([shiftType, shifts]) => {
      const shift = (shifts as ShiftData[])[0]; // Get the first shift of this type
      return {
        type: shiftType,
        color: shiftColors[shiftType] || shiftColors.default,
        startTime: shift?.start_time || "",
        endTime: shift?.end_time || "",
        departments: shift?.clinical_departments || [],
      };
    });
  };

  // Generate list view data for the current month
  const generateListViewData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const listData: ShiftListItem[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = formatDate(date);
      const shifts = getShiftsForDate(date);

      // Only include days with shifts
      if (shifts.length > 0) {
        listData.push({
          date,
          dateString,
          shifts,
        });
      }
    }

    return listData.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  // Format full date for list view
  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Generate calendar data
  const generateCalendarData = (year: number, month: number): DayData[] => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const calendarData: DayData[] = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    // Previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = prevMonthLastDay - startingDayOfWeek + i + 1;
      const date = new Date(year, month - 1, prevMonthDay);
      calendarData.push({
        date,
        dateString: formatDate(date),
        shifts: getShiftsForDate(date),
        inCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      calendarData.push({
        date,
        dateString: formatDate(date),
        shifts: getShiftsForDate(date),
        inCurrentMonth: true,
      });
    }

    // Fill remaining cells with next month
    const totalDays = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;
    const remainingDays = totalDays - calendarData.length;

    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      calendarData.push({
        date,
        dateString: formatDate(date),
        shifts: getShiftsForDate(date),
        inCurrentMonth: false,
      });
    }

    return calendarData;
  };

  const calendarData = generateCalendarData(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const listViewData = generateListViewData();

  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Format time from 24hr format to AM/PM
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Format shift type for display (capitalize first letter)
  const formatShiftType = (shiftType: string) => {
    return shiftType.charAt(0).toUpperCase() + shiftType.slice(1);
  };

  // Open modal with day data
  const openDayModal = (dayData: DayData) => {
    setModalData({
      isOpen: true,
      date: dayData.date,
      shifts: dayData.shifts,
    });
  };

  // Close modal
  const closeModal = () => {
    setModalData({
      isOpen: false,
      date: null,
      shifts: [],
    });
  };

  // Format date for modal header
  const formatModalDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full p-2 md:p-4 bg-white rounded-lg shadow">
      {/* Mobile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <div className="flex justify-between items-center w-full md:w-auto">
          <h1 className="text-lg md:text-xl font-bold text-primary">
            My Shifts
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
              className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md ${
                viewMode === "month" ? "bg-primary text-white" : "bg-gray-100"
              }`}
              onClick={() => setViewMode("month")}
            >
              <Calendar size={16} />
              <span>Month</span>
            </button>
            <button
              className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md ${
                viewMode === "list" ? "bg-primary text-white" : "bg-gray-100"
              }`}
              onClick={() => setViewMode("list")}
            >
              <List size={16} />
              <span>List</span>
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
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading shifts...</p>
        </div>
      ) : (
        <>
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
                    className={`px-1 md:px-2 py-2 md:py-4 border border-[#EAECF0] rounded-md shadow ${
                      !dayData.inCurrentMonth ? "bg-gray-50" : "bg-white"
                    } ${
                      isToday(dayData.date) && dayData.inCurrentMonth
                        ? "ring-2 ring-[#009952]"
                        : ""
                    } ${
                      dayData.shifts.length > 0
                        ? "cursor-pointer hover:bg-gray-50 transition-colors"
                        : ""
                    }`}
                    onClick={() =>
                      dayData.shifts.length > 0 && openDayModal(dayData)
                    }
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

                    <div className="space-y-1 md:space-y-2">
                      {dayData.shifts
                        .slice(0, isMobile ? 1 : 2)
                        .map((shift, shiftIndex) => (
                          <div
                            key={`shift-${dayData.dateString}-${shiftIndex}`}
                            className={`${shift.color} text-xs p-1.5 rounded`}
                          >
                            <div className="font-medium">
                              {formatShiftType(shift.type)}
                            </div>
                            {shift.startTime && (
                              <div className="text-xs mt-1">
                                {formatTime(shift.startTime)}
                              </div>
                            )}

                            {shift.departments &&
                              shift.departments.length > 0 && (
                                <div className="mt-1.5 text-xs border-l-2 border-indigo-400 pl-1.5">
                                  <p className="font-medium text-gray-600">
                                    Departments:
                                  </p>
                                  <p className="text-gray-700 truncate">
                                    {shift.departments
                                      .slice(0, isMobile ? 1 : 2)
                                      .join(", ")}
                                    {shift.departments.length >
                                      (isMobile ? 1 : 2) && (
                                      <span className="text-xs text-gray-500">
                                        {" "}
                                        +
                                        {shift.departments.length -
                                          (isMobile ? 1 : 2)}{" "}
                                        more
                                      </span>
                                    )}
                                  </p>
                                </div>
                              )}
                          </div>
                        ))}
                      {dayData.shifts.length > (isMobile ? 1 : 2) && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayData.shifts.length - (isMobile ? 1 : 2)} more
                        </div>
                      )}
                      {dayData.shifts.length === 0 && <div className="h-10" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="border border-[#EAECF0] rounded-md divide-y divide-gray-200">
              {listViewData.length > 0 ? (
                listViewData.map((dayData: any) => (
                  <div
                    key={`list-${dayData.dateString}`}
                    className={`p-3 ${
                      isToday(dayData.date) ? "bg-gray-50" : ""
                    } cursor-pointer hover:bg-gray-50 transition-colors`}
                    onClick={() => openDayModal(dayData)}
                  >
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

                    <div className="mt-2 space-y-3">
                      {dayData.shifts.map((shift: any, shiftIndex: any) => (
                        <div
                          key={`list-shift-${shiftIndex}`}
                          className={`${shift.color} p-3 rounded-md`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">
                              {formatShiftType(shift.type)}
                            </span>
                            {shift.startTime && (
                              <span className="text-xs">
                                {formatTime(shift.startTime)}
                              </span>
                            )}
                          </div>

                          {shift.departments &&
                            shift.departments.length > 0 && (
                              <div className="mt-2 text-xs border-l-2 border-indigo-400 pl-2">
                                <p className="font-medium text-gray-600">
                                  Departments:
                                </p>
                                <p className="text-gray-700">
                                  {shift.departments.join(", ")}
                                </p>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No shifts scheduled for this month
                </div>
              )}
            </div>
          )}

          {/* Shift Details Modal */}
          {modalData.isOpen && (
            <div className="fixed inset-0 bg-[#1E1E1E40]  bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center border-b p-4">
                  <h2 className="text-lg font-semibold">
                    {formatModalDate(modalData.date)}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4">
                  {modalData.shifts.length > 0 ? (
                    <div className="space-y-4">
                      {modalData.shifts.map((shift, index) => (
                        <div
                          key={`modal-shift-${index}`}
                          className={`${shift.color} p-4 rounded-lg`}
                        >
                          <h3 className="text-lg font-medium">
                            {formatShiftType(shift.type)} Shift
                          </h3>

                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {shift.startTime && (
                              <div>
                                <p className="text-sm font-medium text-gray-600">
                                  Start Time
                                </p>
                                <p>{formatTime(shift.startTime)}</p>
                              </div>
                            )}

                            {shift.endTime && (
                              <div>
                                <p className="text-sm font-medium text-gray-600">
                                  End Time
                                </p>
                                <p>{formatTime(shift.endTime)}</p>
                              </div>
                            )}
                          </div>

                          {shift.departments &&
                            shift.departments.length > 0 && (
                              <div className="mt-4 border-t pt-2">
                                <p className="text-sm font-medium text-gray-600">
                                  Departments
                                </p>
                                <ul className="mt-1 list-disc pl-5">
                                  {shift.departments.map((dept, deptIndex) => (
                                    <li
                                      key={`dept-${deptIndex}`}
                                      className="text-sm"
                                    >
                                      {dept}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No shifts scheduled for this day
                    </p>
                  )}
                </div>

                <div className="border-t p-4 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserShifts;
