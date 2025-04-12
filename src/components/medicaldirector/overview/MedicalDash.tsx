import React, { useEffect } from "react";
import childrenIcon from "../../../assets/hugeicons_doctor-03.png";
import femaleIcon from "../../../assets/femaleIcon.png";
import maleIcon from "../../../assets/maleIcon.png";
import totalIcon from "../../../assets/totalIcon.png";

import OverviewCard from "../../ReusabledashboardD/Overviewcard";
import { useMedicalStore } from "../useMedicalStore";
import MedicalChart from "./MedicalChart";
import MedRecent from "./MedRecent";

const MedicalDash = () => {
  const { stats, getMedStats, isLoading } = useMedicalStore();

  useEffect(() => {
    getMedStats("/medical-director/stats");
  }, [getMedStats]);

  const MedicalStatsData = stats
    ? [
        {
          title: "Total Patients",
          number: stats.total_patient.toString(),
          icon: totalIcon,
          category: "finance",
        },
        {
          title: "Male Patients",
          number: stats.men_total_count.toString(),
          icon: maleIcon,
          category: "finance",
        },
        {
          title: "Female Patients",
          number: stats.ladies_total_count.toString(),
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
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div>Loading stats...</div>
        ) : MedicalStatsData.length > 0 ? (
          <OverviewCard
            cardTitle="Doctor's Dashboard"
            category="lab"
            limit={4}
            data={MedicalStatsData}
          />
        ) : (
          <div>No stats available</div>
        )}
        <MedicalChart />
        <MedRecent />
      </div>
    </div>
  );
};

export default MedicalDash;
