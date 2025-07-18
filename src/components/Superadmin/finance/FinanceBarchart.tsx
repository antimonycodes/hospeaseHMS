import React, { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useStatsStore } from "../../../store/super-admin/useStatsStore";

// Helper function to format currency
const formatNaira = (amount: number) => {
  return `₦${amount.toLocaleString()}`;
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    // Find income and expense values from payload
    const incomeData = payload.find((item: any) => item.dataKey === "income");
    const expenseData = payload.find((item: any) => item.dataKey === "expense");

    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow text-sm">
        <p className="font-semibold">{payload[0].payload.month}</p>
        {incomeData && (
          <p className="text-green-600">
            Income: {formatNaira(incomeData.value)}
          </p>
        )}
        {expenseData && (
          <p className="text-red-600">
            Expenses: {formatNaira(expenseData.value)}
          </p>
        )}
      </div>
    );
  }
  return null;
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

const FinanceBarchart = () => {
  const { getExpenseStats, getIncomeStats } = useStatsStore();

  useEffect(() => {
    getExpenseStats();
    getIncomeStats();
  }, [getExpenseStats, getIncomeStats]);

  const incomeStats = useStatsStore((state) => state.incomeStats);
  const expenseStats = useStatsStore((state) => state.expenseStats);

  const months = [
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
  ];

  const parseToNumber = (value: string) => {
    return parseFloat(value.replace(/,/g, ""));
  };

  const combinedFinanceData = months.map((month, index) => {
    const income = incomeStats?.monthly_earnings?.[index]
      ? parseToNumber(incomeStats.monthly_earnings[index])
      : 0;
    const expense = expenseStats?.monthly_earnings?.[index]
      ? parseToNumber(expenseStats.monthly_earnings[index])
      : 0;
    return {
      month,
      income,
      expense,
    };
  });

  const isMobile = window.innerWidth < 768;

  return (
    <div className="w-full h-[400px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={combinedFinanceData}
          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
          />
          <XAxis dataKey="month" tick={{ fontSize: isMobile ? 12 : 14 }} />
          <YAxis
            tick={{ fontSize: isMobile ? 12 : 14 }}
            tickFormatter={formatYAxisTick}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: 30 }}
          />
          <Bar dataKey="income" name="Income" fill="#4CAF50" barSize={20} />
          <Bar dataKey="expense" name="Expenses" fill="#F44336" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceBarchart;
