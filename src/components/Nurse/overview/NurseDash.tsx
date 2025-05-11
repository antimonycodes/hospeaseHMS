// NurseDash.tsx
import React, { useEffect } from "react";
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

  // Log stats to confirm data
  console.log("Nurse Stats:", stats);

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

  // Log NurseStatsData to confirm structure
  console.log("NurseStatsData:", NurseStatsData);

  return (
    <div className="font-inter">
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div>Loading stats...</div>
        ) : (
          <div className="font-jakarta">
            <h1 className="font-medium text-[20px] text-[#101828] pb-[21px]">
              Nurse Dashboard
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[21px] w-full">
              {NurseStatsData.length > 0 ? (
                NurseStatsData.map(({ title, number, icon }, index) => (
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
        <Nursechart
          nurseStats={stats || { graph_appointment_representation: {} }}
          isLoading={isLoading}
        />
        <NurseCard />
      </div>
    </div>
  );
};

export default NurseDash;
