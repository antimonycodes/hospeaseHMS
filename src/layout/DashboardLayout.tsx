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
      <main className="w-full bg-[#efefef] overflow-y-auto h-full relative">
        <div className="w-full relative">
          <TopNav setIsMobileMenuOpen={setIsMobileMenuOpen} />
        </div>
        <div className="p-3 md:p-6 ">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
