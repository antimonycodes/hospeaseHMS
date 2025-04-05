import { useEffect } from "react";
import { useStatsStore } from "../../store/super-admin/useStatsStore";
import DoctorStats from "./DoctorStats";

const DoctorCards = () => {
  const { getStats, doctorStats, isLoading } = useStatsStore();

  useEffect(() => {
    getStats("/doctor/stats");
  }, [getStats]);

  console.log(doctorStats, "stats");

  return (
    <div className="font-jakarta">
      <h1 className="font-medium text-[20px] text-[#101828] pb-[21px]">
        Doctor's Dashboard
      </h1>
      <DoctorStats stats={doctorStats || {}} isLoading={isLoading} />
    </div>
  );
};

export default DoctorCards;
