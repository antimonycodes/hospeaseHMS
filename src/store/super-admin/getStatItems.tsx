// Utility function for stat items
import patientIcon from "../../assets/docstaticon.svg";
import doctorIcon from "../../assets/statpatient.svg";
import appointmentIcon from "../../assets/statappointment.svg";
import inventoryIcon from "../../assets/statinventory.svg";

const statConfigs: Record<
  string,
  { title: string; key: string; icon: string }[]
> = {
  adminStats: [
    { title: "TOTAL PATIENTS", key: "total_patient", icon: patientIcon },
    { title: "TOTAL DOCTORS", key: "total_doctor", icon: doctorIcon },
    {
      title: "TOTAL APPOINTMENTS",
      key: "total_appointment",
      icon: appointmentIcon,
    },
    {
      title: "TOTAL CONSULTANTS",
      key: "total_consultant",
      icon: inventoryIcon,
    },
  ],
  doctorStats: [
    {
      title: "TOTAL PATIENTS",
      key: "total_patient",
      icon: appointmentIcon,
    },
    {
      title: "MALE PATIENTS",
      key: "men_total_count",
      icon: appointmentIcon,
    },
    {
      title: "FEMALE PATIENTS",
      key: "ladies_total_count",
      icon: appointmentIcon,
    },
    {
      title: "CHILDREN",
      key: "children_count",
      icon: appointmentIcon,
    },
  ],
};

const getStatItems = (
  category: string,
  isLoading: boolean,
  stats: Record<string, number> | null
) => {
  console.log(`Rendering stats for ${category}:`, stats);

  const statItems = statConfigs[category] || [];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10 xl:gap-12">
      {isLoading
        ? Array(4)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 animate-pulse rounded-lg p-[10px] flex flex-col gap-2 px-8 py-4 h-24"
              />
            ))
        : statItems.map(({ title, key, icon }, index: number) => (
            <div
              key={index}
              className="bg-white rounded-lg border-0 custom-shadow border-gray-200 p-[10px] flex flex-col gap-2 relative px-8 py-4"
            >
              <div className="flex items-center justify-between">
                <img
                  src={icon || undefined}
                  alt={title}
                  width={40}
                  height={40}
                />
              </div>
              <h1 className="text-gray-500 text-xs lg:text-md font-semibold leading-6 tracking-[0.5%]">
                {title}
              </h1>
              <div className="flex items-center gap-12">
                <h1 className="text-gray-900 font-bold text-[21px]">
                  {stats?.[key] ?? "N/A"}
                </h1>
              </div>
            </div>
          ))}
    </div>
  );
};

export default getStatItems;
