import React from "react";
import OverviewCard from "../../ReusabledashboardD/Overviewcard";
import InventoryChart from "./InventoryChart";
import InventoryCard from "./InventoryCard";

const InventoryDash = () => {
  return (
    <div className="font-inter">
      <div className=" flex flex-col gap-4">
        <OverviewCard
          cardTitle="Inventory Dashboard"
          category="inventory"
          limit={2}
        />
        <InventoryChart />
        <InventoryCard />
      </div>
    </div>
  );
};

export default InventoryDash;
