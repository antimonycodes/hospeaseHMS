import { useNavigate } from "react-router-dom";
import Table from "../../../Shared/Table";
import img from "../../../assets/ribiero.png";
import { useState } from "react";
import {
  DoctorAttributes,
  Doctor,
} from "../../../store/super-admin/useDoctorStore";

// interface Doctor {
//   id: string;
//   firstName: string;
//   lastName: string;
//   phone: string;
//   email: string;
//   status: "Available" | "Out-of-work";
//   picture: string;
//   religion?: string;
//   gender?: string;
//   age?: number;
//   staffId?: string;
//   houseAddress?: string;
//   active: boolean;
// }
type Column<T> = {
  key: keyof T;
  label: string;
  render: (value: any, row: T) => React.ReactNode;
};

const DoctorsTable = ({ doctors }: { doctors: Doctor[] }) => {
  console.log(doctors);
  const formattedDoctors: DoctorAttributes[] = doctors.map((doc) => ({
    ...doc.attributes,
    id: doc.id,
  }));

  const columns: Column<DoctorAttributes>[] = [
    {
      key: "picture" as keyof DoctorAttributes,
      label: "Avatar",
      render: (
        value: string | number | boolean | undefined,
        row: DoctorAttributes
      ) => (
        <div className="flex items-center gap-2">
          <img
            src={value as string}
            alt={`Dr. ${row.first_name} ${row.last_name}`}
            className="h-10 w-10 border rounded-full object-cover border-gray-300"
          />
          <h1 className=" text-custom-black font-medium">
            {row.first_name} {row.last_name}
          </h1>
        </div>
      ),
    },
    // {
    //   key: "staffId" as keyof DoctorAttributes,
    //   label: "Staff ID",
    //   render: (value: string | number | boolean | undefined, row: DoctorAttributes) => (
    //     <div className="flex flex-col">
    //       <span className="text-sm text-gray-500">{`HCS${row.id}455`}</span>
    //     </div>
    //   ),
    // },
    {
      key: "phone" as keyof DoctorAttributes,
      label: "Phone",
      render: (value: string | number | boolean | undefined) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">{String(value)}</span>
        </div>
      ),
    },
    {
      key: "email" as keyof DoctorAttributes,
      label: "Email address",
      render: (value: string | number | boolean | undefined) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">{String(value)}</span>
        </div>
      ),
    },
    {
      key: "status" as keyof DoctorAttributes,
      label: "Status",
      render: (value: string | number | boolean | undefined) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === "Available"
              ? "bg-[#CCFFE7] text-[#009952]"
              : "bg-[#FCE9E9] text-[#F83E41]"
          }`}
        >
          {String(value)}
        </span>
      ),
    },
    {
      key: "active" as keyof DoctorAttributes,
      label: "Control",
      render: (
        value: string | number | boolean | undefined,
        row: DoctorAttributes
      ) => (
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={!!value}
              // onChange={() => toggleDoctorAttributesStatus(row.id)}
            />
            <div
              className={`relative w-10 h-5 rounded-full transition-colors ${
                value ? "bg-primary" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                  value ? "transform translate-x-5" : ""
                }`}
              ></div>
            </div>
          </label>
        </div>
      ),
    },
    {
      key: "id" as keyof DoctorAttributes,
      label: "",
      render: (
        value: string | number | boolean | undefined,
        row: DoctorAttributes
      ) => (
        <button onClick={() => handleViewMore(row)} className="text-primary">
          View More
        </button>
      ),
    },
  ];

  const navigate = useNavigate();
  const handleViewMore = (doc: DoctorAttributes) => {
    navigate(`/dashboard/doctors/${doc.id}`);
  };

  // Toggle doctor status
  // const toggleDoctorStatus = (id: string) => {
  //   setDoctors(
  //     doctors.map((doctor) =>
  //       doctor.id === id ? { ...doctor, active: !doctor.active } : doctor
  //     )
  //   );
  // };

  return (
    <div>
      {/* Table */}
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
