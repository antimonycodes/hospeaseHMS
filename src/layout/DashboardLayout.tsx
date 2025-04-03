import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import TopNav from "../components/Dashboard/TopNav";
import { BsWhatsapp } from "react-icons/bs";

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen ">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <main className="flex-1 bg-[#efefef] overflow-y-auto">
        <TopNav setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <div className="p-3 md:p-6 w-full">
          <Outlet />
          <div
            className="fixed bottom-6  right-15 flex justify-center space-x-2 items-center  "
            onClick={() =>
              window.open("https://wa.me/+2348114675297", "_blank")
            }
          >
            <span className=" rounded-full  bg-white p-2  text-primary shadow-2xlrounded-full">
              <BsWhatsapp size={30} />
            </span>
            <span className="  bg-white p-2 px-3  text-base">support</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
