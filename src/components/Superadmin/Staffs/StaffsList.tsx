import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import { useEffect, useState } from "react";
import Loader from "../../../Shared/Loader";
import Table from "../../../Shared/Table";

type Column<T> = {
  key: keyof T;
  label: string;
  render: (value: any, row: T) => React.ReactNode;
};

interface Props {
  staffs: any[];
  isStaffLoading: boolean;
}

const StaffsList = ({ staffs, isStaffLoading }: Props) => {
  const [transformedStaffs, setTransformedStaffs] = useState<any[]>([]);
  const navigate = useNavigate();
  const { togglestatus, setSelectedStaff } = useGlobalStore();

  const handleViewMore = (staff: any) => {
    setSelectedStaff(staff); // Store in Zustand
    navigate(`/dashboard/staff-detail/${staff.id}`);
  };

  useEffect(() => {
    setTransformedStaffs(
      staffs.map((staff) => ({ ...staff.attributes, id: staff.id }))
    );
  }, [staffs]);

  if (isStaffLoading)
    return (
      <div>
        <Loader />
      </div>
    );

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
    {
      key: "phone",
      label: "Phone",
      render: (value) => (
        <span className="text-sm text-[#667085]">{value ?? "N/A"}</span>
      ),
    },
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
              onChange={() => handleToggleStatus(row)} // Corrected here
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
          onClick={() => handleViewMore(row)}
        >
          View More
        </button>
      ),
    },
  ];

  const handleToggleStatus = async (staff: any) => {
    const newStatus = !staff.is_active;
    console.log(staff.id, "abcd");

    // 1. Immediate UI update
    setTransformedStaffs((prev) =>
      prev.map((n) => (n.id === staff.id ? { ...n, is_active: newStatus } : n))
    );

    // 2. API call
    const serverStatus = await togglestatus({
      is_active: newStatus,
      user_id: staff.id,
    });
    console.log(serverStatus, "efgh");

    // If API failed, revert
    if (serverStatus === null) {
      setTransformedStaffs((prev) =>
        prev.map((n) =>
          n.id === staff.id ? { ...n, is_active: staff.is_active } : n
        )
      );
    }
  };

  return (
    <div>
      <Table
        columns={staffsColumn}
        data={transformedStaffs}
        rowKey="id"
        pagination={false}
        rowsPerPage={10}
      />
    </div>
  );
};

export default StaffsList;
