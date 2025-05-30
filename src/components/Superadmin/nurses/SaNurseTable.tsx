import { nurses } from "../../../data/nurseData";
import Table from "../../../Shared/Table";
import { EyeIcon } from "lucide-react";
import {
  Nurse,
  NurseAttributes,
} from "../../../store/super-admin/useNuseStore";
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
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  } | null;
  getNurses: (page: string, perPage: string) => void;
}

const SaNurseTable = ({ nurses, isLoading, pagination, getNurses }: Props) => {
  const [transformedNurses, setTransformedNurses] = useState<NurseAttributes[]>(
    []
  );
  const [perPage, setPerPage] = useState(pagination?.per_page || 10);

  const navigate = useNavigate();
  const { togglestatus } = useGlobalStore();

  const handleViewMore = (nurse: NurseAttributes) => {
    console.log("View more clicked for:", nurse);
    // Pass both nurse ID and user ID when navigating
    navigate(`/dashboard/nurses/${nurse.id}`, {
      state: {
        nurseId: nurse.id,
        userId: nurse.user_id,
      },
    });
  };

  useEffect(() => {
    setTransformedNurses(
      nurses.map((nurse) => ({
        ...nurse.attributes,
        id: nurse.id,
      }))
    );
  }, [nurses]);

  console.log(nurses.indexOf, "dfgh");

  const handlePageChange = (page: number) => {
    // Call getAllPatients with the page number, perPage value, and the current baseEndpoint
    getNurses(page.toString(), perPage.toString());
  };

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
    // {
    //   key: "nurse_id",
    //   label: "Nurse ID",
    //   render: (value) => (
    //     <span className="text-sm text-[#667085]">{value ?? "N/A"}</span>
    //   ),
    // },
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
      key: "is_active",
      label: "Status",
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
        paginationData={pagination}
        loading={isLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SaNurseTable;
