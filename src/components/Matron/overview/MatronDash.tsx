import Nursechart from "../../Nurse/overview/Nursechart";
import NurseCard from "../../Nurse/overview/NurseCard";
import OverviewCard from "../../ReusabledashboardD/Overviewcard";
import MatronCharts from "./MatronCharts";
import MatronCard from "./MatronCard";

const MatronDash = () => {
  return (
    <div className="font-inter">
      <div className=" flex flex-col gap-4">
        <OverviewCard cardTitle="Matron Dashboard" category="lab" limit={4} />
        <MatronCharts />
        <MatronCard />
      </div>
    </div>
  );
};

export default MatronDash;
