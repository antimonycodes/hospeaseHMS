import { useState, useEffect, useMemo } from "react";
import Table from "../../../Shared/Table";

type Column<T> = {
  key: keyof T;
  label: string;
  render: (value: any, row: T) => React.ReactNode;
};

interface DoctorAttributes {
  id: number;
  first_name: string;
  last_name: string;
  is_active: boolean;
}

interface Doctor {
  id: number;
  attributes: DoctorAttributes;
}

const DoctorsTable = ({ doctors }: { doctors: Doctor[] }) => {
  // Use useMemo to avoid unnecessary re-calculations
  const simplifiedDoctors = useMemo(() => {
    return doctors.slice(0, 3).map((doc) => ({
      id: doc.id,
      first_name: doc.attributes.first_name,
      last_name: doc.attributes.last_name,
      is_active: doc.attributes.is_active,
    }));
  }, [doctors]); // Re-run this memoization only when `doctors` changes

  const columns: Column<DoctorAttributes>[] = [
    {
      key: "first_name",
      label: "Name",
      render: (_, doctor: DoctorAttributes) => (
        <div className="font-medium text-sm text-[#101828]">
          {doctor.first_name} {doctor.last_name}
        </div>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (_, doctor: DoctorAttributes) => {
        const bgColor =
          doctor.is_active === true ? "bg-[#CCFFE7]" : "bg-[#FBE1E1]";
        const textColor =
          doctor.is_active === true ? "text-[#009952]" : "text-[#F83E41]";

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
          >
            {doctor.is_active ? "Available" : "Absent"}
          </span>
        );
      },
    },
  ];

  return (
    <div className="basis-[40%] w-full h-full rounded-lg custom-shadow bg-white">
      <div className="p-4 flex items-center gap-2">
        <h1 className="font-medium text-lg text-[#101828]">Doctors</h1>
        <span className="bg-[#F9F5FF] py-1 px-4 rounded-full text-[#6941C6] font-medium">
          {doctors.length}
        </span>
      </div>
      <Table
        columns={columns}
        data={simplifiedDoctors}
        rowKey="id"
        pagination={true}
        rowsPerPage={3}
      />
    </div>
  );
};

export default DoctorsTable;
