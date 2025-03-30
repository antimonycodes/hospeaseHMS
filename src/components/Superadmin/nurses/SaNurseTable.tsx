import { nurses } from "../../../data/nurseData";
import Table from "../../../Shared/Table";
import { EyeIcon } from "lucide-react";
import {
  Nurse,
  NurseAttributes,
} from "../../../store/super-admin/useNuseStore";
import { useNavigate } from "react-router-dom";
type Column<T> = {
  key: keyof T;
  label: string;
  render: (value: any, row: T) => React.ReactNode;
};

interface Props {
  isLoading: boolean;
  nurses: Nurse[];
}

const SaNurseTable = ({ nurses, isLoading }: Props) => {
  const navigate = useNavigate();

  const handleViewMore = (nurse: NurseAttributes) => {
    console.log("View more clicked for:", nurse);
    navigate(`/dashboard/nurses/${nurse.id}`);
  };

  // Extract `attributes` and add `id` to each nurse
  const transformedNurses: NurseAttributes[] = nurses.map((nurse) => ({
    ...nurse.attributes,
    id: nurse.id, // Add ID separately for rowKey
  }));

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
        <span
          className={`py-1.5 px-2.5 rounded-full text-sm ${
            value === "Available"
              ? "text-[#F83E41] bg-[#FCE9E9]"
              : "text-[#009952] bg-[#CCFFE7]"
          }`}
        >
          {value ?? "N/A"}
        </span>
      ),
    },
    {
      key: "id",
      label: "Action",
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

export default SaNurseTable;
