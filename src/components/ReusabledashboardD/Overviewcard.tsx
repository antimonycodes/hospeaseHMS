import React from "react";
import { getImageSrc } from "../../utils/imageUtils";

interface CardData {
  title: string;
  number: string;
  icon: string;
  category: string;
}

interface OverviewCardProps {
  cardTitle: string;
  category: string;
  limit: number;
  data?: CardData[];
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  cardTitle,
  category,
  limit,
  data = [],
}) => {
  const filteredCards = data
    .filter((card) => card.category === category)
    .slice(0, limit);

  console.log("Filtered Cards in OverviewCard:", filteredCards);

  return (
    <div className="font-jakarta">
      <h1 className="font-medium text-[20px] text-[#101828] pb-[21px]">
        {cardTitle}
      </h1>
      {/* <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[21px] w-full"> */}
      <div className="flex flex-col md:flex md:flex-row gap-[21px] w-full">
        {filteredCards.length > 0 ? (
          filteredCards.map(({ title, number, icon }, index) => {
            let imageSrc = "/docstaticon.svg";
            try {
              imageSrc = getImageSrc(icon);
            } catch (error) {
              console.error(`Error loading icon ${icon}:`, error);
            }
            return (
              <div
                key={index}
                className="bg-white w-full rounded-lg border-0 border-gray-200 py-[15px] pl-[43px] pr-[15px] flex flex-col gap-2 relative"
              >
                <div className="flex items-center justify-between">
                  <img src={icon} alt={title} width={40} height={40} />
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
            );
          })
        ) : (
          <div>No data available</div>
        )}
      </div>
    </div>
  );
};

export default OverviewCard;
