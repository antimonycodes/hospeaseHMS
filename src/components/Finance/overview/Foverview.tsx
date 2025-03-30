import OverviewCard from "../../ReusabledashboardD/Overviewcard";
import FinanceCard from "./FinanceCard";
import FinanceCharts from "./FinanceCharts";

const Foverview = () => {
  return (
    <div className="font-inter">
      <div className=" flex flex-col gap-4">
        <OverviewCard
          cardTitle="Finance Dashboard"
          category="finance"
          limit={3}
        />
        <FinanceCharts />
        <FinanceCard />
      </div>
    </div>
  );
};

export default Foverview;
