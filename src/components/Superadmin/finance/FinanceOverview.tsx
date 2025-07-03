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

  const financeStatsData = stats
    ? [
        {
          title: "Income ",
          number: `₦${stats.total_income_balance}` || "0",
          icon: getImageSrc("incomeIcon.png"),
          category: "finance",
        },
        {
          title: "Expenses",
          number: `₦${stats.total_expenses_balance}` || "0",
          icon: getImageSrc("hugeicons.png"),
          category: "finance",
        },
      ]
    : [];

  console.log("Finance Stats Data:", financeStatsData);

  return (
    <div className="font-inter">
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div>Loading stats...</div>
        ) : (
          <OverviewCard
            cardTitle="Finance Dashboard"
            category="finance"
            limit={3}
            data={financeStatsData}
          />
        )}
        <FinanceCharts />
      </div>
    </div>
  );
};

export default FinanceOverview;
