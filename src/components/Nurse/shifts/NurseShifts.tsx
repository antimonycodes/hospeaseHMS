// import React, { JSX, useEffect, useState } from "react";

// import Tablehead from "../../ReusablepatientD/Tablehead";
// import Table from "../../../Shared/Table";
// import { ShiftData } from "../../../data/nurseData";
// import { useNurseStore } from "../../../store/super-admin/useNuseStore";
// import { useGlobalStore } from "../../../store/super-admin/useGlobal";

// interface ShiftItem {
//   id: string;
//   day: string;
//   shift: string;
//   start: string;
//   end: string;
//   department: string;
// }

// const NurseShifts = () => {
//   const userId = sessionStorage.getItem("userId");
//   const [selectedItems, setSelectedItems] = useState<string[]>([]);
//   const { getStaffShifts, staffShift } = useGlobalStore();

//   useEffect(() => {
//     if (userId) {
//       getStaffShifts(userId, `/nurses/shift/user-records/${userId}`);
//     }
//   }, [getStaffShifts, userId]);

//   // Convert API data to table structure
//   const mappedShifts: ShiftItem[] = (staffShift || []).map((shift: any) => ({
//     id: String(shift.id),
//     day: shift.attributes.date,
//     shift: shift.attributes.shift_type,
//     start: shift.attributes.start_time,
//     end: shift.attributes.end_time,
//     department: shift.attributes.status,
//   }));

//   // Toggle selection for one
//   const toggleItemSelection = (id: string) => {
//     setSelectedItems((prev) =>
//       prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
//     );
//   };

//   // Toggle all
//   const toggleAllSelection = () => {
//     if (selectedItems.length === mappedShifts.length) {
//       setSelectedItems([]);
//     } else {
//       setSelectedItems(mappedShifts.map((item) => item.id));
//     }
//   };

//   const ShiftColumns: {
//     key: keyof ShiftItem;
//     label: React.ReactNode;
//     render: (_: any, row: ShiftItem) => JSX.Element;
//   }[] = [
//     {
//       key: "day", // using 'day' as key since it's a real field
//       label: (
//         <div className="flex items-center gap-2">
//           <div
//             onClick={toggleAllSelection}
//             className={`h-[20px] w-[20px] rounded-[6px] border border-[#D0D5DD] flex items-center justify-center cursor-pointer ${
//               selectedItems.length === mappedShifts.length &&
//               mappedShifts.length > 0
//                 ? "bg-[#7F56D9] border-[#7F56D9]"
//                 : "bg-white"
//             }`}
//           >
//             {selectedItems.length === mappedShifts.length &&
//               mappedShifts.length > 0 && (
//                 <svg
//                   className="w-3 h-3 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//               )}
//           </div>
//           <p>Day</p>
//         </div>
//       ),
//       render: (_: any, row: ShiftItem) => (
//         <div className="flex gap-2">
//           <div
//             onClick={() => toggleItemSelection(row.id)}
//             className={`h-[20px] w-[20px] rounded-[6px] border border-[#D0D5DD] flex items-center justify-center cursor-pointer ${
//               selectedItems.includes(row.id)
//                 ? "bg-[#7F56D9] border-[#7F56D9]"
//                 : "bg-white"
//             }`}
//           >
//             {selectedItems.includes(row.id) && (
//               <svg
//                 className="w-3 h-3 text-white"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             )}
//           </div>
//           <span className="font-medium text-[#101828] text-sm">{row.day}</span>
//         </div>
//       ),
//     },
//     {
//       key: "shift",
//       label: "Shift Type",
//       render: (_: any, data: ShiftItem) => (
//         <span className="text-[#667085] text-sm">{data.shift}</span>
//       ),
//     },
//     {
//       key: "start",
//       label: "Start Time",
//       render: (_: any, data: ShiftItem) => (
//         <span className="text-[#667085] text-sm">{data.start}</span>
//       ),
//     },
//     {
//       key: "end",
//       label: "End Time",
//       render: (_: any, data: ShiftItem) => (
//         <span className="text-[#667085] text-sm">{data.end}</span>
//       ),
//     },
//     {
//       key: "department",
//       label: "Status",
//       render: (_: any, data: ShiftItem) => (
//         <span className="text-[#667085] text-sm">{data.department}</span>
//       ),
//     },
//   ];
//   return (
//     <div className="w-full h-full bg-white rounded-[8px] shadow overflow-hidden font-inter">
//       <div className="p-6 flex items-center justify-between">
//         <h1 className="text-[18px] w-[160px] font-medium">Shifts</h1>
//       </div>
//       <Table
//         columns={ShiftColumns}
//         data={mappedShifts}
//         rowKey="id"
//         pagination={true}
//       />
//     </div>
//   );
// };

// export default NurseShifts;

const NurseShifts = () => {
  return <div>NurseShifts</div>;
};

export default NurseShifts;
