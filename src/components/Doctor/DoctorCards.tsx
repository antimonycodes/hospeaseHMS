import { useEffect } from "react";
import { useStatsStore } from "../../store/super-admin/useStatsStore";
import QuickStats from "../Superadmin/QuickStats";

const DoctorCards = () => {
  const { getStats } = useStatsStore();

  useEffect(() => {
    getStats("doctorStats", "/doctor/stats");
  }, [getStats]);

  return (
    <div className="font-jakarta">
      <h1 className="font-medium text-[20px] text-[#101828] pb-[21px]">
        Doctor's Dashboard
      </h1>
      <QuickStats category="doctorStats" />
    </div>
  );
};

export default DoctorCards;
