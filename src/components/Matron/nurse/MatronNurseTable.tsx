import Table from "../../../Shared/Table";

import { Nurse, NurseAttributes } from "./useMatronNurse";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import Loader from "../../../Shared/Loader";

type Column<T> = {
  key: keyof T;
  label: string;
  render: (value: any, row: T) => React.ReactNode;
};

interface Props {
  isLoading: boolean;
  nurses: Nurse[];
}

const MatronNurseTable = ({ nurses, isLoading }: Props) => {
  const [transformedNurses, setTransformedNurses] = useState<NurseAttributes[]>(
    []
  );
  const navigate = useNavigate();
  const { togglestatus } = useGlobalStore();

  const handleViewMore = (nurse: NurseAttributes) => {
    console.log("View more clicked for:", nurse);
    navigate(`/dashboard/matron/nurses/${nurse.id}`);
  };

  useEffect(() => {
    setTransformedNurses(
      nurses.map((nurse) => ({
        ...nurse.attributes,
        id: nurse.id,
      }))
    );
  }, [nurses]);

  if (isLoading) return <Loader />;

  const nursesColumn: Column<NurseAttributes>[] = [
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
      key: "nurse_id",
      label: "Nurse ID",
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
      key: "email",
      label: "Email",
      render: (value) => (
        <span className="text-sm text-[#667085]">{value ?? "N/A"}</span>
      ),
    },
    {
      key: "shift_status",
      label: "Status",
      render: (value) => (
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            {value ?? "N/A"}
          </label>
        </div>
      ),
    },
    {
      key: "id",
      label: "",
      render: (_, row) => (
        <span
          onClick={() => handleViewMore(row)}
          className="text-[#009952] font-medium text-sm cursor-pointer"
        >
          View More
        </span>
      ),
    },
  ];

  const handleToggleStatus = async (nurse: NurseAttributes) => {
    const newStatus = !nurse.is_active;

    // 1. Immediate UI update
    setTransformedNurses((prev) =>
      prev.map((n) => (n.id === nurse.id ? { ...n, is_active: newStatus } : n))
    );

    // 2. API call
    const serverStatus = await togglestatus({
      is_active: newStatus,
      user_id: nurse.user_id,
    });

    // If API failed, revert
    if (serverStatus === null) {
      setTransformedNurses((prev) =>
        prev.map((n) =>
          n.id === nurse.id ? { ...n, is_active: nurse.is_active } : n
        )
      );
    }
  };

  return (
    <div>
      <Table
        columns={nursesColumn}
        data={transformedNurses}
        rowKey="id"
        pagination={true}
        rowsPerPage={10}
      />
    </div>
  );
};

export default MatronNurseTable;
