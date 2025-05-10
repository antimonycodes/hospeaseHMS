// MedicalDash.tsx
import React, { useEffect } from "react";
import childrenIcon from "../../../assets/hugeicons_doctor-03.png";
import femaleIcon from "../../../assets/femaleIcon.png";
import maleIcon from "../../../assets/maleIcon.png";
import totalIcon from "../../../assets/totalIcon.png";
import { useMedicalStore } from "../useMedicalStore";
import MedicalChart from "./MedicalChart";
import Loader from "../../../Shared/Loader";
import MedRecent from "./MedRecent";
import MedpatientInfo from "../patients/MedpatientInfo";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";

const MedicalDash = () => {
  const { stats, getMedStats, isLoading } = useMedicalStore();
  const { patients, getAllPatients, searchPatients, pagination } =
    usePatientStore();

  const baseEndpoint = "/medical-director/patient";

  useEffect(() => {
    getAllPatients("1", "10", baseEndpoint);
  }, [getAllPatients]);

  useEffect(() => {
    getMedStats("/medical-director/stats");
  }, [getMedStats]);

  console.log("Stats in MedicalDash:", stats);

  const MedicalStatsData = stats
    ? [
        {
          title: "Total Patients",
          number: stats.total_patient.toString(),
          icon: totalIcon,
          category: "finance",
        },
        {
          title: "Male Patients",
          number: stats.men_total_count.toString(),
          icon: maleIcon,
          category: "finance",
        },
        {
          title: "Female Patients",
          number: stats.ladies_total_count.toString(),
          icon: femaleIcon,
          category: "finance",
        },
        {
          title: "Children",
          number: stats.children_count.toString(),
          icon: childrenIcon,
          category: "finance",
        },
      ]
    : [];

  console.log("MedicalStatsData:", MedicalStatsData);

  return (
    <div className="font-inter">
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="font-jakarta">
            <h1 className="font-medium text-[20px] text-[#101828] pb-[21px]">
              Doctor's Dashboard
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[21px] w-full">
              {MedicalStatsData.length > 0 ? (
                MedicalStatsData.map(({ title, number, icon }, index) => (
                  <div
                    key={index}
                    className="bg-white custom-shadow w-full rounded-lg border-0 border-gray-200 py-[15px] pl-[43px] pr-[15px] flex flex-col gap-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <img src={icon} alt={title} width={40} height={40} />
                    </div>
                    <h1 className="text-[#71717a] text-xs lg:text-md font-semibold leading-6 tracking-[0.5%]">
                      {title}
                    </h1>
                    <div className="flex items-center gap-2">
                      <h1 className="text-gray-900 font-bold text-[21px]">
                        {number}
                      </h1>
                    </div>
                  </div>
                ))
              ) : (
                <div>No data available</div>
              )}
            </div>
          </div>
        )}
        <MedicalChart />
        <MedpatientInfo
          patients={patients.slice(0, 5)}
          isLoading={isLoading}
          // pagination={false}
          baseEndpoint={baseEndpoint}
          getAllPatients={getAllPatients}
        />
        {/* <MedRecent /> */}
      </div>
    </div>
  );
};

export default MedicalDash;
