import {
  RadialBarChart,
  RadialBar,
  // Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const DepartmentChart = () => {
  const data = [
    {
      name: "Gynecology",
      patients: 87,
      fill: "#9d94e6",
    },
    {
      name: "Urology",
      patients: 45,
      fill: "#4caf50",
    },
    {
      name: "Dentistry",
      patients: 32,
      fill: "#ff6384",
    },
    {
      name: "Neurology",
      patients: 28,
      fill: "#c27cf2",
    },
  ];

  // Custom legend that displays department names and percentages
  const CustomLegend = () => {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 mt-8">
        {data.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className="flex flex-col items-center mb-2"
          >
            <div className=" flex items-center">
              <div
                className=" size-3 rounded-full mr-2 "
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-[#77838F] font-medium mr-4">
                {entry.name}
              </span>
            </div>
            <span className="font-medium text-[#2E2A2A] text-xs">
              {entry.patients}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className=" w-full  md:w-[50%] p-4 bg-white rounded-lg ">
      <h2 className="text-gray-500 text-md font-medium mb-4">
        PATIENTS BY DEPARTMENT
      </h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="80%"
            barSize={20}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              background
              dataKey="patients"
              cornerRadius={10}
              label={false}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, "Patients"]}
              labelFormatter={(index) => data[index].name}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <CustomLegend />
    </div>
  );
};

export default DepartmentChart;
