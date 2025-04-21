import React, { useEffect } from "react";
import patientIcon from "../../../assets/hugeicons.png";
import { useInventoryStore } from "../../Inventory/overview/useInventoryStore";
import OverviewCard from "../../ReusabledashboardD/Overviewcard";

const SaInventoryDash = () => {
  const { stats, getInventoryStats, isLoading } = useInventoryStore();

  useEffect(() => {
    console.log(getInventoryStats, "Fetching stats...");
    getInventoryStats("/admin/inventory/stats");
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

  //   console.log("Inventory Stats Data:", InventoryStatsData);

  return (
    <div className="font-inter">
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <p>Loading inventory stats...</p>
        ) : InventoryStatsData.length > 0 ? (
          <OverviewCard
            cardTitle="Inventory Dashboard"
            category="inventory"
            limit={3}
            data={InventoryStatsData}
          />
        ) : (
          <div>No stats available</div>
        )}
      </div>
    </div>
  );
};

export default SaInventoryDash;
