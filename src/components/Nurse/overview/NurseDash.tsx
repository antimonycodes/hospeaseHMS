import React, { useEffect } from "react";
import OverviewCard from "../../ReusabledashboardD/Overviewcard";
import Nursechart from "./Nursechart";
import NurseCard from "./NurseCard";
import { useNurseStore } from "../../../store/super-admin/useNuseStore";
import childrenIcon from "../../../assets/hugeicons_doctor-03.png";
import femaleIcon from "../../../assets/femaleIcon.png";
import maleIcon from "../../../assets/maleIcon.png";
import totalIcon from "../../../assets/totalIcon.png";
const NurseDash = () => {
  const { stats, getNurseStats, isLoading } = useNurseStore();

  useEffect(() => {
    getNurseStats();
  }, [getNurseStats]);

  // console.log("Nurse Stats:", stats);
  // console.log("Nurse Data:", getNurseStats);

  const NurseStatsData = stats
    ? [
        {
          title: "Total Patients",
          number: String(stats.total_patient),
          icon: totalIcon,
          category: "finance",
        },
        {
          title: "Male Patients",
          number: String(stats.male_count),
          icon: maleIcon,
          category: "finance",
        },
        {
          title: "Female Patients",
          number: String(stats.female_count),
          icon: femaleIcon,
          category: "finance",
        },
        {
          title: "Children",
          number: String(stats.children_count),
          icon: childrenIcon,
          category: "finance",
        },
      ]
    : [];

  // console.log("NurseStatsData:", NurseStatsData);

  return (
    <div className="font-inter">
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div>Loading stats...</div>
        ) : (
          <OverviewCard
            cardTitle="Nurse Dashboard"
            category="lab"
            limit={4}
            data={NurseStatsData}
          />
        )}
        {/* <Nursechart /> */}
        <NurseCard />
      </div>
    </div>
  );
};

export default NurseDash;
