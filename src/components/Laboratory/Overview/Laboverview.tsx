import React from "react";
import Overviewcard from "../../ReusabledashboardD/Overviewcard";
import OverviewChart from "../../ReusabledashboardD/OverviewChart";

const Laboverview = () => {
  return (
    <div className="font-inter">
      <div className=" flex flex-col gap-4">
        <Overviewcard cardTitle="Laboratory Dashboard" />
        <OverviewChart />
      </div>
    </div>
  );
};

export default Laboverview;
