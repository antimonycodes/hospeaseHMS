import { useEffect, useState } from "react";
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
};

const data: DataPoint[] = [
  {
    month: "Jan",
    value1: 650,
    value2: 350,
  },
  {
    month: "Feb",
    value1: 650,
    value2: 350,
  },
  {
    month: "Mar",
    value1: 650,
    value2: 350,
  },
  {
    month: "Apr",
    value1: 650,
    value2: 350,
  },
  {
    month: "May",
    value1: 650,
    value2: 350,
  },
  {
    month: "Jun",
    value1: 650,
    value2: 350,
  },
  {
    month: "Jul",
    value1: 650,
    value2: 350,
  },
  {
    month: "Aug",
    value1: 650,
    value2: 350,
  },
  {
    month: "Sep",
    value1: 650,
    value2: 350,
  },
  {
    month: "Oct",
    value1: 650,
    value2: 350,
  },
  {
    month: "Nov",
    value1: 650,
    value2: 350,
  },
  {
    month: "Dec",
    value1: 650,
    value2: 350,
  },
];

const PharmChart = () => {
  const [isMobile, setIsMobile] = useState(false);

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
        <div className="bg-white p-4 border rounded-lg shadow-lg">
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
    <div className="w-full bg-white rounded-lg p-10 font-jakarta">
      <div className="flex items-center justify-between pb-10">
        <h1>Dispersal</h1>
        <button>2025</button>
      </div>
      <div className="h-[350px] md:h-[400px]">
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
              tick={{ fontSize: isMobile ? 12 : 14, fill: "black" }}
              interval={isMobile ? 0 : 0}
            />
            <YAxis
              domain={[100, 800]} // Set the Y-axis domain to start from 100 and end at 800
              ticks={[100, 200, 300, 400, 500, 600, 700, 800]} // Explicitly define the tick values
              tick={{ fontSize: isMobile ? 12 : 14, fill: "black" }}
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
              fill="#3354F4"
              //   radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="value2"
              name="Value 2"
              fill="#F61FA0"
              //   radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>{" "}
    </div>
  );
};

export default PharmChart;
