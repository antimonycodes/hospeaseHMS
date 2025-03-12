import { Plus, Search } from "lucide-react";
import { useState } from "react";
import PatientsTable from "./PatientsTable";
import InventoryTable from "./InventoryTable";

const SaPharnacyPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="  bg-white custom-shadow p-4">
      <div className=" flex flex-col md:flex-row-reverse gap-4 md:gap-24">
        {/* Search and Button */}
        <div className=" w-full flex-1 flex flex-col md:flex-row items-center gap-2">
          <div className="relative w-full flex-1">
            <input
              type="text"
              placeholder="Type to search"
              className="w-full border border-gray-200 py-2 pl-10 pr-4 rounded-lg"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] size-4" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center text-xs gap-3">
          <h1
            className={`relative inline-block flex-none cursor-pointer text-base font-semibold ${
              activeTab === 0 ? "text-primary" : "text-[#667185]"
            }`}
            onClick={() => setActiveTab(0)}
          >
            Patients
            <div
              className={`absolute left-0 -bottom-3 w-full h-[1px] ${
                activeTab === 0 ? "bg-primary" : "bg-[#E4E7EC]"
              }`}
            ></div>
          </h1>
          <h1
            className={`relative inline-block flex-none cursor-pointer text-base font-semibold ${
              activeTab === 1 ? "text-primary" : "text-[#667185]"
            }`}
            onClick={() => setActiveTab(1)}
          >
            Inventory
            <div
              className={`absolute left-0 -bottom-3 w-full h-[1px] ${
                activeTab === 1 ? "bg-primary" : "bg-[#E4E7EC]"
              }`}
            ></div>
          </h1>
        </div>
      </div>
      {/* tables */}
      <div className=" mt-4">
        {activeTab === 0 ? <PatientsTable /> : <InventoryTable />}
      </div>
    </div>
  );
};

export default SaPharnacyPage;
