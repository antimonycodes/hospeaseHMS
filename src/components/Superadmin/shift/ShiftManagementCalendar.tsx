import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

const ShiftManagementCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { getStaffShifts, staffShift, isLoading } = useGlobalStore();

  const [role, setRole] = useState("");

  // Set role from localStorage once
  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "superadmin";
    setRole(storedRole);
  }, []);

  const endpointManagent = (userRole: string) => {
    if (userRole === "admin") return "/admin/shift/user-records";
    if (userRole === "matron") return "/matron/shift/user-records";
    if (userRole === "medical-director")
      return "/medical-director/shift/user-records";
    return "/superadmin/staff-shift"; // fallback
  };

  // Trigger API fetch only when `role` is set
  useEffect(() => {
    if (role) {
      const endpoint = endpointManagent(role);
      console.log("Role:", role);
      console.log("Endpoint:", endpoint);
      getStaffShifts(endpoint);
    }
  }, [getStaffShifts, role]);

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
    const dateData = staffShift?.[formattedDate] || {
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

  if (isLoading) return <Loader />;

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center px-4 mb-4">
        <h1 className="text-xl font-bold">Shift Management</h1>
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

      <div className="grid grid-cols-7 gap-4 px-4 py-6  border border-[#EAECF0] overflow-x-auto">
        {weekdays.map((day, index) => (
          <div
            key={`weekday-${index}`}
            className="text-center py-2 text-sm font-semibold "
          >
            {day}
          </div>
        ))}

        {calendarData.map((dayData, index) => (
          <div
            key={`day-${index}`}
            className={`px-2 py-4 border border-[#EAECF0] rounded-md shadow   ${
              !dayData.inCurrentMonth ? "bg-gray-50" : "bg-white"
            } ${
              isToday(dayData.date) && dayData.inCurrentMonth
                ? "ring-2 ring-[#009952]"
                : ""
            }`}
          >
            <div
              className={`text-right mb-1 font-medium ${
                isToday(dayData.date)
                  ? "text-blue-500"
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
                  className={`${shift.color} text-xs p-1 rounded grid grid-cols-2`}
                >
                  <span>{shift.title}</span>
                  <span>{shift.count}</span> {/* always show 0 if no data */}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShiftManagementCalendar;
