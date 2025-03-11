import FrontdeskCards from "./FrontdeskCards";
import FrontdeskChart from "./FrontdeskChart";
import FrontdeskTable from "./FrontdeskTable";

const FrontdeskOverview = () => {
  return (
    <div className=" font-jakarta">
      <div className=" flex flex-col gap-4">
        <FrontdeskCards />
        <FrontdeskChart />
        <FrontdeskTable />
      </div>
    </div>
  );
};

export default FrontdeskOverview;
