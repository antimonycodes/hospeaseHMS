import OverviewCard from "../../ReusabledashboardD/Overviewcard";
import OverviewChart from "../../ReusabledashboardD/OverviewChart";
import LaboverviewTable from "./LaboverviewTable";

const Laboverview = () => {
  return (
    <div className="font-inter">
      <div className=" flex flex-col gap-4">
        <OverviewCard
          cardTitle="Laboratory Dashboard"
          category="lab"
          limit={4}
        />
        <OverviewChart ChartTitle="Laboratory Tests" />
        <LaboverviewTable />
      </div>
    </div>
  );
};

export default Laboverview;
