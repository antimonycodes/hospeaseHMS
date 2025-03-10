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
        <div className="flex justify-end space-x-2 p-3">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) =>
                prev * rowsPerPage < data.length ? prev + 1 : prev
              )
            }
            disabled={currentPage * rowsPerPage >= data.length}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
