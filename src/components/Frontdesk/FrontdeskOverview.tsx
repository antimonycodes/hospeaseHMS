import { useEffect } from "react";
import FrontdeskCards from "./FrontdeskCards";
import FrontdeskChart from "./FrontdeskChart";
import FrontdeskTable from "./FrontdeskTable";
import { useStatsStore } from "../../store/super-admin/useStatsStore";

const FrontdeskOverview = () => {
  // const { getStats, doctorStats, isLoading } = useStatsStore();

  // useEffect(() => {
  //   getStats("/doctor/stats");
  // }, [getStats]);

  return (
    <div className=" font-inter">
      <div className=" flex flex-col gap-4">
        <FrontdeskCards />
        {/* <FrontdeskChart
          doctorStats={doctorStats || { graph_appointment_representation: {} }}
          isLoading={isLoading}
        /> */}
        <FrontdeskTable />
      </div>
    </div>
  );
};

export default FrontdeskOverview;
