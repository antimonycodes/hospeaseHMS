import React from "react";
import Overviewcard from "../../ReusabledashboardD/Overviewcard";
import OverviewChart from "../../ReusabledashboardD/OverviewChart";
import LaboverviewTable from "./LaboverviewTable";

const Laboverview = () => {
  return (
    <div className="font-inter">
      <div className=" flex flex-col gap-4">
        <Overviewcard cardTitle="Laboratory Dashboard" />
        <OverviewChart ChartTitle="Laboratory Tests" />
        <LaboverviewTable />
      </div>
    </div>
  );
};

export default Laboverview;
