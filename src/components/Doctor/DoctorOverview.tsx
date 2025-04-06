import { useEffect } from "react";
import DoctorBarchart from "./DoctorBarchart";
import DoctorCards from "./DoctorCards";
import { useStatsStore } from "../../store/super-admin/useStatsStore";

const DoctorOverview = () => {
  const { getStats, doctorStats, isLoading } = useStatsStore();

  useEffect(() => {
    getStats("/doctor/stats");
  }, [getStats]);

  return (
    <div className="font-inter">
      <div className="flex flex-col gap-4">
        <DoctorCards />
        <DoctorBarchart
          doctorStats={doctorStats || { graph_appointment_representation: {} }}
          isLoading={isLoading}
        />
        {/* <FrontdeskTable /> */}
      </div>
    </div>
  );
};

export default DoctorOverview;
