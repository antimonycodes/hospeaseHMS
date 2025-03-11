import patientIcon from "../../assets/docstaticon.svg";
import doctorIcon from "../../assets/statpatient.svg";
import appointmentIcon from "../../assets/statappointment.svg";
import inventoryIcon from "../../assets/statinventory.svg";
const QuickStats = () => {
  const QuickStatCards = [
    {
      title: "TOTAL PATIENTS",
      number: "5000",
      percentage: "-10%",
      icon: patientIcon,
    },
    {
      title: "TOTAL DOCTOR",
      number: "200",
      percentage: "+10%",
      icon: doctorIcon,
    },
    {
      title: "TOTAL APPOINTMENTS",
      number: "120",
      percentage: "-40%",
      icon: appointmentIcon,
    },
    {
      title: "INVENTORY",
      number: "2004",
      percentage: "+55%",
      icon: inventoryIcon,
    },
  ];
  return (
    <div className=" grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10 xl:gap-12 ">
      {QuickStatCards.map(({ title, number, percentage, icon }, index) => (
        <div
          key={index}
          className=" bg-white rounded-lg border-0 custom-shadow border-gray-200 p-[10px] flex flex-col gap-2 relative px-8 py-4"
        >
          <div className=" flex items-center justify-between">
            <img src={icon} alt="" width={40} height={40} />
          </div>
          <h1 className=" text-gray-500 text-xs lg:text-md font-semibold leading-6 tracking-[0.5%]">
            {title}
          </h1>
          <div className=" flex items-center gap-12">
            <h1 className=" text-gray-900 font-bold">{number}</h1>
            <span
              className={`${
                percentage.includes("-")
                  ? "text-[#F04438]  "
                  : "text-[#0D894F]  "
              } font-medium px-[6px] py-[2px]  `}
            >
              {percentage}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
