import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useStatsStore } from "../../store/super-admin/useStatsStore";
import { ChevronDown } from "lucide-react";

const formatGraphData = (graphData: Record<string, number>) => {
  return Object.entries(graphData).map(([month, value]) => ({
    month,
    appointments: value,
  }));
};

const FrontdeskChart = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const { stats } = useStatsStore();

  const years = ["2025"];
  const chartData = stats?.hospital_appointment_management_graphical_reps
    ? formatGraphData(stats.hospital_appointment_management_graphical_reps)
    : [];

  const handleYearMouseEnter = () => setIsYearDropdownOpen(true);
  const handleYearMouseLeave = () => setIsYearDropdownOpen(false);

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setIsYearDropdownOpen(false);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg custom-shadow">
          <p className="font-semibold">{label}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: pld.color }}>
              {pld.name}: {pld.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-lg p-6 custom-shadow">
      <div className="flex items-center justify-between md:mx-12">
        <h1 className="text-gray-500 text-xs md:text-sm font-medium">
          PATIENT APPOINTMENT
        </h1>
        {/* Year Dropdown */}
        <div
          className="relative border border-neutrals200 w-fit py-2 px-2 rounded-lg flex gap-2 cursor-pointer"
          onMouseEnter={handleYearMouseEnter}
          onMouseLeave={handleYearMouseLeave}
        >
          <h1 className="">{selectedYear}</h1>
          <ChevronDown />
          <div
            className={`absolute bg-white border border-[#A1A1AA] mt-8 rounded-lg shadow-lg z-10 transition-opacity duration-300 ${
              isYearDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            {years.map((year, index) => (
              <div
                key={index}
                className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleYearSelect(year)}
              >
                {year}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-[350px] md:h-full" style={{ height: "450px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: isMobile ? 10 : 10,
              left: isMobile ? 0 : 0,
              bottom: 5,
            }}
            barSize={isMobile ? 10 : 20}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: isMobile ? 12 : 14 }}
              interval={0}
            />
            {/* <YAxis
               domain={[0, (dataMax) => Math.max(dataMax + 2, 5)]}
               tick={{ fontSize: isMobile ? 12 : 14 }}
               width={isMobile ? 30 : 40}
             /> */}

            <YAxis
              domain={[0, "dataMax + 10"]} // Adds 10 to the highest value
              tickCount={6} // Approximate number of ticks (Recharts adjusts for "nice" intervals)
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="appointments"
              name="Appointments"
              fill="#009952"
              radius={[4, 4, 0, 0]}
              minPointSize={5}
              label={{ position: "top", fontSize: isMobile ? 10 : 12 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FrontdeskChart;
