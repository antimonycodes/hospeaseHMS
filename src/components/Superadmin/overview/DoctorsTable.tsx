import { JSX } from "react";
import img from "../../../assets/ribiero.png";
import Table from "../../../Shared/Table";

type Doctor = {
  id: string;
  name: string;
  username: string;
  status: "Available" | "Absent";
  avatar: string;
};

type Column<T> = {
  key: keyof T;
  label: string;
  render: (value: any, row: T) => JSX.Element;
};

const DoctorsTable = () => {
  const doctors: Doctor[] = [
    {
      id: "1",
      name: "Olivia Rhye",
      username: "@olivia",
      status: "Available",
      avatar: img,
    },
    {
      id: "2",
      name: "Phoenix Baker",
      username: "@phoenix",
      status: "Absent",
      avatar: img,
    },
    {
      id: "3",
      name: "Lana Steiner",
      username: "@lana",
      status: "Available",
      avatar: img,
    },
  ];

  const columns: Column<Doctor>[] = [
    {
      key: "name",
      label: "Name",
      render: (_, doctor: Doctor) => (
        <div className="flex items-center">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-8 h-8 rounded-full mr-3"
          />
          <div>
            <div className="font-medium text-sm text-[#101828]">
              {doctor.name}
            </div>
            <div className="text-[#667085] text-sm">{doctor.username}</div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (_, doctor: Doctor) => {
        const bgColor =
          doctor.status === "Available" ? "bg-[#CCFFE7]" : "bg-[#FBE1E1]";
        const textColor =
          doctor.status === "Available" ? "text-[#009952]" : "text-[#F83E41]";

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
          >
            {doctor.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="w-full h-full md:basis-[40%]  rounded-lg shadow-md bg-white">
      <h1 className=" font-medium text-lg text-[#101828] p-4">Doctors</h1>
      <Table
        data={doctors}
        columns={columns}
        rowKey="id"
        // className="doctors-table"
        // emptyMessage="No doctors available"
      />
    </div>
  );
};

export default DoctorsTable;
