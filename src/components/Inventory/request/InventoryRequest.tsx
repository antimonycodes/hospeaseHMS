// import React, { JSX, useEffect, useState } from "react";
// import Tablehead from "../../ReusablepatientD/Tablehead";
// import Table from "../../../Shared/Table";
// import AddRequestModal from "./AddRequestModal";
// import { useInventoryStore } from "../../../store/staff/useInventoryStore";
// import RequestHistory from "./RequestHistory";
// import StockActivity from "../../Superadmin/pharmacy/StockActivity";
// import { Search } from "lucide-react";

// export type RequestData = {
//   id: number;
//   type: string;
//   attributes: {
//     request_department: any;
//     requested_by: {
//       id: number;
//       first_name: string;
//       last_name: string;
//     };
//     item_requested: {
//       id: number;
//       inventory: {
//         id: 10;
//         service_item_name: string;
//         service_item_price: string;
//       };
//     };
//     hospital: {
//       id: number;
//       name: string;
//       logo: string;
//     };
//     quantity: number;
//     recorded_by: {
//       id: number;
//       first_name: string;
//       last_name: string;
//     };
//     status: string;
//     created_at: string;
//   };
// };

// interface Column<T> {
//   key: keyof T;
//   label: string;
//   render?: (value: any, record: T) => JSX.Element;
// }

// // Empty Request History Component

// // Pharmacy Stock Component (current functionality)
// export const PharmacyStock = ({ openModal, closeModal, isModalOpen }: any) => {
//   const { getAllRequest, requests, isLoading } =
//     useInventoryStore() as unknown as {
//       getAllRequest: () => void;
//       requests: { data: RequestData[]; pagination: object } | null;
//       isLoading: boolean;
//     };

//   useEffect(() => {
//     getAllRequest();
//   }, [getAllRequest]);

//   const requestsArray =
//     requests && requests.data && Array.isArray(requests.data)
//       ? requests.data
//       : [];

//   console.log("requestsArray length:", requestsArray.length);
//   console.log("First item in requestsArray:", requestsArray[0]);

//   const columns = [
//     {
//       key: "id" as keyof RequestData,
//       label: "Requested By",
//       render: (_, request) => {
//         // Handle both staff requests and department requests
//         if (request.attributes.requested_by) {
//           // Staff request format
//           return (
//             <div className="flex items-center gap-2">
//               <h1 className="text-custom-black font-medium">
//                 {request.attributes.requested_by.first_name}{" "}
//                 {request.attributes.requested_by.last_name}
//               </h1>
//             </div>
//           );
//         } else if (request.attributes.request_department) {
//           // Department request format
//           return (
//             <div className="flex items-center gap-2">
//               <h1 className="text-custom-black font-medium">
//                 {request.attributes.request_department}
//               </h1>
//             </div>
//           );
//         } else {
//           return <span className="text-gray-400">Not specified</span>;
//         }
//       },
//     },
//     {
//       key: "type" as keyof RequestData,
//       label: "Category",
//       render: (_, request) => (
//         <span className="text-[#667085] text-sm">{request.type || "N/A"}</span>
//       ),
//     },
//     {
//       key: "id" as keyof RequestData,
//       label: "Item Name",
//       render: (_, request) => (
//         <span className="text-[#667085] text-sm">
//           {request.attributes.item_requested.inventory.service_item_name}
//         </span>
//       ),
//     },
//     {
//       key: "id" as keyof RequestData,
//       label: "Item Price",
//       render: (_, request) => (
//         <span className="text-[#667085] text-sm">
//           {request.attributes.item_requested.inventory.service_item_price}
//         </span>
//       ),
//     },
//     {
//       key: "id" as keyof RequestData,
//       label: "Quantity",
//       render: (_, request) => (
//         <span className="text-[#667085] text-sm">
//           {request.attributes.quantity}
//         </span>
//       ),
//     },
//     {
//       key: "id" as keyof RequestData,
//       label: "Recorded By",
//       render: (_, request) => (
//         <div className="flex flex-col">
//           <span className="text-sm text-gray-500">
//             {request.attributes.recorded_by.first_name}{" "}
//             {request.attributes.recorded_by.last_name}
//           </span>
//         </div>
//       ),
//     },
//     {
//       key: "id" as keyof RequestData,
//       label: "Date",
//       render: (_, request) => (
//         <span className="text-[#667085] text-sm">
//           {request.attributes.created_at}
//         </span>
//       ),
//     },
//   ] as Column<RequestData>[];

//   return (
//     <>
//       <div className="w-full bg-white rounded-b-[8px] shadow-table">
//         <div className="relative flex-1 max-w-md py-3">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <input
//             type="text"
//             placeholder="Search items..."
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
//             // value={filters.search}
//             // onChange={(e) =>
//             //   setFilters((prev) => ({ ...prev, search: e.target.value }))
//             // }
//           />
//         </div>
//         {isLoading ? (
//           <p>Loading...</p>
//         ) : requestsArray.length === 0 ? (
//           <p className="p-4 text-center text-gray-500">No requests available</p>
//         ) : (
//           <Table
//             data={requestsArray}
//             columns={columns}
//             rowKey="id"
//             loading={isLoading}
//             radius="rounded-none"
//           />
//         )}
//       </div>
//       {isModalOpen && (
//         <AddRequestModal
//           onClose={closeModal}
//           endpoint="/inventory/requests/create"
//           refreshEndpoint="/inventory/requests/all-records"
//           fetchEndpoint="/medical-report/department-request-records"
//           stockEndpoint="/inventory/all-inventory-items"
//         />
//       )}
//     </>
//   );
// };

// // Main Tabbed Component
// const InventoryRequest = () => {
//   const [activeTab, setActiveTab] = useState<
//     "pharmacy" | "history" | "activities"
//   >("pharmacy");
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);
//   const tabs = [
//     { id: "pharmacy", label: "Pharmacy Stock" },
//     { id: "history", label: "Request History" },
//     { id: "activities", label: "Sales History" },
//   ];

//   return (
//     <div>
//       {/* Tab Header with Tablehead */}
//       <Tablehead
//         typebutton="Add New"
//         tableTitle="Inventory Management"
//         showButton={activeTab === "pharmacy"}
//         onButtonClick={() => {
//           openModal();
//         }}
//       />

//       {/* Tab Navigation */}
//       <div className="bg-white ">
//         <div className="flex">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id as "pharmacy" | "history")}
//               className={`px-6 py-3 text-xl font-medium  border-b-2 transition-colors ${
//                 activeTab === tab.id
//                   ? "border-primary text-primary "
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Tab Content */}
//       <div className="mt-0">
//         {activeTab === "pharmacy" && (
//           <PharmacyStock
//             isModalOpen={isModalOpen}
//             closeModal={closeModal}
//             openModal={openModal}
//           />
//         )}
//         {activeTab === "history" && <RequestHistory />}
//         {activeTab === "activities" && <StockActivity />}
//       </div>
//     </div>
//   );
// };

// export default InventoryRequest;
import React, { JSX, useEffect, useState, useMemo } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Table from "../../../Shared/Table";
import AddRequestModal from "./AddRequestModal";
import { useInventoryStore } from "../../../store/staff/useInventoryStore";
import RequestHistory from "./RequestHistory";
import StockActivity from "../../Superadmin/pharmacy/StockActivity";
import { Search } from "lucide-react";

export type RequestData = {
  id: number;
  type: string;
  attributes: {
    request_department: any;
    requested_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    item_requested: {
      id: number;
      inventory: {
        id: 10;
        service_item_name: string;
        service_item_price: string;
      };
    };
    hospital: {
      id: number;
      name: string;
      logo: string;
    };
    quantity: number;
    recorded_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    status: string;
    created_at: string;
  };
};

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, record: T) => JSX.Element;
}

// Pharmacy Stock Component with Search
export const PharmacyStock = ({ openModal, closeModal, isModalOpen }: any) => {
  const { getAllRequest, requests, isLoading } =
    useInventoryStore() as unknown as {
      getAllRequest: () => void;
      requests: { data: RequestData[]; pagination: object } | null;
      isLoading: boolean;
    };

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllRequest();
  }, [getAllRequest]);

  const requestsArray =
    requests && requests.data && Array.isArray(requests.data)
      ? requests.data
      : [];

  // Filter requests based on search term
  const filteredRequests = useMemo(() => {
    if (!searchTerm.trim()) {
      return requestsArray;
    }

    const searchLower = searchTerm.toLowerCase();

    return requestsArray.filter((request) => {
      try {
        // Search in requested by name (both staff and department)
        const requestedByName = request.attributes?.requested_by
          ? `${request.attributes.requested_by.first_name || ""} ${
              request.attributes.requested_by.last_name || ""
            }`.toLowerCase()
          : (request.attributes?.request_department || "")
              .toString()
              .toLowerCase();

        // Search in item name
        const itemName = (
          request.attributes?.item_requested?.inventory?.service_item_name || ""
        )
          .toString()
          .toLowerCase();

        // Search in category/type
        const category = (request.type || "").toString().toLowerCase();

        // Search in recorded by name
        const recordedByName = request.attributes?.recorded_by
          ? `${request.attributes.recorded_by.first_name || ""} ${
              request.attributes.recorded_by.last_name || ""
            }`.toLowerCase()
          : "";

        // Search in status
        const status = (request.attributes?.status || "")
          .toString()
          .toLowerCase();

        // Search in quantity (convert to string)
        const quantity = (request.attributes?.quantity || "").toString();

        // Search in price
        const price = (
          request.attributes?.item_requested?.inventory?.service_item_price ||
          ""
        )
          .toString()
          .toLowerCase();

        return (
          requestedByName.includes(searchLower) ||
          itemName.includes(searchLower) ||
          category.includes(searchLower) ||
          recordedByName.includes(searchLower) ||
          status.includes(searchLower) ||
          quantity.includes(searchLower) ||
          price.includes(searchLower)
        );
      } catch (error) {
        console.error("Error filtering request:", error, request);
        return false;
      }
    });
  }, [requestsArray, searchTerm]);

  console.log("requestsArray length:", requestsArray.length);
  console.log("filteredRequests length:", filteredRequests.length);
  console.log("First item in requestsArray:", requestsArray[0]);

  const columns = [
    {
      key: "id" as keyof RequestData,
      label: "Requested By",
      render: (_, request) => {
        // Handle both staff requests and department requests
        if (request.attributes.requested_by) {
          // Staff request format
          return (
            <div className="flex items-center gap-2">
              <h1 className="text-custom-black font-medium">
                {request.attributes.requested_by.first_name}{" "}
                {request.attributes.requested_by.last_name}
              </h1>
            </div>
          );
        } else if (request.attributes.request_department) {
          // Department request format
          return (
            <div className="flex items-center gap-2">
              <h1 className="text-custom-black font-medium">
                {request.attributes.request_department}
              </h1>
            </div>
          );
        } else {
          return <span className="text-gray-400">Not specified</span>;
        }
      },
    },
    {
      key: "type" as keyof RequestData,
      label: "Category",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">{request.type || "N/A"}</span>
      ),
    },
    {
      key: "id" as keyof RequestData,
      label: "Item Name",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">
          {request.attributes.item_requested.inventory.service_item_name}
        </span>
      ),
    },
    {
      key: "id" as keyof RequestData,
      label: "Item Price",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">
          {request.attributes.item_requested.inventory.service_item_price}
        </span>
      ),
    },
    {
      key: "id" as keyof RequestData,
      label: "Quantity",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">
          {request.attributes.quantity}
        </span>
      ),
    },
    {
      key: "id" as keyof RequestData,
      label: "Recorded By",
      render: (_, request) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">
            {request.attributes.recorded_by.first_name}{" "}
            {request.attributes.recorded_by.last_name}
          </span>
        </div>
      ),
    },
    {
      key: "id" as keyof RequestData,
      label: "Date",
      render: (_, request) => (
        <span className="text-[#667085] text-sm">
          {request.attributes.created_at}
        </span>
      ),
    },
  ] as Column<RequestData>[];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <>
      <div className="w-full bg-white rounded-b-[8px] shadow-table">
        <div className="relative flex-1 max-w-md py-3 px-4">
          <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, item, category, status..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-4 h-4 flex items-center justify-center"
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="px-4 py-2 bg-gray-50 border-b text-sm text-gray-600">
            {filteredRequests.length > 0
              ? `Found ${filteredRequests.length} result${
                  filteredRequests.length === 1 ? "" : "s"
                } for "${searchTerm}"`
              : `No results found for "${searchTerm}"`}
          </div>
        )}

        {isLoading ? (
          <p className="p-4 text-center text-gray-500">Loading...</p>
        ) : filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? (
              <div>
                <p className="mb-2">No requests found matching your search.</p>
                <button
                  onClick={clearSearch}
                  className="text-primary hover:text-primary/80 underline"
                >
                  Clear search to view all requests
                </button>
              </div>
            ) : (
              <p>No requests available</p>
            )}
          </div>
        ) : (
          <Table
            data={filteredRequests}
            columns={columns}
            rowKey="id"
            loading={isLoading}
            radius="rounded-none"
          />
        )}
      </div>
      {isModalOpen && (
        <AddRequestModal
          onClose={closeModal}
          endpoint="/inventory/requests/create"
          refreshEndpoint="/inventory/requests/all-records"
          fetchEndpoint="/medical-report/department-request-records"
          stockEndpoint="/inventory/all-inventory-items"
        />
      )}
    </>
  );
};

// Main Tabbed Component
const InventoryRequest = () => {
  const [activeTab, setActiveTab] = useState<
    "pharmacy" | "history" | "activities"
  >("pharmacy");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const tabs = [
    { id: "pharmacy", label: "Pharmacy Stock" },
    { id: "history", label: "Request History" },
    { id: "activities", label: "Sales History" },
  ];

  return (
    <div>
      {/* Tab Header with Tablehead */}
      <Tablehead
        typebutton="Add New"
        tableTitle="Inventory Management"
        showButton={activeTab === "pharmacy"}
        onButtonClick={() => {
          openModal();
        }}
      />

      {/* Tab Navigation */}
      <div className="bg-white ">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "pharmacy" | "history")}
              className={`px-6 py-3 text-xl font-medium  border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary "
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-0">
        {activeTab === "pharmacy" && (
          <PharmacyStock
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            openModal={openModal}
          />
        )}
        {activeTab === "history" && <RequestHistory />}
        {activeTab === "activities" && <StockActivity />}
      </div>
    </div>
  );
};

export default InventoryRequest;
