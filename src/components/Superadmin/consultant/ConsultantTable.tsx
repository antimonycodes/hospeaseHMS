import { useNavigate } from "react-router-dom";
import Table from "../../../Shared/Table";
import img from "../../../assets/ribiero.png";
// import { useState, JSX } from "react";

import {
  ConsultantAttributes,
  Consultant,
} from "../../../store/super-admin/useDoctorStore";
import { useEffect, useState } from "react";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import Loader from "../../../Shared/Loader";

type Column<T> = {
  key: keyof T;
  label: string;
  render: (value: any, row: T) => React.ReactNode;
};

const ConsultantTable = ({
  consultants,
  isLoading,
  onEdit,
}: {
  consultants: Consultant[];
  isLoading: boolean;
  onEdit?: (consultant: Consultant) => void;
}) => {
  const [formattedConsultants, setFormatteConsultants] = useState<
    ConsultantAttributes[]
  >([]);

  const { togglestatus } = useGlobalStore();

  useEffect(() => {
    setFormatteConsultants(
      consultants.map((doc) => ({
        ...doc.attributes,
        id: doc.id,
      }))
    );
  }, [consultants]);

  const columns: Column<ConsultantAttributes>[] = [
    {
      key: "picture" as keyof ConsultantAttributes,
      label: "Avatar",
      render: (
        value: string | number | boolean | undefined,
        row: ConsultantAttributes
      ) => {
        const imageSrc = value
          ? String(value)
          : "https://placehold.co/600x400?text=img"; // Placeholder image URL if no image is provided
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
      key: "is_active" as keyof ConsultantAttributes,
      label: "Status",
      render: (value: boolean) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === true
              ? "bg-[#CCFFE7] text-[#009952]"
              : "bg-[#FCE9E9] text-[#F83E41]"
          }`}
        >
          {value === true ? "Available" : "Out-of-work"}
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

  const handleToggleStatus = async (doc: ConsultantAttributes) => {
    const newStatus = !doc.is_active;

    // 1. Immediate UI update
    setFormatteConsultants((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, is_active: newStatus } : d))
    );

    // 2. API call
    const serverStatus = await togglestatus({
      is_active: newStatus,
      user_id: doc.user_id,
    });

    // If API failed, revert
    if (serverStatus === null) {
      setFormatteConsultants((prev) =>
        prev.map((d) =>
          d.id === doc.id ? { ...d, is_active: doc.is_active } : d
        )
      );
    }
  };

  //   const viewDoctorDetails = (doctor: Doctor) => {
  //     setSelectedDoctor(doctor);
  //   };

  if (isLoading) return <Loader />;

  return (
    <div>
      <Table
        columns={columns}
        data={formattedConsultants}
        rowKey="id"
        pagination={true}
      />
    </div>
  );
};

export default ConsultantTable;
