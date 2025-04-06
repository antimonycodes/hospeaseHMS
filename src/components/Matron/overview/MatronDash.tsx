import React, { useEffect } from "react";
import Nursechart from "../../Nurse/overview/Nursechart";
import NurseCard from "../../Nurse/overview/NurseCard";
import OverviewCard from "../../ReusabledashboardD/Overviewcard";
import MatronCharts from "./MatronCharts";
import MatronCard from "./MatronCard";
import patientIcon from "../../../assets/hugeicons.png"; // Ensure this path is correct
import { useMatronNurse } from "../../Matron/nurse/useMatronNurse"; // Adjust path as needed

const MatronDash = () => {
  const { stats, getMatronStats, isLoading } = useMatronNurse();

  // Fetch stats on component mount
  useEffect(() => {
    getMatronStats();
  }, [getMatronStats]);

  // Map stats to the format expected by OverviewCard
  const matronStatsData = stats
    ? [
        {
          title: "Total Patients",
          number: stats.total_patient.toString(), // Convert number to string
          icon: patientIcon,
          category: "lab",
        },
        {
          title: "Clinic Appointments",
          number: stats.clinic_total_appointment.toString(),
          icon: patientIcon,
          category: "lab",
        },
        {
          title: "Matron Assigned",
          number: stats.matron_assigned_appointment.toString(),
          icon: patientIcon,
          category: "lab",
        },
        {
          title: "Children",
          number: stats.children_count.toString(),
          icon: patientIcon,
          category: "lab",
        },
      ]
    : [];

  console.log("Matron Stats Data:", matronStatsData); // Debug

  return (
    <div className="font-inter">
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div>Loading stats...</div>
        ) : matronStatsData.length > 0 ? (
          <OverviewCard
            cardTitle="Matron Dashboard"
            category="lab"
            limit={4}
            data={matronStatsData}
          />
        ) : (
          <div>No stats available</div>
        )}
        <MatronCharts />
        <MatronCard />
      </div>
    </div>
  );
};

export default MatronDash;
