import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import Loader from "../../../Shared/Loader";
import Button from "../../../Shared/Button";

// Types
type ShiftCount = {
  Morning: number;
  Afternoon: number;
  Night: number;
};

type ShiftData = {
  [date: string]: ShiftCount;
};

type DayData = {
  date: Date;
  shifts: {
    title: string;
    count: number;
    color: string;
  }[];
  inCurrentMonth: boolean;
};

type DoctorShift = {
  shift_type: string;
  doctor: string;
  start_time: string;
  clinical_department: string;
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

  // Set role from localStorage once
  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "admin";
    setRole(storedRole);
  }, []);

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

  // Handle date click
  const handleDateClick = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
    getShiftDetails(formattedDate);
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

  const getShiftsForDate = (
    date: Date
  ): { title: string; count: number; color: string }[] => {
    const formattedDate: any = date.toISOString().split("T")[0];
    const dateData = allShifts?.[formattedDate] || {
      Morning: 0,
      Afternoon: 0,
      Night: 0,
    };

    return [
      {
        title: "Morning",
        count: dateData.Morning,
        color: "text-[#B13E00] bg-[#FFF3F0]",
      },
      {
        title: "Afternoon",
        count: dateData.Afternoon,
        color: "text-[#016838] bg-[#E0FFF1]",
      },
      {
        title: "Night",
        count: dateData.Night,
        color: "text-[#101828] bg-[#EFF4FF]",
      },
    ];
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
      calendarData.push({
        date,
        shifts: getShiftsForDate(date),
        inCurrentMonth: false,
      });
    }

    // Handle days for the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      calendarData.push({
        date,
        shifts: getShiftsForDate(date),
        inCurrentMonth: true,
      });
    }

    // Handle days from the next month to fill the grid
    const totalDaysInGrid =
      Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;
    const remainingDays = totalDaysInGrid - calendarData.length;

    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      calendarData.push({
        date,
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
    ? shiftDetails?.filter(
        (doctor: DoctorShift) => doctor.shift_type === selectedShiftType
      )
    : shiftDetails;

  // Format time from 24hr format to AM/PM
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Calculate the number of doctors on duty based on filtered results
  const doctorsOnDutyCount = filteredDoctors?.length || 0;

  if (isLoading) return <Loader />;

  return (
    <div className="w-full  bg-white rounded-lg ">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl lg:text-2xl font-bold text-primary">
          Shift Management
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
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
          <Link to="/dashboard/create-shift">
            <Button>Create New Shift</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 px-4 py-6 border border-[#EAECF0] overflow-x-auto">
        {weekdays.map((day, index) => (
          <div
            key={`weekday-${index}`}
            className="text-center py-2 text-sm font-semibold"
          >
            {day}
          </div>
        ))}

        {calendarData.map((dayData, index) => (
          <div
            key={`day-${index}`}
            className={`px-2 py-4 border border-[#EAECF0] rounded-md shadow cursor-pointer hover:bg-gray-50 transition-colors ${
              !dayData.inCurrentMonth ? "bg-gray-50" : "bg-white"
            } ${
              isToday(dayData.date) && dayData.inCurrentMonth
                ? "ring-2 ring-[#009952]"
                : ""
            }`}
            onClick={() => handleDateClick(dayData.date)}
          >
            <div
              className={`text-right mb-1 font-medium ${
                isToday(dayData.date)
                  ? "text-primary"
                  : dayData.inCurrentMonth
                  ? "text-gray-700"
                  : "text-gray-400"
              }`}
            >
              {dayData.date.getDate()}
            </div>
            <div className="space-y-3">
              {dayData.shifts.map((shift, shiftIndex) => (
                <div
                  key={`shift-${dayData.date.toISOString()}-${shiftIndex}`}
                  className={`${shift.color} text-xs p-1 rounded flex items-center justify-between`}
                >
                  <span>{shift.title}</span>
                  <span>{shift.count}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for shift details */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Shift Details -{" "}
                {selectedDate
                  ? new Date(selectedDate).toLocaleDateString()
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

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>

                {showFilters && (
                  <div className="flex gap-2 ml-2">
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
                    <button
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedShiftType === "Morning"
                          ? "bg-[#B13E00] text-white"
                          : "bg-[#FFF3F0] text-[#B13E00]"
                      }`}
                      onClick={() => setSelectedShiftType("Morning")}
                    >
                      Morning
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedShiftType === "Afternoon"
                          ? "bg-[#016838] text-white"
                          : "bg-[#E0FFF1] text-[#016838]"
                      }`}
                      onClick={() => setSelectedShiftType("Afternoon")}
                    >
                      Afternoon
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedShiftType === "Night"
                          ? "bg-[#101828] text-white"
                          : "bg-[#EFF4FF] text-[#101828]"
                      }`}
                      onClick={() => setSelectedShiftType("Night")}
                    >
                      Night
                    </button>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-500">
                {doctorsOnDutyCount} staffs on duty
              </div>
            </div>

            {filteredDoctors && filteredDoctors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Staffs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shift
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDoctors.map(
                      (doctor: DoctorShift, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {doctor.doctor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doctor.clinical_department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
