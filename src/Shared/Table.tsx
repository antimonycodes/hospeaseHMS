import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState } from "react";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T;
  pagination?: boolean;
  rowsPerPage?: number;
}

const Table = <T,>({
  columns,
  data,
  rowKey,
  pagination = false,
  rowsPerPage = 5,
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = pagination
    ? data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : data;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-max border border-[#EAECF0]">
        <thead className="bg-[#F9FAFB]">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-4 py-4 text-left font-medium text-sm text-[#667085] border-b border-[#EAECF0]"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr key={String(row[rowKey])} className="border-b border-[#EAECF0]">
              {columns.map((column) => (
                <td key={String(column.key)} className="px-4 py-4 text">
                  {column.render
                    ? column.render(row[column.key], row)
                    : String(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <button className="px-4 py-2 border border-[#D0D5DD] rounded-lg flex items-center gap-2 text-[#344054] font-semibold">
            <ArrowLeft />
            Previous
          </button>

          <div className="flex space-x-1 items-center">
            <button className="w-6 h-6 flex items-center justify-center bg-[#F9F5FF] p-6 rounded-lg text-sm text-[#7F56D9] font-medium">
              1
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded-full text-sm text-[#667085] font-medium">
              2
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded-full text-sm text-[#667085] font-medium">
              3
            </button>
            <span className="px-1">...</span>
            <button className="w-6 h-6 flex items-center justify-center rounded-full text-sm text-[#667085] font-medium">
              8
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded-full text-sm text-[#667085] font-medium">
              9
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded-full text-sm text-[#667085] font-medium">
              10
            </button>
          </div>

          <button className="px-4 py-2 border border-[#D0D5DD] rounded-lg flex items-center gap-2 text-[#344054] font-semibold">
            Next
            <ArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
