import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import TopNav from "../components/Dashboard/TopNav";

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <main className="w-full bg-[#efefef] overflow-y-auto h-full">
        <div className="w-full bg-white relative">
          <TopNav setIsMobileMenuOpen={setIsMobileMenuOpen} />
        </div>
        <div className="px-6 pb-6 pt-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
