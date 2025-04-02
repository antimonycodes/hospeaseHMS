import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Define interfaces for the data structure
interface DepartmentData {
  id: number;
  name: string;
  patient_count: number;
  percentage: string;
}

interface ChartData {
  name: string;
  patients: number;
  patientCount: number;
  fill: string;
}

// Define props interface
interface DepartmentChartProps {
  clinicalStats: DepartmentData[];
  isLoading: boolean;
}

const DepartmentChart: React.FC<DepartmentChartProps> = ({
  clinicalStats,
  isLoading,
}) => {
  // Transform API data to the format required by the chart
  const transformedData: ChartData[] =
    clinicalStats?.map((dept: DepartmentData, index: number) => {
      // Array of colors to use for the departments
      const colors: string[] = [
        "#9d94e6",
        "#4caf50",
        "#ff6384",
        "#c27cf2",
        "#36a2eb",
        "#ffcd56",
      ];

      return {
        name: dept.name,
        patients: parseFloat(dept.percentage.replace("%", "")), // Convert "25.0%" to 25.0
        patientCount: dept.patient_count,
        fill: colors[index % colors.length],
      };
    }) || [];

  const CustomLegend = () => {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 mt-8">
        {transformedData.map((entry: ChartData, index: number) => (
          <div
            key={`legend-${index}`}
            className="flex flex-col items-center mb-2"
          >
            <div className="flex items-center">
              <div
                className="size-3 rounded-full mr-2"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-[#77838F] font-medium mr-4">
                {entry.name}
              </span>
            </div>
            <span className="font-medium text-[#2E2A2A] text-xs">
              {entry.patientCount} patients ({entry.patients}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full md:w-[50%] p-4 bg-white rounded-lg custom-shadow flex items-center justify-center h-64">
        <span className="text-gray-400 text-sm">
          Loading Department Data...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[50%] p-4 bg-white rounded-lg custom-shadow">
      <h2 className="text-gray-500 text-md font-medium mb-4">
        PATIENTS BY DEPARTMENT
      </h2>
      {transformedData.length === 0 ? (
        <div className="w-full h-64 flex items-center justify-center">
          <span className="text-gray-400 text-sm">
            No department data available
          </span>
        </div>
      ) : (
        <>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="80%"
                barSize={10} // Thinner bars
                data={transformedData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background
                  dataKey="patients"
                  cornerRadius={5} // Reduced corner radius for thinner bars
                  label={false}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Patients"]}
                  labelFormatter={(index: number) =>
                    transformedData[index].name
                  }
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <CustomLegend />
        </>
      )}
    </div>
  );
};

export default DepartmentChart;
