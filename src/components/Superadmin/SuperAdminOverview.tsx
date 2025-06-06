// Fix for SuperAdminOverview.tsx
import { useEffect } from "react";
import { useStatsStore } from "../../store/super-admin/useStatsStore";
import DepartmentChart from "./DepartmentsChart";
import DoctorsTable from "./overview/DoctorsTable";
import PatientsTable from "./overview/PatientsTable";
import PatientBarChart from "./PatientBarChart";
import QuickStats from "./QuickStats";
import { useDoctorStore } from "../../store/super-admin/useDoctorStore";
import { usePatientStore } from "../../store/super-admin/usePatientStore";

const SuperAdminOverview = () => {
  const { getStats, getClinicalStats, clinicalStats, stats, isLoading } =
    useStatsStore();
  const { getAllDoctors, doctors } = useDoctorStore();
  const { getAllPatients, patients, pagination } = usePatientStore();

  useEffect(() => {
    // Only fetch data if it's not already available
    if (!stats || Object.keys(stats).length === 0) {
      getStats();
    }
    if (!clinicalStats || clinicalStats.length === 0) {
      getClinicalStats();
    }

    // Fetch doctors data once on component mount
    getAllDoctors();

    // Optionally fetch patients data if needed
    getAllPatients();
  }, [
    // Only include the fetch functions, not the data itself
    getStats,
    getClinicalStats,
    getAllDoctors,
    getAllPatients,
  ]);

  // Ensure we are passing data when clinicalStats are available

  return (
    <div className="overview-section space-y-4 ">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <QuickStats />
      <div className="flex flex-col md:flex-row gap-4">
        <PatientBarChart />

        <DepartmentChart
          clinicalStats={clinicalStats || []}
          isLoading={isLoading}
        />
      </div>
      <div className="w-full gap-4 h-full flex flex-col md:flex-row">
        <DoctorsTable doctors={doctors} />
        <PatientsTable
          patients={patients}
          pagination={pagination || undefined}
        />
      </div>
    </div>
  );
};

export default SuperAdminOverview;
