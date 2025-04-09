import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../Shared/Table";
import Loader from "../../../Shared/Loader";

type Column<T> = {
  key: keyof T;
  label: string;
  render: (value: any, row: T) => React.ReactNode;
};

interface DoctorAttributes {
  first_name: string;
  id: number;
  last_name: string;
  phone: string;
  email: string;
  doctor_id?: string;
  shift_status: "Available" | "Out-of-work";
  details: null | DoctorDetails;
  picture?: string | undefined;
  religion?: string;
  gender?: string;
  age?: number;
  houseAddress?: string;
  is_active: boolean;
  user_id: number;
}
interface DoctorDetails {
  dob: string;
  age: number;
  specialization: null;
  license_number: null;
  religion: string;
  address: string;
  is_active: string;
}
interface Doctor {
  id: number;
  attributes: DoctorAttributes;
}

const MedDoctorTable = ({
  doctors,
  isLoading,
}: {
  doctors: Doctor[];
  isLoading: boolean;
}) => {
  const [transformedDoctors, setTransformedDoctors] = useState<
    DoctorAttributes[]
  >([]);
  const navigate = useNavigate();

  useMemo(() => {
    setTransformedDoctors(
      doctors.map((doc) => ({
        ...doc.attributes,
        id: doc.id,
      }))
    );
  }, [doctors]);

  if (isLoading) return <Loader />;

  const columns: Column<DoctorAttributes>[] = [
    {
      key: "picture",
      label: "Name",
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
      key: "user_id",
      label: "Staff ID",
      render: (value) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">{String(value)}</span>
        </div>
      ),
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
    //   {
    //     key: "is_active",
    //     label: "Control",
    //     render: (value, row) => (
    //       <div className="flex items-center">
    //         <label className="inline-flex items-center cursor-pointer">
    //           <input
    //             type="checkbox"
    //             className="sr-only peer"
    //             checked={row.is_active}
    //             onChange={() => handleToggleStatus(row)}
    //           />
    //           <div
    //             className={`relative w-10 h-5 rounded-full transition-colors ${
    //               row.is_active ? "bg-primary" : "bg-gray-200"
    //             }`}
    //           >
    //             <div
    //               className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
    //                 row.is_active ? "transform translate-x-5" : ""
    //               }`}
    //             ></div>
    //           </div>
    //         </label>
    //       </div>
    //     ),
    //   },
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

  return (
    <div>
      {" "}
      <Table
        columns={columns}
        data={transformedDoctors}
        rowKey="id"
        pagination={true}
        rowsPerPage={10}
      />
    </div>
  );
};

export default MedDoctorTable;
