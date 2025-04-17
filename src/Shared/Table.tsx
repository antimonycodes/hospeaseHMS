import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import Loader from "./Loader";

interface Column<T> {
  key: keyof T;
  label: React.ReactNode;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

// Pagination data interface to match backend response
interface PaginationData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T;
  pagination?: boolean;
  paginationData?: PaginationData | null;
  radius?: string;
  onPageChange?: (page: number) => void;
  loading?: boolean;
}

const Table = <T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  pagination = false,
  paginationData,
  radius = "rounded-b-lg",
  onPageChange,
  loading = false,
}: TableProps<T>) => {
  // Handle edge case where data is empty
  const showEmptyState = data.length === 0 && !loading;
  const showLoader = loading && data.length === 0;

  // Use pagination data if available
  const currentPage = paginationData?.current_page || 1;
  const totalPages = paginationData?.last_page || 1;
  const startItem = paginationData?.from || 0;
  const endItem = paginationData?.to || 0;
  const totalItems = paginationData?.total || 0;

  // Generate page numbers with proper ellipses
  const getPageItems = () => {
    const items: (number | string)[] = [];

    // Always show first page
    items.push(1);

    if (totalPages <= 7) {
      // If total pages is small, show all pages
      for (let i = 2; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // For large page counts, show ellipses intelligently

      // Show ellipsis after first page if current page is far enough
      if (currentPage > 3) {
        items.push("ellipsis-1");
      }

      // Pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          items.push(i);
        }
      }

      // Show ellipsis before last page if needed
      if (currentPage < totalPages - 2) {
        items.push("ellipsis-2");
      }

      // Always show last page if more than one page
      if (totalPages > 1) {
        items.push(totalPages);
      }
    }

    return items;
  };

  return (
    <div
      className={`overflow-hidden overflow-x-auto border border-[#EAECF0] ${radius}`}
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
          {showLoader ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <div className="flex justify-center">
                  <Loader />
                </div>
              </td>
            </tr>
          ) : showEmptyState ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-[#667085]"
              >
                No data available
              </td>
            </tr>
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

      {pagination && paginationData && totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-[#EAECF0]">
          {/* Showing entries info */}
          <div className="text-sm text-[#667085] mb-2 sm:mb-0">
            Showing {startItem} to {endItem} of {totalItems} entries
          </div>

          <div className="flex items-center gap-2">
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
              type="button"
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
            <div className="hidden sm:flex items-center gap-1">
              {getPageItems().map((item, index) =>
                typeof item === "number" ? (
                  <button
                    key={index}
                    onClick={() => onPageChange?.(item)}
                    type="button"
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium ${
                      item === currentPage
                        ? "bg-[#F9F5FF] text-[#7F56D9] border border-[#7F56D9]"
                        : "text-[#667085] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    {item}
                  </button>
                ) : (
                  <span key={item.toString()} className="text-[#667085] px-2">
                    ...
                  </span>
                )
              )}
            </div>

            {/* Current page indicator for mobile */}
            <div className="sm:hidden text-sm font-medium text-[#667085]">
              Page {currentPage} of {totalPages}
            </div>

            {/* Next Button */}
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
              type="button"
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
        </div>
      )}
    </div>
  );
};

export default Table;
