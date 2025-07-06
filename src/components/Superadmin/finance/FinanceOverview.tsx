import { useEffect } from "react";
import OverviewCard from "../../ReusabledashboardD/Overviewcard";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import { getImageSrc } from "../../../utils/imageUtils";
import FinanceCharts from "../../Finance/overview/FinanceCharts";

const FinanceOverview = () => {
  const { stats, getFinanceStats, isLoading } = useFinanceStore();

  useEffect(() => {
    getFinanceStats("/admin/finances/finance-chart-data");
  }, [getFinanceStats]);

  console.log("Stats in Foverview:", stats);

  // Calculate net balance (income - expenses)
  const calculateNetBalance = () => {
    if (!stats) return "0";
    const income = parseFloat(
      stats.total_income_balance?.replace(/,/g, "") || "0"
    );
    const expenses = parseFloat(
      stats.total_expenses_balance?.replace(/,/g, "") || "0"
    );
    const netBalance = income - expenses;
    return netBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Calculate monthly net balance
  const calculateMonthlyNetBalance = () => {
    if (!stats) return "0";
    const monthlyIncome = parseFloat(
      stats.total_monthly_balance?.replace(/,/g, "") || "0"
    );
    const monthlyExpenses = parseFloat(
      stats.total_monthly_expenses_balance?.replace(/,/g, "") || "0"
    );
    const monthlyNet = monthlyIncome - monthlyExpenses;
    return monthlyNet.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const financeStatsData = stats
    ? [
        {
          title: "Total Income",
          number: `₦${stats.total_income_balance}` || "₦0",
          icon: getImageSrc("incomeIcon.png"),
          category: "finance",
          description: "All-time revenue",
        },
        {
          title: "Total Expenses",
          number: `₦${stats.total_expenses_balance}` || "₦0",
          icon: getImageSrc("hugeicons.png"),
          category: "finance",
          description: "All-time expenses",
        },

        {
          title: "This Month Income",
          number: `₦${stats.total_monthly_balance}` || "₦0",
          icon: getImageSrc("incomeIcon.png"),

          category: "finance",
          description: "Current month revenue",
        },
        {
          title: "This Month Expenses",
          number: `₦${stats.total_monthly_expenses_balance}` || "₦0",
          icon: getImageSrc("hugeicons.png"),

          category: "finance",
          description: "Current month expenses",
        },
      ]
    : [];

  console.log("Finance Stats Data:", financeStatsData);

  return (
    <div className="font-inter">
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            {/* <span className="ml-2">Loading finance stats...</span> */}
          </div>
        ) : (
          <OverviewCard
            cardTitle="Finance Dashboard"
            category="finance"
            limit={6} // Updated to show all 6 cards
            data={financeStatsData}
          />
        )}
        <FinanceCharts />
      </div>
    </div>
  );
};

export default FinanceOverview;
