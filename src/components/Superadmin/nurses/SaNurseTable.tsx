import { nurses } from "../../../data/nurseData";
import Table from "../../../Shared/Table";
import { EyeIcon } from "lucide-react"; // Import the eye icon for "view more"

interface nurses {
  name: string;
  id: string;
  phone: string;
  email: string;
  status: string;
}

const SaNurseTable = () => {
  const handleViewMore = (nurse: nurses) => {
    console.log("View more clicked for:", nurse);
  };

  const nursesColumn = [
    {
      key: "name" as keyof nurses,
      label: "Name",
      render: (value: string) => (
        <span className="text-sm text-custom-black font-medium">{value}</span>
      ),
    },
    {
      key: "id" as keyof nurses,
      label: "Nurse ID",
      render: (value: string) => (
        <span className="text-sm text-[#667085]">{value}</span>
      ),
    },
    {
      key: "phone" as keyof nurses,
      label: "Phone",
      render: (value: string) => (
        <span className="text-sm text-[#667085]">{value}</span>
      ),
    },
    {
      key: "email" as keyof nurses,
      label: "Email",
      render: (value: string) => (
        <span className="text-sm text-[#667085]">{value}</span>
      ),
    },
    {
      key: "status" as keyof nurses,
      label: "Status",
      render: (value: string) => (
        <span
          className={`py-1.5 px-2.5 rounded-full text-sm ${
            value === "Available"
              ? "text-[#F83E41] bg-[#FCE9E9]"
              : "text-[#009952] bg-[#CCFFE7]"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "id" as keyof nurses,
      label: "Action",
      render: (_: string, row: nurses) => (
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
        data={nurses}
        rowKey="id"
        pagination={true}
        rowsPerPage={10}
      />
    </div>
  );
};

export default SaNurseTable;
