import React from "react";
import LabDashCard from "../../data/LabDashCard";
import { getImageSrc } from "../../utils/imageUtils";

interface OverviewCardProps {
  cardTitle: string;
  category: string; // New prop for category
  limit: number; // New prop for limit
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  cardTitle,
  category,
  limit,
}) => {
  // Filter and slice data based on category and limit
  const filteredCards = LabDashCard.filter(
    (card) => card.category === category
  ).slice(0, limit);

  return (
    <div className="font-jakarta  ">
      <h1 className="font-medium text-[20px] text-[#101828] pb-[21px]">
        {cardTitle}
      </h1>
      <div className="flex   gap-[21px] w-full">
        {filteredCards.map(({ title, number, icon }, index) => (
          <div
            key={index}
            className="bg-white w-full rounded-lg border-0 border-gray-200 py-[15px] pl-[43px] pr-[15px] flex flex-col gap-2 relative"
          >
            <div className="flex items-center justify-between">
              <img src={getImageSrc(icon)} alt={title} width={40} height={40} />
            </div>
            <h1 className="text-[#71717a] text-xs lg:text-md font-semibold leading-6 tracking-[0.5%]">
              {title}
            </h1>
            <div className="flex items-center gap-2">
              <h1 className="text-gray-900 font-bold text-[21px]">{number}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewCard;
