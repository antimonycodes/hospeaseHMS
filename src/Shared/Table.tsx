import React from "react";
import Loader from "./Loader";

interface Column<T> {
  key: keyof T;
  label: React.ReactNode;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T;
  pagination?: boolean;
  rowsPerPage?: number;
  radius?: string;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
}

const Table = <T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  pagination = false,
  rowsPerPage = 5,
  radius = "rounded-lg",
  onPageChange,
  currentPage = 1,
  totalPages = 1,
}: TableProps<T>) => {
  // Handle edge case where data is empty
  const showEmptyState = data.length === 0;

  // Generate an array of page numbers, but limited to prevent too many buttons
  const getPageNumbers = () => {
    // Always include the first page, last page, and pages around the current page
    const pageNumbers = new Set<number>();
    pageNumbers.add(1); // First page

    if (totalPages > 1) {
      pageNumbers.add(totalPages); // Last page
    }

    // Add current page and neighbors
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      pageNumbers.add(i);
    }

    // Convert to sorted array
    return Array.from(pageNumbers).sort((a, b) => a - b);
  };

  const pageNumbers = getPageNumbers();

  // Add ellipsis indicators between non-consecutive page numbers
  const getPageItems = () => {
    const items: (number | string)[] = [];

    pageNumbers.forEach((page, index) => {
      // Add the page number
      items.push(page);

      // Check if we need to add an ellipsis
      if (index < pageNumbers.length - 1 && pageNumbers[index + 1] > page + 1) {
        items.push("...");
      }
    });

    return items;
  };

  const pageItems = getPageItems();

  return (
    <div
      className={`overflow-hidden overflow-x-scroll border border-[#EAECF0] ${radius}`}
    >
      <table className="min-w-full divide-y divide-[#EAECF0]">
        <thead className="bg-[#F9FAFB]">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-[#667085] uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[#EAECF0]">
          {showEmptyState ? (
            <Loader />
          ) : (
            data.map((row) => (
              <tr key={String(row[rowKey])}>
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className="px-6 py-4 whitespace-nowrap text-sm text-[#101828]"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-[#EAECF0]">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`px-4 py-2 border border-[#D0D5DD] rounded-lg flex items-center gap-2 text-[#344054] font-semibold 
              ${
                currentPage <= 1
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="#667085"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Previous
          </button>

          {/* Page Numbers with Ellipsis */}
          {/* <div className="flex items-center gap-1">
            {pageItems.map((item, index) =>
              typeof item === "number" ? (
                <button
                  key={index}
                  onClick={() => onPageChange?.(item)}
                  className={`w-6 h-6 flex items-center justify-center rounded-lg text-sm font-medium ${
                    item === currentPage
                      ? "bg-[#F9F5FF] text-[#7F56D9]"
                      : "text-[#667085]"
                  }`}
                >
                  {item}
                </button>
              ) : (
                <span key={index} className="text-[#667085] mx-1">
                  ...
                </span>
              )
            )}
          </div> */}

          {/* Next Button */}
          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`px-4 py-2 border border-[#D0D5DD] rounded-lg flex items-center gap-2 text-[#344054] font-semibold 
              ${
                currentPage >= totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
          >
            Next
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 5L12.5 10L7.5 15"
                stroke="#667085"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
