import React from "react";
import OverviewCard from "../../ReusabledashboardD/Overviewcard";
import PharmCard from "./PharmCard";
import PharmChart from "./PharmChart";

const PharmDash = () => {
  return (
    <div className="font-inter">
      <div className=" flex flex-col gap-4">
        <OverviewCard
          cardTitle="Pharmacy Dashboard"
          category="Pharmacy"
          limit={3}
        />
        <PharmChart />
        <PharmCard />
      </div>
    </div>
  );
};

export default PharmDash;
