import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";

// Types
type ShiftData = {
  shift_type: string;
  start_time: string;
  end_time: string;
  clinical_departments: string[];
};

type StaffShiftData = {
  [date: string]: ShiftData[];
};

type DayData = {
  date: Date;
  shift: {
    type: string;
    color: string;
    startTime?: string;
    departments?: string[];
  } | null;
  inCurrentMonth: boolean;
};

const UserShifts = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");

  const { getStaffShifts, staffShift, isLoading } = useGlobalStore();

  const formatMonthYear = (date: Date) =>
    date.toLocaleString("default", { month: "long", year: "numeric" });

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  const goToToday = () => setCurrentDate(new Date());

  const endpointManagent = (role: string, id: string) => {
    if (role === "nurse") return `/nurses/shift/user-records/${id}`;
    if (role === "doctor") return `/doctor/my-shifts/${id}`;
    if (role === "medical-director")
      return `/medical-director/shift/user-records/${id}`;
    if (role === "laboratory") return `/laboratory/user-records/${id}`;
    if (role === "pharmacy") return `/pharmacy/user-records/${id}`;
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "";
    setRole(storedRole);
  }, []);

  useEffect(() => {
    const storedId = localStorage.getItem("uid");
    if (storedId && role) {
      const endpoint = endpointManagent(role, storedId);
      setUserId(storedId);
      getStaffShifts(storedId, endpoint);
    }
  }, [role, getStaffShifts]);

  const formatDate = (date: Date) => date.toLocaleDateString("en-CA"); // "YYYY-MM-DD"

  const getShiftForDate = (date: Date) => {
    if (!staffShift) return null;

    const formattedDate: any = formatDate(date);
    const shift = staffShift[formattedDate]?.[0];

    if (!shift) return null;

    const colorMap: Record<string, string> = {
      Morning: "text-[#B13E00] bg-[#FFF3F0]",
      Afternoon: "text-[#016838] bg-[#E0FFF1]",
      Night: "text-[#101828] bg-[#EFF4FF]",
      default: "text-gray-700 bg-gray-100",
    };

    return {
      type: shift.shift_type,
      color: colorMap[shift.shift_type] || colorMap.default,
      startTime: shift.start_time,
      departments: shift.clinical_departments,
    };
  };

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
        shift: getShiftForDate(date),
        inCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      calendarData.push({
        date,
        shift: getShiftForDate(date),
        inCurrentMonth: true,
      });
    }

    // Fill remaining cells with next month
    const totalDays = Math.ceil(calendarData.length / 7) * 7;
    const remainingDays = totalDays - calendarData.length;

    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      calendarData.push({
        date,
        shift: getShiftForDate(date),
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

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center px-4 mb-4">
        <h1 className="text-xl font-bold">My Shifts</h1>
        <div className="flex items-center gap-4">
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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading shifts...</p>
        </div>
      ) : (
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
              className={`px-2 py-4 border border-[#EAECF0] rounded-md shadow ${
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
                    ? "text-primary"
                    : dayData.inCurrentMonth
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                {dayData.date.getDate()}
              </div>

              {dayData.shift ? (
                <div className="space-y-1">
                  <div
                    className={`${dayData.shift.color} text-xs p-1.5 rounded`}
                  >
                    <div className="font-medium">{dayData.shift.type}</div>
                    {dayData.shift.startTime && (
                      <div
                        className={`text-xs mt-1 ${
                          dayData.shift.color.split(" ")[0]
                        }`}
                      >
                        {formatTime(dayData.shift.startTime)}
                      </div>
                    )}
                  </div>

                  {dayData.shift.departments &&
                    dayData.shift.departments.length > 0 && (
                      <div className="mt-1.5 text-xs border-l-2 border-indigo-400 pl-1.5">
                        <p className="font-medium text-gray-600">
                          Departments:
                        </p>
                        <p className="text-gray-700">
                          {dayData.shift.departments.join(", ")}
                        </p>
                      </div>
                    )}
                </div>
              ) : (
                <div className="h-10" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserShifts;
