import OverviewCard from "../../ReusabledashboardD/Overviewcard";

const Foverview = () => {
  return (
    <div className="font-inter">
      <div>
        <OverviewCard
          cardTitle="Finance Dashboard"
          category="finance"
          limit={3}
        />
      </div>
    </div>
  );
};

export default Foverview;
