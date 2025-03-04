import DepartmentChart from "./DepartmentsChart";
import DoctorsTable from "./overview/DoctorsTable";
import PatientsTable from "./overview/PatientsTable";
import PatientBarChart from "./PatientBarChart";
import QuickStats from "./QuickStats";

const SuperAdminOverview = () => (
  <div className=" space-y-4">
    <h2 className="text-xl font-medium">Dashboard</h2>
    <QuickStats />
    <div className=" flex flex-col md:flex-row gap-4">
      <PatientBarChart />
      <DepartmentChart />
    </div>
    <div className=" w-full gap-4 h-full flex flex-col md:flex-row">
      <DoctorsTable />
      <PatientsTable />
    </div>
  </div>
);
export default SuperAdminOverview;
