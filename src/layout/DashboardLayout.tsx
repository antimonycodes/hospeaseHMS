import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import TopNav from "../components/Dashboard/TopNav";
import { BsWhatsapp } from "react-icons/bs";
import TourOverlay from "../Shared/TourOverlay";
import { useTourStore } from "../store/super-admin/useTourStore";

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { startTour } = useTourStore();

  useEffect(() => {
    const timeout = setTimeout(() => {
      startTour();
    }, 800); // Slight delay to ensure DOM is ready
    return () => clearTimeout(timeout);
  }, [startTour]);

  return (
    <div className="flex h-screen ">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <main className="flex-1 bg-[#efefef] overflow-y-auto">
        <TopNav setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <div className="p-3 md:p-6 w-full">
          {/* <TourOverlay /> */}
          <Outlet />
          <div className=" fixed bottom-6 left-0 right-0 flex justify-center items-center">
            {/* <button
              onClick={startTour}
              className="px-4 py-2 bg-blue-600 text-white rounded fixed left-0 z-[999]"
            >
              Start Tour
            </button> */}
          </div>
          <div
            className="fixed bottom-6  right-15 flex justify-center space-x-2 items-center  "
            onClick={() =>
              window.open("https://wa.me/+2348114675297", "_blank")
            }
          >
            <span className="   bg-white p-2  text-primary shadow-md  rounded-full">
              <BsWhatsapp size={30} />
            </span>
            <span className="  bg-white p-2 px-3  text-base rounded-2xl shadow-md">
              support
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
