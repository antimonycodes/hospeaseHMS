// FrontdeskCards.tsx
import { useEffect } from "react";
import { usePatientStore } from "../../store/super-admin/usePatientStore";
import { getImageSrc } from "../../utils/imageUtils";

const FrontdeskCards = () => {
  const { stats, isLoading, getFrontdeskStats } = usePatientStore();

  // Fetch stats when the component mounts
  useEffect(() => {
    getFrontdeskStats();
  }, [getFrontdeskStats]);

  // Define the cards with dynamic data from stats
  const QuickStatCards = [
    {
      title: "TOTAL PATIENTS",
      number: stats?.total_patient || 0, // Fallback to 0 if stats not loaded
      icon: "fpatients.png",
    },
    {
      title: "MALE PATIENTS",
      number: stats?.men_total_count || 0,
      icon: "fmpatients.png",
    },
    {
      title: "FEMALE",
      number: stats?.ladies_total_count || 0,
      icon: "ffpatients.png",
    },
    {
      title: "CHILDREN",
      number: stats?.children_count || 0,
      icon: "fcpatients.png",
    },
  ];

  return (
    <div className="font-jakarta">
      <h1 className="font-medium text-[20px] text-[#101828] pb-[21px]">
        Front desk Dashboard
      </h1>
      {isLoading ? (
        <p>Loading stats...</p> // Optional loading state
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[21px]">
          {QuickStatCards.map(({ title, number, icon }, index) => (
            <div
              key={index}
              className="bg-white shadow-custom rounded-lg border-0 border-gray-200 py-[15px] pl-[43px] pr-[15px] flex flex-col gap-2 relative"
            >
              <div className="flex items-center justify-between">
                <img src={getImageSrc(icon)} alt="" width={40} height={40} />
              </div>
              <h1 className="text-[#71717a] text-xs lg:text-md font-semibold leading-6 tracking-[0.5%]">
                {title}
              </h1>
              <div className="flex items-center gap-2">
                <h1 className="text-gray-900 font-bold text-[21px]">
                  {number}
                </h1>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FrontdeskCards;
