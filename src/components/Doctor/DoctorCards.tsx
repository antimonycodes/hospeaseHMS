import { useEffect } from "react";
import { useStatsStore } from "../../store/super-admin/useStatsStore";
import DoctorStats from "./DoctorStats";

const DoctorCards = () => {
  const { getStats, stats, isLoading } = useStatsStore();

  useEffect(() => {
    getStats("/doctor/stats");
  }, [getStats]);

  return (
    <div className="font-jakarta">
      <h1 className="font-medium text-[20px] text-[#101828] pb-[21px]">
        Doctor's Dashboard
      </h1>
      <DoctorStats stats={stats || {}} isLoading={isLoading} />
    </div>
  );
};

export default DoctorCards;
