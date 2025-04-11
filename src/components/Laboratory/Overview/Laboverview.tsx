import React, { useEffect } from "react";
import OverviewCard from "../../ReusabledashboardD/Overviewcard";
import OverviewChart from "../../ReusabledashboardD/OverviewChart";
import LaboverviewTable from "./LaboverviewTable";
import patientIcon from "../../../assets/hugeicons.png";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
interface LabStats {
  total_dispersed: number;
  // Add these properties for direct access in the component
  total_tests: number;
  pending: number;
  ongoing: number;
  completed: number;
}
const Laboverview = () => {
  const { stats, getLabStats, isLoading } = useFinanceStore();

  useEffect(() => {
    getLabStats("/laboratory/stats");
  }, [getLabStats]);

  console.log("Stats in Laboverview:", stats);

  const LabStats = stats
    ? [
        {
          title: "Total Tests",
          number: String(stats.total_dispersed || "0"),
          icon: patientIcon,
          category: "laboratory",
        },
        {
          title: "Pending Tests",
          number: String(stats.dispersal_status?.pending?.count || "0"),
          icon: patientIcon,
          category: "laboratory",
        },
        {
          title: "Ongoing Tests",
          number: String(stats.dispersal_status?.ongoing?.count || "0"),
          icon: patientIcon,
          category: "laboratory",
        },
        {
          title: "Completed Tests",
          number: String(stats.dispersal_status?.completed?.count || "0"),
          icon: patientIcon,
          category: "laboratory",
        },
      ]
    : [];

  return (
    <div className="font-inter">
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div>...</div>
        ) : (
          <OverviewCard
            cardTitle="Laboratory Dashboard"
            category="laboratory"
            limit={4}
            data={LabStats}
          />
        )}
        <OverviewChart ChartTitle="Laboratory Tests Overview" />
        <LaboverviewTable />
      </div>
    </div>
  );
};
export default Laboverview;
