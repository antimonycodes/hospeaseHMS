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

  const NurseStatsData = stats
    ? [
        {
          title: "Total Patients",
          number: stats.total_patient.toString(),
          icon: totalIcon,
          category: "finance",
        },
        {
          title: "Male Patients",
          number: stats.male_count.toString(),
          icon: maleIcon,
          category: "finance",
        },
        {
          title: "Female Patients",
          number: stats.female_count.toString(),
          icon: femaleIcon,
          category: "finance",
        },
        {
          title: "Children",
          number: stats.children_count.toString(),
          icon: childrenIcon,
          category: "finance",
        },
      ]
    : [];
  return (
    <div className="font-inter">
      <div className=" flex flex-col gap-4">
        <OverviewCard
          cardTitle="Doctor's Dashboard"
          category="lab"
          limit={4}
          data={NurseStatsData}
        />
        <Nursechart />
        <NurseCard />
      </div>
    </div>
  );
};

export default NurseDash;
