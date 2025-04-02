import React, { useEffect } from "react";
import patientIcon from "../../assets/docstaticon.svg";
import { useStatsStore } from "../../store/super-admin/useStatsStore";
interface DoctorStatsProps {
  stats: any;
  isLoading: boolean;
}
const DoctorStats = ({ stats, isLoading }: DoctorStatsProps) => {
  type doctorStats =
    | "total_patient"
    | "men_total_count"
    | "ladies_total_count"
    | "children_count";

  const doctorStatItems: { title: string; key: doctorStats; icon: string }[] = [
    { title: "TOTAL PATIENTS", key: "total_patient", icon: patientIcon },
    { title: "MEN PATIENTS", key: "men_total_count", icon: patientIcon },
    { title: "LADIES PATIENTS", key: "ladies_total_count", icon: patientIcon },
    { title: "CHILDREN PATIENTS", key: "children_count", icon: patientIcon },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10 xl:gap-12">
      {isLoading
        ? Array(4)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 animate-pulse rounded-lg p-[10px] flex flex-col gap-2 px-8 py-4 h-24"
              />
            ))
        : doctorStatItems.map(({ title, key, icon }, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border-0 custom-shadow border-gray-200 p-[10px] flex flex-col gap-2 relative px-8 py-4"
            >
              <div className="flex items-center justify-between">
                <img src={icon} alt="" width={40} height={40} />
              </div>
              <h1 className="text-gray-500 text-xs lg:text-md font-semibold leading-6 tracking-[0.5%]">
                {title}
              </h1>
              <div className="flex items-center gap-12">
                <h1 className="text-gray-900 font-bold text-[21px]">
                  {stats?.[key] ?? 0}
                </h1>
              </div>
            </div>
          ))}
    </div>
  );
};

export default DoctorStats;
