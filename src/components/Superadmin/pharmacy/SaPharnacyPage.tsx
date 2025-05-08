import React, { useEffect, useState } from "react";
import Tabs from "../../ReusablepatientD/Tabs";
import InventoryTable from "./InventoryTable";
import PatientsTable from "./PatientsTable";
import Tablehead from "../../ReusablepatientD/Tablehead";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Table from "../../../Shared/Table";
import Loader from "../../../Shared/Loader";
import Ptable from "./Ptable";
import PharmacyStocks from "./PharmacyStocks";
import PaymentHistory from "../../Pharmacy/payments/PaymentHistory";
import StockActivity from "./StockActivity";

const SaPharnacyPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className=" space-y-4">
      <div className="bg-white custom-shadow p-4">
        {/* Tabs */}
        <div className="flex items-center text-xs gap-3">
          <h1
            className={`relative inline-block flex-none cursor-pointer text-sm md:text-base font-semibold ${
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
            className={`relative inline-block flex-none cursor-pointer text-sm md:text-base font-semibold ${
              activeTab === 1 ? "text-primary" : "text-[#667185]"
            }`}
            onClick={() => setActiveTab(1)}
          >
            Items
            <div
              className={`absolute left-0 -bottom-3 w-full h-[1px] ${
                activeTab === 1 ? "bg-primary" : "bg-[#E4E7EC]"
              }`}
            ></div>
          </h1>
          {/*  */}

          {/*  */}
          <h1
            className={`relative inline-block flex-none cursor-pointer text-sm md:text-base font-semibold ${
              activeTab === 3 ? "text-primary" : "text-[#667185]"
            }`}
            onClick={() => setActiveTab(3)}
          >
            Stock Activity
            <div
              className={`absolute left-0 -bottom-3 w-full h-[1px] ${
                activeTab === 3 ? "bg-primary" : "bg-[#E4E7EC]"
              }`}
            ></div>
          </h1>
        </div>
        {/* Tables */}
      </div>
      {activeTab === 0 && <Ptable />}
      {activeTab === 1 && <PharmacyStocks />}
      {/* {activeTab === 2 && <PaymentHistory />} */}
      {activeTab === 3 && <StockActivity />}
    </div>
  );
};

export default SaPharnacyPage;
