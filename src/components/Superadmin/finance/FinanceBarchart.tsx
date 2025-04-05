import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type DataPoint = {
  month: string;
  registration: number;
  consultation: number;
  specialist: number;
  nursing: number;
  blood: number;
  bed: number;
  bedFee: number;
};

const FinanceBarchart = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const data: DataPoint[] = [
    {
      month: "Jan",
      registration: 670,
      consultation: 470,
      specialist: 390,
      nursing: 270,
      blood: 450,
      bed: 320,
      bedFee: 370,
    },
    {
      month: "Feb",
      registration: 670,
      consultation: 460,
      specialist: 380,
      nursing: 260,
      blood: 450,
      bed: 320,
      bedFee: 370,
    },
    {
      month: "Mar",
      registration: 670,
      consultation: 470,
      specialist: 390,
      nursing: 270,
      blood: 450,
      bed: 320,
      bedFee: 370,
    },
    {
      month: "Apr",
      registration: 670,
      consultation: 470,
      specialist: 390,
      nursing: 270,
      blood: 450,
      bed: 320,
      bedFee: 370,
    },
    {
      month: "May",
      registration: 670,
      consultation: 470,
      specialist: 390,
      nursing: 270,
      blood: 450,
      bed: 320,
      bedFee: 370,
    },
    {
      month: "Jun",
      registration: 670,
      consultation: 470,
      specialist: 390,
      nursing: 270,
      blood: 450,
      bed: 320,
      bedFee: 370,
    },
    {
      month: "Jul",
      registration: 670,
      consultation: 470,
      specialist: 390,
      nursing: 270,
      blood: 450,
      bed: 320,
      bedFee: 370,
    },
    {
      month: "Aug",
      registration: 670,
      consultation: 470,
      specialist: 390,
      nursing: 270,
      blood: 450,
      bed: 320,
      bedFee: 370,
    },
    {
      month: "Sep",
      registration: 670,
      consultation: 470,
      specialist: 390,
      nursing: 270,
      blood: 450,
      bed: 320,
      bedFee: 370,
    },
    {
      month: "Oct",
      registration: 670,
      consultation: 470,
      specialist: 390,
      nursing: 270,
      blood: 450,
      bed: 320,
      bedFee: 370,
    },
    {
      month: "Nov",
      registration: 670,
      consultation: 470,
      specialist: 390,
      nursing: 270,
      blood: 450,
      bed: 320,
      bedFee: 370,
    },
    {
      month: "Dec",
      registration: 670,
      consultation: 470,
      specialist: 390,
      nursing: 270,
      blood: 450,
      bed: 320,
      bedFee: 370,
    },
  ];

  // Custom tooltip to match styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
          <p className="font-semibold">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg custom-shadow">
      <div className="flex justify-between items-center md:mx-12 mb-4">
        <div className="relative">
          <select className="appearance-none border border-gray-300 rounded-md py-1 px-3 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Income</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <select className="appearance-none border border-gray-300 rounded-md py-1 px-3 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>2025</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className=" h-[350px] md:h-full " style={{ height: "550px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 70,
            }}
            barSize={2}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: isMobile ? 12 : 14 }}
              interval={isMobile ? 0 : 0}
            />
            <YAxis
              domain={[100, 800]} // Set the Y-axis domain to start from 100 and end at 800
              ticks={[100, 200, 300, 400, 500, 600, 700, 800]} // Explicitly define the tick values
              tick={{ fontSize: isMobile ? 12 : 14 }}
              width={isMobile ? 30 : 40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: 30 }}
            />
            <Bar
              dataKey="registration"
              name="Registration fee"
              fill="#4169E1"
              barSize={12}
            />
            <Bar
              dataKey="consultation"
              name="Consultation"
              fill="#8A2BE2"
              barSize={12}
            />
            <Bar
              dataKey="specialist"
              name="Specialist fee"
              fill="#FF0000"
              barSize={12}
            />
            <Bar
              dataKey="nursing"
              name="Nursing Care"
              fill="#FF8C00"
              barSize={12}
            />
            <Bar dataKey="blood" name="Blood" fill="#FF1493" barSize={12} />
            <Bar dataKey="bed" name="Bed fee" fill="#FF8C00" barSize={12} />
            <Bar dataKey="bedFee" name="Bed fee" fill="#9ACD32" barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinanceBarchart;
