import React, { JSX } from "react";
import Table from "../../../Shared/Table";

interface ShiftItem {
  id: string;
  day: string;
  shift: string;
  start: string;
  end: string;
  department: string;
  selected?: boolean;
}

const ShiftData: ShiftItem[] = [
  {
    id: "1",
    day: "Monday, 12th Jan, 2025",
    shift: "Morning",
    start: "08:00am",
    end: "08:00pm",
    department: "Urology",
    selected: false,
  },
  {
    id: "2",
    day: "Monday, 17th March, 2025",
    shift: "Morning",
    start: "08:00am",
    end: "08:00pm",
    department: "Urology",
    selected: false,
  },
  {
    id: "3",
    day: "Wednesday, 19th March, 2025",
    shift: "Morning",
    start: "08:00am",
    end: "08:00pm",
    department: "Urology",
    selected: false,
  },
];

const ShiftTable = () => {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  // Toggle selection for a single item
  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Toggle selection for all items
  const toggleAllSelection = () => {
    if (selectedItems.length === ShiftData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(ShiftData.map((item) => item.id));
    }
  };

  const ShiftColumns: {
    key: keyof ShiftItem | "selected";
    label: string | JSX.Element;
    render: (value: any, row: ShiftItem) => JSX.Element;
  }[] = [
    {
      key: "selected",
      label: (
        <div className="flex items-center gap-2">
          <div
            onClick={toggleAllSelection}
            className={`h-[20px] w-[20px] rounded-[6px] border border-[#D0D5DD] flex items-center justify-center cursor-pointer ${
              selectedItems.length === ShiftData.length && ShiftData.length > 0
                ? "bg-[#7F56D9] border-[#7F56D9]"
                : "bg-white"
            }`}
          >
            {selectedItems.length === ShiftData.length &&
              ShiftData.length > 0 && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
          </div>
          <p>Day</p>
        </div>
      ),
      render: (_: any, row: ShiftItem) => (
        <div className="flex gap-2">
          <div
            onClick={() => toggleItemSelection(row.id)}
            className={`h-[20px] w-[20px] rounded-[6px] border border-[#D0D5DD] flex items-center justify-center cursor-pointer ${
              selectedItems.includes(row.id)
                ? "bg-[#7F56D9] border-[#7F56D9]"
                : "bg-white"
            }`}
          >
            {selectedItems.includes(row.id) && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span className="font-medium text-[#101828] text-sm">{row.day}</span>
        </div>
      ),
    },
    {
      key: "shift",
      label: "Shift Time",
      render: (_, data) => (
        <span className="text-[#667085] text-sm">{data.shift}</span>
      ),
    },
    {
      key: "end",
      label: "End Time",
      render: (_, data) => (
        <span className="text-[#667085] text-sm">{data.end}</span>
      ),
    },
    {
      key: "department",
      label: "Department",
      render: (_, data) => (
        <span className="text-[#667085] text-sm">{data.department}</span>
      ),
    },
  ];

  return (
    <div className="w-full h-full bg-white rounded-[8px] shadow overflow-hidden font-inter">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-[18px] w-[160px] font-medium">Shifts</h1>
      </div>
      <Table
        columns={ShiftColumns}
        data={ShiftData}
        rowKey="id"
        pagination={true}
        rowsPerPage={10}
      />
    </div>
  );
};

export default ShiftTable;
