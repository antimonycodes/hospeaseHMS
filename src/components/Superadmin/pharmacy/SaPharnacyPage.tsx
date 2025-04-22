// import { Plus, Search } from "lucide-react";
// import { useState } from "react";
// import PatientsTable from "./PatientsTable";
// import InventoryTable from "./InventoryTable";

// const SaPharnacyPage = () => {
//   const [activeTab, setActiveTab] = useState(0);

//   return (
//     <div className="  bg-white custom-shadow p-4">
//       <div className=" flex flex-col md:flex-row-reverse gap-4 md:gap-24">
//         {/* Search and Button */}
//         <div className=" w-full flex-1 flex flex-col md:flex-row items-center gap-2">
//           <div className="relative w-full flex-1">
//             <input
//               type="text"
//               placeholder="Type to search"
//               className="w-full border border-gray-200 py-2 pl-10 pr-4 rounded-lg"
//             />
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] size-4" />
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex items-center text-xs gap-3">
//           <h1
//             className={`relative inline-block flex-none cursor-pointer text-base font-semibold ${
//               activeTab === 0 ? "text-primary" : "text-[#667185]"
//             }`}
//             onClick={() => setActiveTab(0)}
//           >
//             Patients
//             <div
//               className={`absolute left-0 -bottom-3 w-full h-[1px] ${
//                 activeTab === 0 ? "bg-primary" : "bg-[#E4E7EC]"
//               }`}
//             ></div>
//           </h1>
//           <h1
//             className={`relative inline-block flex-none cursor-pointer text-base font-semibold ${
//               activeTab === 1 ? "text-primary" : "text-[#667185]"
//             }`}
//             onClick={() => setActiveTab(1)}
//           >
//             Inventory
//             <div
//               className={`absolute left-0 -bottom-3 w-full h-[1px] ${
//                 activeTab === 1 ? "bg-primary" : "bg-[#E4E7EC]"
//               }`}
//             ></div>
//           </h1>
//         </div>
//       </div>
//       {/* tables */}
//       <div className=" mt-4">
//         {activeTab === 0 ? <PatientsTable /> : <InventoryTable />}
//       </div>
//     </div>
//   );
// };

// export default SaPharnacyPage;

import React, { useEffect, useState } from "react";
import Tabs from "../../ReusablepatientD/Tabs";
import InventoryTable from "./InventoryTable";
import PatientsTable from "./PatientsTable";
import Tablehead from "../../ReusablepatientD/Tablehead";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Table from "../../../Shared/Table";
import Loader from "../../../Shared/Loader";

const SaPharnacyPage = () => {
  const { getAllPatients, patients, isLoading, pagination } = usePatientStore();
  const [activeStatus, setActiveStatus] = useState("pending");
  const navigate = useNavigate();
  const baseEndpoint = "/admin/pharmacy/patient/all";

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

  const statuses = ["pending", "completed"];

  const statusCounts = transformedPatients.reduce(
    (acc: Record<string, number>, patient) => {
      const status = patient.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {
      pending: 0,

      completed: 0,
    }
  );

  const filteredPatients = transformedPatients.filter(
    (p) => p.status.toLowerCase() === activeStatus
  );

  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",

    completed: "bg-green-100 text-green-800",
  };

  if (isLoading) return <Loader />;

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
              `/dashboard/pharmacy/patient/${row.patientUniqueId}/case-report/${row.caseNoteId}`
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

  return (
    <div className="">
      <Tablehead
        tableTitle="Patients"
        tableCount={patients.length}
        showSearchBar={true}
        showControls={true}
      />
      {/*  Tabs */}
      <div className="w-full bg-white flex space-x-2 md:space-x-6 px-6">
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

export default SaPharnacyPage;
