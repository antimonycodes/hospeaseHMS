import { getImageSrc } from "../../utils/imageUtils";

const FrontdeskCards = () => {
  const QuickStatCards = [
    {
      title: "TOTAL PATIENTS",
      number: "5000",
      icon: "fpatients.png",
    },
    {
      title: "MALE PATIENTS",
      number: "200",
      icon: "fmpatients.png",
    },
    {
      title: "FEMALE",
      number: "120",
      icon: "ffpatients.png",
    },
    {
      title: "CHILDREN",
      number: "2004",
      icon: "fcpatients.png",
    },
  ];
  return (
    <div>
      <h1 className="font-medium text-[20px] text-[#101828] pb-[21px]">
        Front desk Dashboard
      </h1>
      <div className=" grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-[21px] ">
        {QuickStatCards.map(({ title, number, icon }, index) => (
          <div
            key={index}
            className=" bg-white rounded-lg border-0 border-gray-200 py-[15px] pl-[43px] pr-[15px] flex flex-col gap-2 relative"
          >
            <div className=" flex items-center justify-between">
              <img src={getImageSrc(icon)} alt="" width={40} height={40} />
            </div>
            <h1 className=" text-[#71717a] text-xs lg:text-md font-semibold leading-6 tracking-[0.5%]">
              {title}
            </h1>
            <div className=" flex items-center gap-2">
              <h1 className=" text-gray-900 font-bold text-[21px]">{number}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrontdeskCards;
