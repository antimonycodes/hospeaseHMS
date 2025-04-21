// import React, { JSX } from "react";
// import Table from "../../../Shared/Table";
// import { Package } from "lucide-react";

// interface MedicineItem {
//   id: string;
//   name: string;
//   quantity: number;
//   itemNo: string;
//   dateAdded: string;
//   expiryDate: string;
//   selected?: boolean;
// }

// const medicineData: MedicineItem[] = [
//   {
//     id: "1",
//     name: "Septrin",
//     quantity: 200,
//     itemNo: "2DCJROM",
//     dateAdded: "12-12-2025",
//     expiryDate: "12-12-2025",
//     selected: false,
//   },
//   {
//     id: "2",
//     name: "Septrin",
//     quantity: 200,
//     itemNo: "2DCJROM",
//     dateAdded: "12-12-2025",
//     expiryDate: "12-12-2025",
//     selected: false,
//   },
//   {
//     id: "3",
//     name: "Septrin",
//     quantity: 200,
//     itemNo: "2DCJROM",
//     dateAdded: "12-12-2025",
//     expiryDate: "12-12-2025",
//     selected: false,
//   },
//   {
//     id: "4",
//     name: "Septrin",
//     quantity: 200,
//     itemNo: "2DCJROM",
//     dateAdded: "12-12-2025",
//     expiryDate: "12-12-2025",
//     selected: false,
//   },
// ];

// const InventoryTable = () => {
//   const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

//   // Toggle selection for a single item
//   const toggleItemSelection = (id: string) => {
//     setSelectedItems((prev) =>
//       prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
//     );
//   };

//   // Toggle selection for all items
//   const toggleAllSelection = () => {
//     if (selectedItems.length === medicineData.length) {
//       setSelectedItems([]);
//     } else {
//       setSelectedItems(medicineData.map((item) => item.id));
//     }
//   };

//   const medicineColumns: {
//     key: keyof MedicineItem | "selected";
//     label: string | JSX.Element;
//     render: (value: any, row: MedicineItem) => JSX.Element;
//   }[] = [
//     {
//       key: "selected",
//       label: (
//         <input
//           type="checkbox"
//           checked={
//             selectedItems.length === medicineData.length &&
//             medicineData.length > 0
//           }
//           onChange={toggleAllSelection}
//           className="h-4 w-4 rounded border-gray-300 text-[#7F56D9] focus:ring-[#7F56D9]"
//         />
//       ),
//       render: (_: any, row: MedicineItem) => (
//         <input
//           type="checkbox"
//           checked={selectedItems.includes(row.id)}
//           onChange={() => toggleItemSelection(row.id)}
//           className="h-4 w-4 rounded border-gray-300 text-[#7F56D9] focus:ring-[#7F56D9]"
//         />
//       ),
//     },
//     {
//       key: "name",
//       label: "Name",
//       render: (value: string, row: MedicineItem) => (
//         <div className="flex items-center">
//           <div className="bg-[#0EA5E9] p-2 rounded-md mr-2">
//             <Package className="h-4 w-4 text-white" />
//           </div>
//           <span className="text-sm font-medium">{value}</span>
//         </div>
//       ),
//     },
//     {
//       key: "quantity",
//       label: "Quantity",
//       render: (value: number) => (
//         <span className="text-sm text-[#667085]">{value}</span>
//       ),
//     },
//     {
//       key: "itemNo",
//       label: "Item NO",
//       render: (value: string) => (
//         <span className="text-sm text-[#667085]">{value}</span>
//       ),
//     },
//     {
//       key: "dateAdded",
//       label: "Date Added",
//       render: (value: string) => (
//         <span className="text-sm text-[#667085]">{value}</span>
//       ),
//     },
//     {
//       key: "expiryDate",
//       label: "Expiry Date",
//       render: (value: string) => (
//         <span className="text-sm text-[#667085]">{value}</span>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <Table
//         columns={medicineColumns}
//         data={medicineData}
//         rowKey="id"
//         pagination={true}
//       />
//     </div>
//   );
// };

// export default InventoryTable;
import React from "react";

const InventoryTable = () => {
  return <div>InventoryTable</div>;
};

export default InventoryTable;
