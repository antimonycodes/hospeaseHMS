import FinanceBarchart from "./FinanceBarchart";
import FinanceStatsCards from "./FinanceStatsCards";

const FinanceOverview = () => {
  return (
    <div className="  mt-4 space-y-4">
      <FinanceStatsCards />
      <FinanceBarchart />
    </div>
  );
};

export default FinanceOverview;
