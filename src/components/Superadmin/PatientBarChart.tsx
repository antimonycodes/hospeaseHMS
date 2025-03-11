import { ArrowDown, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type DataPoint = {
  month: string;
  value1: number;
  value2: number;
  value3: number;
};

const data: DataPoint[] = [
  { month: "Jan", value1: 350, value2: 450, value3: 400 },
  { month: "Feb", value1: 500, value2: 650, value3: 200 },
  { month: "Mar", value1: 400, value2: 550, value3: 450 },
  { month: "Apr", value1: 600, value2: 600, value3: 580 },
  { month: "May", value1: 650, value2: 680, value3: 600 },
  { month: "Jun", value1: 300, value2: 600, value3: 400 },
  { month: "Jul", value1: 400, value2: 750, value3: 350 },
  { month: "Aug", value1: 750, value2: 750, value3: 450 },
  { month: "Sep", value1: 500, value2: 700, value3: 400 },
  { month: "Oct", value1: 450, value2: 700, value3: 500 },
  { month: "Nov", value1: 400, value2: 350, value3: 380 },
  { month: "Dec", value1: 550, value2: 800, value3: 520 },
];

const PatientBarChart = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const years = ["2021", "2022", "2023", "2024"];

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

    // Initial check
    checkMobile();

    window.addEventListener("resize", checkMobile);

    // Cleanup
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
    <div className="w-full   bg-white rounded-lg p-6 custom-shadow">
      <div className=" flex items-center justify-between md:mx-12">
        <h1 className=" text-gray-500 text-xs md:text-sm font-medium">
          PATIENT VISIT BY GENDER
        </h1>
        {/* Year Dropdown */}
        <div
          className="relative border border-neutrals200 w-fit py-2 px-2 rounded-lg flex gap-2  cursor-pointer"
          onMouseEnter={handleYearMouseEnter}
          onMouseLeave={handleYearMouseLeave}
        >
          <h1 className=" ">{selectedYear}</h1>
          {/* <img src={downArrow} alt="Down Arrow" /> */}
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
      <div className=" h-[350px] md:h-full " style={{ height: "450px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: isMobile ? 10 : 10,
              left: isMobile ? 0 : 0,
              bottom: 5,
            }}
            barSize={6}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: isMobile ? 12 : 14 }}
              interval={isMobile ? 0 : 0}
            />
            <YAxis
              domain={[100, 800]} // Set the Y-axis domain to start from 100 and end at 800
              ticks={[100, 200, 300, 400, 500, 600, 700, 800]} // Explicitly define the tick values
              tick={{ fontSize: isMobile ? 12 : 14 }}
              width={isMobile ? 30 : 40}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* <Legend
              wrapperStyle={{
                fontSize: isMobile ? "12px" : "14px",
                paddingTop: "10px",
              }}
            /> */}
            <Bar
              dataKey="value1"
              name="Value 1"
              fill="#009952"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="value2"
              name="Value 2"
              fill="#B58A00"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="value3"
              name="Value 3"
              fill="#9383EF"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PatientBarChart;
