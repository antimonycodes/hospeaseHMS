// import React, { useEffect, useState } from "react";
// import Table from "../../../Shared/Table";
// import { Patient, patients } from "../../../data/patientsData";
// import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
// import { useNavigate } from "react-router-dom";
// import { usePatientStore } from "../../../store/super-admin/usePatientStore";
// import Loader from "../../../Shared/Loader";

// const PharmCard = () => {
//   const { getAllPatients, patients, isLoading } = usePatientStore();
//   const [activeStatus, setActiveStatus] = useState("pending");
//   const navigate = useNavigate();

//   useEffect(() => {
//     getAllPatients("pharmacy/patient/all");
//   }, []);

//   const transformedPatients = patients.map((item) => {
//     const attr = item.attributes;
//     const patient = attr.patient;

//     return {
//       id: item.id, // case note ID
//       name: `${patient?.first_name} ${patient?.last_name}`,
//       patientId: patient?.card_id,
//       gender: patient?.gender,
//       phone: patient?.phone_number,
//       status: attr?.status,
//       created_at: attr?.created_at,
//       caseNoteId: item?.id,
//       patientUniqueId: patient?.id,
//     };
//   });

//   // 👇 Always show these statuses as tabs
//   const statuses = ["pending", "ongoing", "completed"];

//   // 📊 Count each status
//   const statusCounts = transformedPatients.reduce(
//     (acc: Record<string, number>, patient) => {
//       const status = patient.status?.toLowerCase();
//       acc[status] = (acc[status] || 0) + 1;
//       return acc;
//     },
//     {
//       pending: 0,
//       ongoing: 0,
//       completed: 0,
//     }
//   );

//   const filteredPatients = transformedPatients.filter(
//     (p) => p.status?.toLowerCase() === activeStatus
//   );

//   const statusStyles: Record<string, string> = {
//     pending: "bg-yellow-100 text-yellow-800",
//     ongoing: "bg-blue-100 text-blue-800",
//     completed: "bg-green-100 text-green-800",
//   };

//   const columns = [
//     {
//       key: "name" as const,
//       label: "Name",
//       render: (_: any, data: any) => (
//         <span className="font-medium text-[#101828]">{data.name}</span>
//       ),
//     },
//     {
//       key: "patientId" as const,
//       label: "Patient ID",
//       render: (_: any, data: any) => (
//         <span className="text-[#667085]">{data.patientId}</span>
//       ),
//     },
//     {
//       key: "gender" as const,
//       label: "Gender",
//       render: (_: any, data: any) => (
//         <span className="text-[#667085]">{data.gender}</span>
//       ),
//     },
//     {
//       key: "phone" as const,
//       label: "Phone",
//       render: (_: any, data: any) => (
//         <span className="text-[#667085]">{data.phone}</span>
//       ),
//     },
//     {
//       key: "status" as const,
//       label: "Status",
//       render: (status: string) => (
//         <span
//           className={`px-3 py-1 rounded-full text-sm font-medium ${
//             statusStyles[status.toLowerCase()] || "bg-gray-100 text-gray-800"
//           }`}
//         >
//           {status}
//         </span>
//       ),
//     },
//     {
//       key: "id" as const,
//       label: "Action",
//       render: (_: any, row: any) => (
//         <span
//           className="text-[#009952] font-medium text-sm cursor-pointer"
//           onClick={() =>
//             navigate(
//               `/dashboard/pharmacy/patient/${row.patientUniqueId}/case-report/${row.caseNoteId}`
//             )
//           }
//         >
//           View More
//         </span>
//       ),
//     },
//   ];

//   if (isLoading) return <Loader />;

//   return (
//     <div>
//       <Table
//         columns={columns}
//         data={filteredPatients}
//         rowKey="patientId"
//         pagination={true}
//       />
//     </div>
//   );
// };

// export default PharmCard;
import React from "react";

const PharmCard = () => {
  return <div>PharmCard</div>;
};

export default PharmCard;
