import FrontdeskChart from "../Frontdesk/FrontdeskChart";
import FrontdeskTable from "../Frontdesk/FrontdeskTable";
import DoctorCards from "./DoctorCards";

const DoctorOverview = () => (
  <div className="font-inter">
    <div className=" flex flex-col gap-4">
      <DoctorCards />
      <FrontdeskChart />
      {/* <FrontdeskTable /> */}
    </div>
  </div>
);
export default DoctorOverview;
