// import { Search } from "lucide-react";
// import { useState, JSX } from "react";
// import Table from "../../../Shared/Table";

// interface Patient {
//   name: string;
//   patientId: string;
//   gender: string;
//   phone: string;
//   occupation: string;
//   doctor: string;
//   status: "Pending" | "Ongoing" | "Completed";
//   viewMore: string;
// }

// interface Column<T> {
//   key: keyof T;
//   label: string;
//   render?: (value: any, row: T) => JSX.Element;
// }

// const tabs = ["Pending", "Ongoing", "Completed"] as const;
// type TabType = (typeof tabs)[number];

// // **Calculate the count for each status**
// const getStatusCounts = () => {
//   return patients.reduce(
//     (acc, patient) => {
//       acc[patient.status]++;
//       return acc;
//     },
//     { Pending: 0, Ongoing: 0, Completed: 0 }
//   );
// };

// export const patients: Patient[] = [
//   {
//     name: "Philip Ikiriko",
//     patientId: "0010602",
//     gender: "Male",
//     phone: "+234 709 823 2411",
//     occupation: "Banker",
//     doctor: "Dr Omogpe Peter",
//     status: "Pending",
//     viewMore: "View More",
//   },
//   {
//     name: "John Diongoli",
//     patientId: "0020602",
//     gender: "Female",
//     phone: "+234 802 987 8543",
//     occupation: "Tailor",
//     doctor: "Dr Mary Omisore",
//     status: "Ongoing",
//     viewMore: "View More",
//   },
//   {
//     name: "Mary Durusaiye",
//     patientId: "0030602",
//     gender: "Male",
//     phone: "+234 805 804 5130",
//     occupation: "Farmer",
//     doctor: "Dr Michael Saidu",
//     status: "Completed",
//     viewMore: "View More",
//   },
//   {
//     name: "Martha Taribo",
//     patientId: "0040602",
//     gender: "Female",
//     phone: "+234 803 800 1111",
//     occupation: "Teacher",
//     doctor: "Dr Andrew Oyeleke",
//     status: "Pending",
//     viewMore: "View More",
//   },
// ];

// const columns: Column<Patient>[] = [
//   {
//     key: "name",
//     label: "Name",
//     render: (_, data) => (
//       <span className="font-medium text-[#101828]">{data.name}</span>
//     ),
//   },
//   {
//     key: "patientId",
//     label: "Patient ID",
//     render: (_, data) => (
//       <span className="text-[#667085]">{data.patientId}</span>
//     ),
//   },
//   {
//     key: "gender",
//     label: "Gender",
//     render: (_, data) => <span className="text-[#667085]">{data.gender}</span>,
//   },
//   {
//     key: "phone",
//     label: "Phone",
//     render: (_, data) => <span className="text-[#667085]">{data.phone}</span>,
//   },
//   {
//     key: "occupation",
//     label: "Occupation",
//     render: (_, data) => (
//       <span className="text-[#667085]">{data.occupation}</span>
//     ),
//   },
//   {
//     key: "doctor",
//     label: "Doctor Assigned",
//     render: (_, data) => <span className="text-[#667085]">{data.doctor}</span>,
//   },
//   {
//     key: "status",
//     label: "Status",
//     render: (status: Patient["status"]) => (
//       <span
//         className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}
//       >
//         {status}
//       </span>
//     ),
//   },
//   {
//     key: "viewMore",
//     label: "",
//     render: (_, data) => (
//       <span
//         className="text-primary text-sm font-medium cursor-pointer"
//         // onClick={() => handleViewMore(data.patientId)}
//       >
//         View More
//       </span>
//     ),
//   },
// ];

// const statusStyles: Record<Patient["status"], string> = {
//   Ongoing: "bg-[#FFEBAA] text-[#B58A00]",
//   Completed: "bg-[#CFFFE9] text-[#009952]",
//   Pending: "bg-[#FBE1E1] text-[#F83E41]",
// };

// const SaLaboratoryPage = () => {
//   const [activeTab, setActiveTab] = useState<TabType>("Pending");
//   const statusCounts = getStatusCounts();

//   const filteredPatients = patients.filter((p) => p.status === activeTab);

//   return (
//     <div className="rounded-lg custom-shadow bg-white p-4">
//       {/* search and filter */}
//       <div className=" flex items-center justify-between gap-8 lg:gap-24">
//         <div className=" flex gap-2">
//           {/* title */}
//           <h1>Patient</h1>
//           <span>3000</span>
//         </div>
//         {/* search input */}
//         <div className="relative w-full flex-1">
//           <input
//             type="text"
//             placeholder="Type to search"
//             className="w-full border border-gray-200 py-2 pl-10 pr-4 rounded-lg"
//           />
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] size-4" />
//         </div>
//       </div>
//       {/* Tabs */}
//       <div className=" w-full flex space-x-2 md:space-x-6 mt-4">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`pb-2 text-xs md:text-sm font-medium ${
//               activeTab === tab
//                 ? "text-green-600 border-b-2 border-green-600"
//                 : "text-gray-500"
//             }`}
//           >
//             {tab}
//             {activeTab === tab && (
//               <span className="  text-xs bg-primary text-white py-0.5 px-3 rounded-xl">
//                 {statusCounts[tab]}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Table */}
//       <Table
//         columns={columns}
//         data={filteredPatients}
//         rowKey="patientId"
//         pagination={true}
//       />
//     </div>
//   );
// };

// export default SaLaboratoryPage;

import React, { useEffect, useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Table from "../../../Shared/Table";
import Loader from "../../../Shared/Loader";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";

const SaLaboratoryPage = () => {
  const { patients, getAllPatients, isLoading, pagination } = usePatientStore();
  const [activeStatus, setActiveStatus] = useState("pending");
  const navigate = useNavigate();
  const baseEndpoint = "/admin/laboratory/patient/all";

  useEffect(() => {
    getAllPatients("1", "10", baseEndpoint);
  }, [getAllPatients]);

  const transformedPatients = patients.map((item) => {
    const attr = item.attributes;
    const patient = attr.patient;

    return {
      id: item.id, // case note ID
      name: `${patient.first_name} ${patient.last_name}`,
      patientId: patient.card_id,
      gender: patient.gender,
      phone: patient.phone_number,
      status: attr.status,
      created_at: attr.created_at,
      caseNoteId: item.id,
      patientUniqueId: patient.id,
    };
  });

  const statuses = ["pending", "ongoing", "completed"];

  const statusCounts = transformedPatients.reduce(
    (acc: Record<string, number>, patient) => {
      const status = patient.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {
      pending: 0,
      ongoing: 0,
      completed: 0,
    }
  );

  const filteredPatients = transformedPatients.filter(
    (p) => p.status.toLowerCase() === activeStatus
  );

  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    ongoing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  const columns = [
    {
      key: "name" as const,
      label: "Name",
      render: (_: any, data: any) => (
        <span className="font-medium text-[#101828]">{data.name}</span>
      ),
    },
    {
      key: "patientId" as const,
      label: "Patient ID",
      render: (_: any, data: any) => (
        <span className="text-[#667085]">{data.patientId}</span>
      ),
    },
    {
      key: "gender" as const,
      label: "Gender",
      render: (_: any, data: any) => (
        <span className="text-[#667085]">{data.gender}</span>
      ),
    },
    {
      key: "phone" as const,
      label: "Phone",
      render: (_: any, data: any) => (
        <span className="text-[#667085]">{data.phone}</span>
      ),
    },
    {
      key: "status" as const,
      label: "Status",
      render: (status: string) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusStyles[status.toLowerCase()] || "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      key: "id" as const,
      label: "Action",
      render: (_: any, row: any) => (
        <span
          className="text-[#009952] font-medium text-sm cursor-pointer"
          onClick={() =>
            navigate(
              `/dashboard/laboratory/patient/${row.patientUniqueId}/case-report/${row.caseNoteId}`
            )
          }
        >
          View More
        </span>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    // Use the stored baseEndpoint for consistency when changing pages
    getAllPatients(page.toString(), "10", baseEndpoint);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="mt-2">
      {/*  Table Header */}
      <Tablehead
        tableTitle="Patients"
        showSearchBar={true}
        showControls={true}
        tableCount={patients.length}
      />
      {/*  Tabs */}
      <div className="w-full bg-white flex space-x-2 md:space-x-6 px-6 ">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`pb-2 text-xs md:text-sm font-medium capitalize ${
              activeStatus === status
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
          >
            {status}
            <span className="text-xs bg-primary text-white py-0.5 px-3 rounded-xl ml-1">
              {statusCounts[status] || 0}
            </span>
          </button>
        ))}
      </div>

      <Table
        columns={columns}
        data={filteredPatients}
        rowKey="patientId"
        pagination={true}
        paginationData={pagination}
        onPageChange={handlePageChange}
        loading={isLoading}
      />
    </div>
  );
};

export default SaLaboratoryPage;
