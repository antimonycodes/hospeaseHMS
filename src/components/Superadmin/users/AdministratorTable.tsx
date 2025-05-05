import { Pencil } from "lucide-react";
import Table from "../../../Shared/Table";
import { JSX, useEffect, useState } from "react";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import Loader from "../../../Shared/Loader";

interface Admin {
  id: number;
  name: string;
  email: string;
}

type Column<T> = {
  key: keyof T;
  label: string;
  render: (value: any, row: T) => React.ReactNode;
};

const AdministratorTable = () => {
  const [transformedStaffs, setTransformedStaffs] = useState<any[]>([]);

  const { getSubAdmin, subAdmins, isLoading } = useGlobalStore();
  useEffect(() => {
    getSubAdmin();
  }, [getSubAdmin]);

  console.log(subAdmins, "subAdmins");

  useEffect(() => {
    setTransformedStaffs(
      subAdmins.map((admin) => ({ ...admin.attributes, id: admin.id }))
    );
  }, [subAdmins]);

  const staffsColumn: Column<any>[] = [
    {
      key: "first_name",
      label: "Name",
      render: (value, row) => (
        <span className="text-sm text-custom-black font-medium">
          {row.first_name} {row.last_name}
        </span>
      ),
    },

    {
      key: "email",
      label: "Email",
      render: (value) => (
        <span className="text-sm text-[#667085]">{value ?? "N/A"}</span>
      ),
    },
    // {
    //   key: "phone",
    //   label: "Phone",
    //   render: (value) => (
    //     <span className="text-sm text-[#667085]">{value ?? "N/A"}</span>
    //   ),
    // },
    {
      key: "is_active",
      label: "Status",
      render: (value, row) => (
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={row.is_active}
              // onChange={() => handleToggleStatus(row)} // Corrected here
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
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <button
          className="text-sm text-primary"
          // onClick={() => handleViewMore(row)}
        >
          View More
        </button>
      ),
    },
  ];

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <div className="">
      <Table
        columns={staffsColumn}
        data={transformedStaffs}
        rowKey="id"
        pagination={false}
        loading={isLoading}
      />
    </div>
  );
};

export default AdministratorTable;
