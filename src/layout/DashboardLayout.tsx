import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import TopNav from "../components/Dashboard/TopNav";

const DashboardLayout = () => (
  <div className="flex h-screen">
    <Sidebar />
    <main className=" w-full bg-[#efefef] overflow-y-auto h-full">
      <div className=" w-full bg-white">
        <TopNav />
      </div>
      <div className="p-6">
        <Outlet />
      </div>
    </main>
  </div>
);
export default DashboardLayout;
