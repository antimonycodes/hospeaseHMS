// InventoryDash.tsx
import React, { useEffect } from "react";
import InventoryChart from "./InventoryChart";
import InventoryCard from "./InventoryCard";
import patientIcon from "../../../assets/hugeicons.png";
import { useInventoryStore } from "../overview/useInventoryStore";
import InventoryRequest from "../request/InventoryRequest";

const InventoryDash = () => {
  const { stats, getInventoryStats, isLoading } = useInventoryStore();
  const { getAllRequest, requests } = useInventoryStore();
  useEffect(() => {
    console.log("Fetching stats with getInventoryStats...");
    getInventoryStats();
  }, [getInventoryStats]);

  console.log("Inventory Stats:", stats);

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
          number: stats.total_categories?.toString() ?? "0",
          icon: patientIcon,
          category: "lab",
        },
        {
          title: "Total Expired Items",
          number: stats.total_expired_items?.toString() ?? "0",
          icon: patientIcon,
          category: "lab",
        },
      ]
    : [];

  console.log("InventoryStatsData:", InventoryStatsData);

  return (
    <div className="font-inter">
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <p>Loading inventory stats...</p>
        ) : (
          <div className="font-jakarta">
            <h1 className="font-medium text-[20px] text-[#101828] pb-[21px]">
              Inventory Dashboard
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-3  gap-[21px] w-full">
              {InventoryStatsData.length > 0 ? (
                InventoryStatsData.map(({ title, number, icon }, index) => (
                  <div
                    key={index}
                    className="bg-white custom-shadow w-full rounded-lg border-0 border-gray-200 py-[15px] pl-[43px] pr-[15px] flex flex-col gap-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <img src={icon} alt={title} width={40} height={40} />
                    </div>
                    <h1 className="text-[#71717a] text-xs lg:text-md font-semibold leading-6 tracking-[0.5%]">
                      {title}
                    </h1>
                    <div className="flex items-center gap-2">
                      <h1 className="text-gray-900 font-bold text-[21px]">
                        {number}
                      </h1>
                    </div>
                  </div>
                ))
              ) : (
                <div>No data available</div>
              )}
            </div>
          </div>
        )}
        {/* <InventoryChart
          invenStats={stats || { graph_appointment_representation: {} }}
          isLoading={isLoading}
        /> */}
        <InventoryChart />
        <InventoryCard />
      </div>
    </div>
  );
};

export default InventoryDash;
