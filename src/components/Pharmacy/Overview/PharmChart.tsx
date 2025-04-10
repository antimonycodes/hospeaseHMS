import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useChartStore } from "../../../store/staff/useChartStore";

type DataPoint = {
  month: string;
  value1: number;
  value2: number;
};

const PharmChart = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { pharmData, getPharmData, isLoading } = useChartStore();

  useEffect(() => {
    getPharmData("/pharmacy/dispersal-graphical-representation");
  }, [getPharmData]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const chartData: DataPoint[] = pharmData
    ? pharmData.months.map((month: string, index: number) => ({
        month: month, // Already "Jan", "Feb", etc. from API
        value1: parseFloat(pharmData.monthly_earnings[index] || "0"),
        value2: parseFloat(pharmData.monthly_earnings[index] || "0") * 0.54, // Example derivation
      }))
    : [];

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
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
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
                domain={[100, 800]}
                ticks={[100, 200, 300, 400, 500, 600, 700, 800]}
                tick={{ fontSize: isMobile ? 12 : 14, fill: "black" }}
                width={isMobile ? 30 : 40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value1" name="Dispersal" fill="#3354F4" />
              <Bar dataKey="value2" name="Derived Value" fill="#F61FA0" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PharmChart;
