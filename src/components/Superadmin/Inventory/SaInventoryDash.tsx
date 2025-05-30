import React, { useEffect, useState } from "react";
import patientIcon from "../../../assets/hugeicons.png";
import { useInventoryStore } from "../../Inventory/overview/useInventoryStore";
import OverviewCard from "../../ReusabledashboardD/Overviewcard";
import Loader from "../../../Shared/Loader";
import InventoryChart from "../../Inventory/overview/InventoryChart";
import InventoryDash from "../../Inventory/overview/InventoryDash";
import InventoryCard from "../../Inventory/overview/InventoryCard";
import SaInventoryRecent from "./SaInventoryRecent";
interface StatsData {
  total_inventories: number;
  total_categories: number;
  total_expired_items: number;
}

const SaInventoryDash = () => {
  const { stats, getInventoryStats, isLoading } = useInventoryStore();

  useEffect(() => {
    console.log("Fetching stats...");
    getInventoryStats("/admin/inventory/stats");
  }, [getInventoryStats]);

  useEffect(() => {
    console.log("Raw stats from store:", stats);
    console.log("isLoading:", isLoading);
  }, [stats, isLoading]);

  // Try multiple approaches to extract the data
  const statsData: Partial<StatsData> =
    (stats && typeof stats === "object" ? stats : {}) || {};

  console.log("Extracted statsData:", statsData);

  // Check if any of the required fields exist
  const hasValidData = Boolean(
    statsData.total_inventories !== undefined ||
      statsData.total_categories !== undefined ||
      statsData.total_expired_items !== undefined
  );

  console.log("Has valid data:", hasValidData);

  console.log("Stats data for cards:", statsData);

  // Create InventoryStatsData matching the category exactly
  const InventoryStatsData = hasValidData
    ? [
        {
          title: "Total Inventories",
          number: (statsData.total_inventories ?? 0).toString(),
          icon: patientIcon,
          category: "inventory", // Must match the category prop passed to OverviewCard
        },
        {
          title: "Total Categories",
          number: (statsData.total_categories ?? 0).toString(),
          icon: patientIcon,
          category: "inventory", // Must match the category prop passed to OverviewCard
        },
        {
          title: "Total Expired Items",
          number: (statsData.total_expired_items ?? 0).toString(),
          icon: patientIcon,
          category: "inventory", // Must match the category prop passed to OverviewCard
        },
      ]
    : [];

  console.log("Data being passed to OverviewCard:", InventoryStatsData);

  return (
    <div className="font-inter">
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {/* Debug display to verify the data */}
            {/* <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
              <p>Debug info: Has valid data: {hasValidData ? "Yes" : "No"}</p>
              <p>Items in InventoryStatsData: {InventoryStatsData.length}</p>
            </div> */}

            <OverviewCard
              cardTitle="Inventory Dashboard"
              category="inventory"
              limit={3}
              data={InventoryStatsData}
            />
          </>
        )}
        <InventoryChart />
        <SaInventoryRecent />
      </div>
    </div>
  );
};

export default SaInventoryDash;
