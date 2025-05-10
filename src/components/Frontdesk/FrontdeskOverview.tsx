import { useEffect } from "react";
import FrontdeskCards from "./FrontdeskCards";
import FrontdeskChart from "./FrontdeskChart";
import FrontdeskTable from "./FrontdeskTable";
import { usePatientStore } from "../../store/super-admin/usePatientStore";

const FrontdeskOverview = () => {
  const { stats, isLoading, getFrontdeskStats } = usePatientStore();

  useEffect(() => {
    getFrontdeskStats();
  }, [getFrontdeskStats]);

  return (
    <div className=" font-inter">
      <div className=" flex flex-col gap-4">
        <FrontdeskCards />
        <FrontdeskChart
          patientStats={stats || { graph_appointment_representation: {} }}
          isLoading={isLoading}
        />
        <FrontdeskTable />
      </div>
    </div>
  );
};

export default FrontdeskOverview;
