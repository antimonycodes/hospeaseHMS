import balanceIcon from "../../../assets/fbalance.svg";
import incomeIcon from "../../../assets/fincome.svg";
import expensesIcon from "../../../assets/fexpense.svg";
const FinanceStatsCards = () => {
  const statsItems = [
    {
      title: "Balance",
      value: "$1,000,000",
      icon: balanceIcon,
    },
    {
      title: "Income",
      value: "$500,000",
      icon: incomeIcon,
    },
    {
      title: "Expenses",
      value: "$500,000",
      icon: expensesIcon,
    },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-10 xl:gap-12">
      {statsItems.map(({ title, value, icon }, index) => (
        <div className="bg-white rounded-lg border-0 custom-shadow border-gray-200 p-[10px] flex flex-col gap-2 relative px-8 py-4">
          <img src={icon} alt="" width={40} height={40} />
          <h1 className="text-gray-500 text-xs lg:text-md font-semibold leading-6 tracking-[0.5%]">
            {title}
          </h1>
          <h1 className="text-gray-900 font-bold text-[21px]">{value}</h1>
        </div>
      ))}
    </div>
  );
};

export default FinanceStatsCards;
