import { useState } from "react";

type TabType = "Pending" | "Ongoing" | "Completed";

interface TabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  statusCounts: { [key in TabType]: number };
}

const Tabs = ({ activeTab, setActiveTab, statusCounts }: TabsProps) => {
  const tabs: TabType[] = ["Pending", "Ongoing", "Completed"];

  return (
    <div className="px-6 w-full bg-white flex space-x-2 md:space-x-6 ">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-4   text-xs md:text-sm font-medium ${
            activeTab === tab
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500"
          }`}
        >
          {tab}
          {activeTab === tab && (
            <span className="text-xs  bg-primary text-white py-0.5 px-3 rounded-xl">
              {statusCounts[tab]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
