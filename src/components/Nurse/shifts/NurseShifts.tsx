import React from "react";

import Tablehead from "../../ReusablepatientD/Tablehead";
import Table from "../../../Shared/Table";
import { ShiftData } from "../../../data/nurseData";

interface ShiftData {
  id: string;
  day: string;
  shift: string;
  start: string;
  end: string;
  department: string;
  selected?: boolean;
}

const NurseShifts = () => {
  const columns: {
    key: keyof ShiftData;
    label: string;
    render: (
      value: string | number | boolean,
      row: ShiftData
    ) => React.ReactNode;
  }[] = [
    {
      key: "day",
      label: "Day",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "shift",
      label: "Shift",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "start",
      label: "Start",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "end",
      label: "End",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "department",
      label: "Department",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
  ];

  return (
    <div>
      <Tablehead tableTitle="Shifts" />
      <Table
        data={ShiftData}
        columns={columns}
        rowKey="id"
        pagination={ShiftData.length > 10}
        rowsPerPage={10}
      />
    </div>
  );
};

export default NurseShifts;
