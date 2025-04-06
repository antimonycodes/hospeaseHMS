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

interface DoctorStats {
  graph_appointment_representation?: Record<string, number>;
}

interface DoctorBarchartProps {
  doctorStats: DoctorStats;
  isLoading: boolean;
}

const DoctorBarchart = ({ doctorStats, isLoading }: DoctorBarchartProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const formattedData = doctorStats?.graph_appointment_representation
    ? Object.entries(doctorStats.graph_appointment_representation).map(
        ([month, count]) => ({
          month,
          appointments: count,
        })
      )
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
        <h1>Appointment Chart</h1>
        <button>Guess</button>
      </div>
      <div className="h-[350px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{
              top: 20,
              right: isMobile ? 10 : 10,
              left: isMobile ? 0 : 0,
              bottom: 5,
            }}
            barSize={10}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: isMobile ? 12 : 14, fill: "black" }}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: isMobile ? 12 : 14, fill: "black" }}
              width={isMobile ? 30 : 40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="appointments" name="Appointments" fill="#3354F4" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DoctorBarchart;
