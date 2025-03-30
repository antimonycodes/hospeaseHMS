// import { ArrowLeft, ArrowRight } from "lucide-react";
// import React, { useState, useEffect } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";

// interface Column<T> {
//   key: keyof T;
//   label: React.ReactNode;
//   render?: (value: T[keyof T], row: T) => React.ReactNode;
// }

// interface TableProps<T> {
//   columns: Column<T>[];
//   data: T[];
//   rowKey: keyof T;
//   pagination?: boolean;
//   rowsPerPage?: number;
//   radius?: string;
// }

// const Table = <T,>({
//   columns,
//   data,
//   rowKey,
//   pagination = false,
//   rowsPerPage = 5,
//   radius = "rounded-lg",
// }: TableProps<T>) => {
//   const [currentPage, setCurrentPage] = useState(1);

//   // Reset currentPage when rowsPerPage or data changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [rowsPerPage, data]);

//   const totalPages = Math.ceil(data.length / rowsPerPage);
//   const paginatedData = pagination
//     ? data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
//     : data;

//   return (
//     <div className="w-full overflow-x-auto">
//       <table className={`w-full min-w-max border border-[#EAECF0] ${radius}`}>
//         <thead className="bg-[#F9FAFB]">
//           <tr>
//             {columns.map((column) => (
//               <th
//                 key={String(column.key)}
//                 className="px-4 py-4 text-left font-medium text-sm text-[#667085] border-b border-[#EAECF0]"
//               >
//                 {column.label}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedData.map((row) => (
//             <tr key={String(row[rowKey])} className="border-b border-[#EAECF0]">
//               {columns.map((column) => (
//                 <td key={String(column.key)} className="px-4 py-4 text">
//                   {column.render
//                     ? column.render(row[column.key], row)
//                     : String(row[column.key])}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {pagination && totalPages > 1 && (
//         <div className="flex justify-between items-center mt-4 text-sm p-4">
//           {/* Previous Button */}
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className={`cursor-pointer px-4 py-2 border border-[#D0D5DD] rounded-lg flex items-center gap-2 text-[#344054] font-semibold ${
//               currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             <ArrowLeft />
//             Previous
//           </button>

//           {/* Page Numbers */}
//           <div className="flex space-x-1 items-center">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <button
//                 key={page}
//                 onClick={() => setCurrentPage(page)}
//                 className={`w-6 h-6 flex items-center justify-center rounded-lg text-sm font-medium ${
//                   page === currentPage
//                     ? "bg-[#F9F5FF] text-[#7F56D9]"
//                     : "text-[#667085]"
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}
//           </div>

//           {/* Next Button */}
//           <button
//             onClick={() =>
//               setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//             }
//             disabled={currentPage === totalPages}
//             className={`px-4 cursor-pointer py-2 border border-[#D0D5DD] rounded-lg flex items-center gap-2 text-[#344054] font-semibold ${
//               currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             Next
//             <ArrowRight />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Table;

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
}

const Table = <T,>({
  columns,
  data,
  rowKey,
  pagination = false,
  rowsPerPage = 5,
  radius = "rounded-lg",
  onPageChange,
  currentPage,
  totalPages,
}: TableProps<T> & {
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-b-[8px] shadow-table bg-white">
      <table className={`w-full min-w-max border border-[#EAECF0] ${radius}`}>
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
          {data.map((row) => (
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

      {pagination && totalPages && totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm p-4">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange?.(currentPage! - 1)}
            disabled={currentPage === 1}
            className={`cursor-pointer px-4 py-2 border border-[#D0D5DD] rounded-lg flex items-center gap-2 text-[#344054] font-semibold ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ArrowLeft />
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-1 items-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange?.(page)}
                className={`w-6 h-6 flex items-center justify-center rounded-lg text-sm font-medium ${
                  page === currentPage
                    ? "bg-[#F9F5FF] text-[#7F56D9]"
                    : "text-[#667085]"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange?.(currentPage! + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 cursor-pointer py-2 border border-[#D0D5DD] rounded-lg flex items-center gap-2 text-[#344054] font-semibold ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next
            <ArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
