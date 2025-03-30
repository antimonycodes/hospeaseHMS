import React from "react";
import OverviewCard from "../../ReusabledashboardD/Overviewcard";
import Nursechart from "./Nursechart";
import NurseCard from "./NurseCard";

const NurseDash = () => {
  return (
    <div className="font-inter">
      <div className=" flex flex-col gap-4">
        <OverviewCard cardTitle="Nurse Dashboard" category="lab" limit={4} />
        <Nursechart />
        <NurseCard />
      </div>
    </div>
  );
};

export default NurseDash;
