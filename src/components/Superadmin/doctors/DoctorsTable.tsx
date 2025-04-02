// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Table from "../../../Shared/Table";
// import { useGlobalStore } from "../../../store/super-admin/useGlobal";
// import { useDoctorStore } from "../../../store/super-admin/useDoctorStore";
// import toast from "react-hot-toast";

// type Column<T> = {
//   key: keyof T;
//   label: string;
//   render: (value: any, row: T) => React.ReactNode;
// };

// interface DoctorAttributes {
//   id: number;
//   user_id: number;
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone: string;
//   picture?: string | undefined;
//   is_active: boolean;
// }

// interface Doctor {
//   id: number;
//   attributes: DoctorAttributes;
// }

// const DoctorsTable = ({ doctors }: { doctors: Doctor[] }) => {
//   const [formattedDoctors, setFormattedDoctors] = useState<DoctorAttributes[]>(
//     []
//   );
//   const { togglestatus } = useGlobalStore();
//   const navigate = useNavigate();

//   // Format doctors data on initial load and when doctors prop changes
//   useEffect(() => {
//     setFormattedDoctors(
//       doctors.map((doc) => ({
//         ...doc.attributes,
//         id: doc.id,
//       }))
//     );
//   }, [doctors]);

//   const columns: Column<DoctorAttributes>[] = [
//     {
//       key: "picture",
//       label: "Avatar",
//       render: (value, row) => {
//         const imageSrc = value
//           ? value
//           : "https://placehold.co/600x400?text=img"; // Placeholder image URL if no image is provided
//         return (
//           <div className="flex items-center gap-2">
//             <img
//               src={imageSrc}
//               alt={`Dr. ${row.first_name} ${row.last_name}`}
//               className="h-10 w-10 border rounded-full object-cover border-gray-300"
//             />
//             <h1 className="text-custom-black font-medium">
//               {row.first_name} {row.last_name}
//             </h1>
//           </div>
//         );
//       },
//     },

//     {
//       key: "phone",
//       label: "Phone",
//       render: (value) => (
//         <div className="flex flex-col">
//           <span className="text-sm text-gray-500">{String(value)}</span>
//         </div>
//       ),
//     },
//     {
//       key: "email",
//       label: "Email address",
//       render: (value) => (
//         <div className="flex flex-col">
//           <span className="text-sm text-gray-500">{String(value)}</span>
//         </div>
//       ),
//     },
//     {
//       key: "is_active",
//       label: "Status",
//       render: (value) => (
//         <span
//           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//             value
//               ? "bg-[#CCFFE7] text-[#009952]"
//               : "bg-[#FCE9E9] text-[#F83E41]"
//           }`}
//         >
//           {value ? "Available" : "Out-of-work"}
//         </span>
//       ),
//     },
//     {
//       key: "is_active", // Using is_active as key for the toggle
//       label: "Control",
//       render: (value, row) => (
//         <div className="flex items-center">
//           <label className="inline-flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               className="sr-only peer"
//               checked={row.is_active}
//               onChange={() => handleToggleStatus(row)}
//             />
//             <div
//               className={`relative w-10 h-5 rounded-full transition-colors ${
//                 row.is_active ? "bg-primary" : "bg-gray-200"
//               }`}
//             >
//               <div
//                 className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
//                   row.is_active ? "transform translate-x-5" : ""
//                 }`}
//               ></div>
//             </div>
//           </label>
//         </div>
//       ),
//     },
//     {
//       key: "id",
//       label: "",
//       render: (value, row) => (
//         <button
//           onClick={() => handleViewMore(row)}
//           className="text-primary hover:underline"
//         >
//           View More
//         </button>
//       ),
//     },
//   ];

//   const handleViewMore = (doc: DoctorAttributes) => {
//     navigate(`/dashboard/doctors/${doc.id}`);
//   };

//   const handleToggleStatus = async (doc: DoctorAttributes) => {
//     const newStatus = !doc.is_active;

//     // 1. Immediate UI update
//     setFormattedDoctors((prev) =>
//       prev.map((d) => (d.id === doc.id ? { ...d, is_active: newStatus } : d))
//     );

//     // 2. API call
//     const serverStatus = await togglestatus({
//       is_active: newStatus,
//       user_id: doc.user_id,
//     });

//     // If API failed, revert
//     if (serverStatus === null) {
//       setFormattedDoctors((prev) =>
//         prev.map((d) =>
//           d.id === doc.id ? { ...d, is_active: doc.is_active } : d
//         )
//       );
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow p-4">
//       <Table
//         columns={columns}
//         data={formattedDoctors}
//         rowKey="id"
//         pagination={true}
//         rowsPerPage={10}
//       />
//     </div>
//   );
// };

// export default DoctorsTable;
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../Shared/Table";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import Loader from "../../../Shared/Loader";

type Column<T> = {
  key: keyof T;
  label: string;
  render: (value: any, row: T) => React.ReactNode;
};

interface DoctorAttributes {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  picture?: string | undefined;
  is_active: boolean;
}

interface Doctor {
  id: number;
  attributes: DoctorAttributes;
}

const DoctorsTable = ({
  doctors,
  isLoading,
}: {
  doctors: Doctor[];
  isLoading: boolean;
}) => {
  const navigate = useNavigate();
  const { togglestatus } = useGlobalStore();

  // Use useMemo to avoid unnecessary re-calculations
  const formattedDoctors = useMemo(() => {
    return doctors.map((doc) => ({
      ...doc.attributes,
      id: doc.id,
    }));
  }, [doctors]);

  if (isLoading) return <Loader />;

  const columns: Column<DoctorAttributes>[] = [
    {
      key: "picture",
      label: "Avatar",
      render: (value, row) => {
        const imageSrc = value
          ? value
          : "https://placehold.co/600x400?text=img";
        return (
          <div className="flex items-center gap-2">
            <img
              src={imageSrc}
              alt={`Dr. ${row.first_name} ${row.last_name}`}
              className="h-10 w-10 border rounded-full object-cover border-gray-300"
            />
            <h1 className="text-custom-black font-medium">
              {row.first_name} {row.last_name}
            </h1>
          </div>
        );
      },
    },
    {
      key: "phone",
      label: "Phone",
      render: (value) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">{String(value)}</span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email address",
      render: (value) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">{String(value)}</span>
        </div>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value
              ? "bg-[#CCFFE7] text-[#009952]"
              : "bg-[#FCE9E9] text-[#F83E41]"
          }`}
        >
          {value ? "Available" : "Out-of-work"}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Control",
      render: (value, row) => (
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={row.is_active}
              onChange={() => handleToggleStatus(row)}
            />
            <div
              className={`relative w-10 h-5 rounded-full transition-colors ${
                row.is_active ? "bg-primary" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                  row.is_active ? "transform translate-x-5" : ""
                }`}
              ></div>
            </div>
          </label>
        </div>
      ),
    },
    {
      key: "id",
      label: "",
      render: (value, row) => (
        <button
          onClick={() => handleViewMore(row)}
          className="text-primary hover:underline"
        >
          View More
        </button>
      ),
    },
  ];

  const handleViewMore = (doc: DoctorAttributes) => {
    navigate(`/dashboard/doctors/${doc.id}`);
  };

  const handleToggleStatus = async (doc: DoctorAttributes) => {
    const newStatus = !doc.is_active;

    try {
      // API call first, then update UI only if successful
      const serverStatus = await togglestatus({
        is_active: newStatus,
        user_id: doc.user_id,
      });

      // Only update UI if API call succeeded
      if (serverStatus !== null) {
        // No need to set state as the parent component should handle refreshing the data
        // The parent component should be responsible for refreshing the doctors list
      }
    } catch (error) {
      console.error("Failed to update doctor status:", error);
      // Handle error (maybe show toast notification)
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 ">
      <Table
        columns={columns}
        data={formattedDoctors}
        rowKey="id"
        pagination={true}
        rowsPerPage={10}
      />
    </div>
  );
};

export default DoctorsTable;
