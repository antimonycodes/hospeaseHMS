import { useNavigate } from "react-router-dom";
import Table from "../../../Shared/Table";
import img from "../../../assets/ribiero.png";
import { useState, JSX } from "react";

import {
  ConsultantAttributes,
  Consultant,
} from "../../../store/super-admin/useDoctorStore";

type Column<T> = {
  key: keyof T;
  label: string;
  render: (value: any, row: T) => React.ReactNode;
};

const ConsultantTable = ({ consultants }: { consultants: Consultant[] }) => {
  const formattedConsultants = consultants.map((consultant: any) => ({
    ...consultant.attributes,
    id: consultant.id,
  }));

  const columns: Column<ConsultantAttributes>[] = [
    {
      key: "picture" as keyof ConsultantAttributes,
      label: "Avatar",
      render: (
        value: string | number | boolean | undefined,
        row: ConsultantAttributes
      ) => (
        <div className="flex items-center gap-2">
          <img
            src={value as string}
            alt={`Dr. ${row.first_name} ${row.last_name}`}
            className="h-10 w-10 border rounded-full object-cover border-gray-300"
            // onError={(e) => {
            //   (e.target as HTMLImageElement).src =
            //     "https://via.placeholder.com/40";
            // }}
          />
          <h1 className=" text-custom-black font-medium">
            {row.first_name} {row.last_name}
          </h1>
        </div>
      ),
    },
    // {
    //   key: "id" as keyof Consultant,
    //   label: "Staff ID",
    //   render: (row: Consultant) => (
    //     <div className="flex flex-col">
    //       <span className="text-sm text-gray-500">HCS{row.id}455</span>
    //     </div>
    //   ),
    // },
    {
      key: "phone" as keyof ConsultantAttributes,
      label: "Phone",
      render: (value: string) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">{value}</span>
        </div>
      ),
    },
    {
      key: "email" as keyof ConsultantAttributes,
      label: "Email address",
      render: (value: string) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">{value}</span>
        </div>
      ),
    },
    {
      key: "status" as keyof ConsultantAttributes,
      label: "Status",
      render: (value: string) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === "Available"
              ? "bg-[#CCFFE7] text-[#009952]"
              : "bg-[#FCE9E9] text-[#F83E41]"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "active" as keyof ConsultantAttributes,
      label: "Control",
      render: (value: boolean, row: ConsultantAttributes) => (
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={value}
              // onChange={() => toggleDoctorStatus(row.id)}
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
      key: "id" as keyof ConsultantAttributes,
      label: "",
      render: (
        value: string | number | boolean | undefined,
        row: ConsultantAttributes
      ) => (
        <button
          onClick={() => handleViewMore(String(row.id))}
          className="text-primary"
        >
          View More
        </button>
      ),
    },
  ];

  const navigate = useNavigate();
  const handleViewMore = (id: string) => {
    navigate(`/dashboard/consultants/${id}`);
  };

  // Toggle doctor status
  // const toggleDoctorStatus = (id: string) => {
  //   setDoctors(
  //     doctors.map((doctor) =>
  //       doctor.id === id ? { ...doctor, active: !doctor.active } : doctor
  //     )
  //   );
  // };

  //   const viewDoctorDetails = (doctor: Doctor) => {
  //     setSelectedDoctor(doctor);
  //   };

  return (
    <div>
      <Table
        columns={columns}
        data={formattedConsultants}
        rowKey="id"
        pagination={true}
        rowsPerPage={10}
      />
    </div>
  );
};

export default ConsultantTable;
