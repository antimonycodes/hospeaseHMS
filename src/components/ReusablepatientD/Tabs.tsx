type TabType<T extends string> = T;

interface TabsProps<T extends string> {
  activeTab: TabType<T>;
  setActiveTab: (tab: TabType<T>) => void;
  statusCounts: { [key in TabType<T>]: number };
  tabs: TabType<T>[];
}

const Tabs = <T extends string>({
  activeTab,
  setActiveTab,
  statusCounts,
  tabs,
}: TabsProps<T>) => {
  return (
    <div className="px-6 w-full bg-white flex space-x-2 md:space-x-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-4 text-xs md:text-sm font-medium ${
            activeTab === tab
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500"
          }`}
        >
          {tab}
          {statusCounts[tab] !== undefined && activeTab === tab && (
            <span className="text-xs bg-primary text-white py-0.5 px-3 rounded-xl">
              {statusCounts[tab]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
