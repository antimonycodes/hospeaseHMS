import React, { useEffect } from "react";
import OverviewCard from "../../ReusabledashboardD/Overviewcard";
import InventoryChart from "./InventoryChart";
import InventoryCard from "./InventoryCard";
import patientIcon from "../../../assets/hugeicons.png";
import { useInventoryStore } from "../overview/useInventoryStore"; // Verify path

type InventoryStockData = {
  name: string;
  patientId: string;
  age: number;
  gender: string;
  phone: string;
  branch: string;
  occupation: string;
  editpatients: string;
  id: string;
};

const InventoryDash = () => {
  const { stats, getInventoryStats, isLoading } = useInventoryStore();

  useEffect(() => {
    console.log(getInventoryStats, "Fetching stats...");
    getInventoryStats();
  }, [getInventoryStats]);

  const InventoryStatsData = stats
    ? [
        {
          title: "Total Inventories",
          number: stats.total_inventories?.toString() ?? "0",
          icon: patientIcon,
          category: "lab",
        },
        {
          title: "Total Categories",
          number: stats.total_categories?.toString() || "0",
          icon: patientIcon,
          category: "lab",
        },
        {
          title: "Total Expired Items",
          number: stats.total_expired_items?.toString() || "0",
          icon: patientIcon,
          category: "lab",
        },
      ]
    : [];

  console.log("Inventory Stats Data:", InventoryStatsData);

  return (
    <div className="font-inter">
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <p>Loading inventory stats...</p>
        ) : (
          <>
            <OverviewCard
              cardTitle="Inventory Dashboard"
              category="inventory"
              limit={2}
              data={InventoryStatsData}
            />
            <InventoryChart />
            {/* <InventoryCard /> */}
          </>
        )}
      </div>
    </div>
  );
};

export default InventoryDash;
