import { useState, useEffect, useCallback, SetStateAction } from "react";

import Prices from "../components/Superadmin/service-charges/Prices";
import HmoSettings from "../components/Superadmin/service-charges/HmoSettings";

const ServiceCharges = () => {
  const [activeTab, setActiveTab] = useState("prices");

  const handleTabChange = (tab: SetStateAction<string>) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Tab Navigation */}
      <div className="flex items-center text-xs gap-3 mb-8 pb-3">
        <h1
          className={`relative inline-block flex-none cursor-pointer text-sm md:text-base font-semibold ${
            activeTab === "prices" ? "text-primary" : "text-[#667185]"
          }`}
          onClick={() => handleTabChange("prices")}
        >
          Prices
          <div
            className={`absolute left-0 -bottom-3 w-full h-[2px] ${
              activeTab === "prices" ? "bg-primary" : "bg-[#E4E7EC]"
            }`}
          ></div>
        </h1>
        <h1
          className={`relative inline-block flex-none cursor-pointer text-sm md:text-base font-semibold ${
            activeTab === "Hmo" ? "text-primary" : "text-[#667185]"
          }`}
          onClick={() => handleTabChange("Hmo")}
        >
          Hmo Settings
          <div
            className={`absolute left-0 -bottom-3 w-full h-[2px] ${
              activeTab === "Hmo" ? "bg-primary" : "bg-[#E4E7EC]"
            }`}
          ></div>
        </h1>
      </div>
      {/* Tab Content */}
      {activeTab === "prices" && (
        <div>
          <Prices />
        </div>
      )}
      {activeTab === "Hmo" && (
        <div>
          <HmoSettings />
        </div>
      )}
    </div>
  );
};

export default ServiceCharges;
