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
  earnings: number; // Single value for simplicity
};

// Helper function to format currency
const formatNaira = (amount: number) => {
  return `₦${amount.toLocaleString()}`;
};

// Custom YAxis tick formatter
const formatYAxisTick = (value: number) => {
  if (value >= 1000000) {
    return `₦${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `₦${(value / 1000).toFixed(0)}K`;
  }
  return `₦${value}`;
};

const FinanceCharts = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [chartType, setChartType] = useState<"income" | "expenses">("income");
  const {
    incomeData,
    expensesData,
    getIncomeData,
    getExpensesData,
    isLoading,
  } = useChartStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    getIncomeData();
    getExpensesData();
  }, [getIncomeData, getExpensesData]);

  // Define the ChartData type
  type ChartData = {
    monthly_earnings: string[]; // Array of earnings as strings
    months: string[]; // Array of month names
  };

  const transformData = (data: ChartData | null): DataPoint[] => {
    if (!data || !data.monthly_earnings || !data.months) {
      return Array(12)
        .fill(0)
        .map((_, i) => ({
          month: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ][i],
          earnings: 0,
        }));
    }
    return data.months.map((month: string, index: number) => ({
      month: month.slice(0, 3), // Shorten to "Jan", "Feb", etc.
      earnings: parseFloat(
        data.monthly_earnings[index].replace(/,/g, "") || "0"
      ),
    }));
  };

  const chartData =
    chartType === "income"
      ? transformData(incomeData)
      : transformData(expensesData);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: pld.color }}>
              {pld.name}: {formatNaira(pld.value)}
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
        <select
          value={chartType}
          onChange={(e) =>
            setChartType(e.target.value as "income" | "expenses")
          }
          className="w-[80px] px-[8px] py-[7px] border border-[#D0D5DD] text-[11px] rounded-[5px]"
        >
          <option value="income">Income</option>
          <option value="expenses">Expenses</option>
        </select>
        <select className="w-[80px] px-[8px] py-[7px] border border-[#D0D5DD] text-[11px] rounded-[5px]">
          <option>2025</option>
          <option>2024</option>
        </select>
      </div>
      <div className="h-[350px] md:h-[400px]">
        {isLoading ? (
          <div>Loading chart data...</div>
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
                domain={[0, "auto"]} // Dynamic range based on data
                tick={{ fontSize: isMobile ? 12 : 14, fill: "black" }}
                width={isMobile ? 30 : 40}
                tickFormatter={formatYAxisTick}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="earnings"
                name={chartType === "income" ? "Income" : "Expenses"}
                fill={chartType === "income" ? "#3354F4" : "#F61F3C"}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      {/* Simplified legend for single-bar chart */}
      <div className="flex w-full mt-[30px] justify-center items-center">
        <span className="flex items-center gap-2">
          <span
            className={`rounded-full h-[10px] w-[10px] ${
              chartType === "income" ? "bg-[#3354F4]" : "bg-[#F61F3C]"
            }`}
          ></span>
          <p className="text-[10px]">
            {chartType === "income" ? "Income" : "Expenses"}
          </p>
        </span>
      </div>
    </div>
  );
};

export default FinanceCharts;
