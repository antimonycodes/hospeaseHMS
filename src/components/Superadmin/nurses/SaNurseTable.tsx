import Table from "../../../Shared/Table";
import { EyeIcon } from "lucide-react"; // Import the eye icon for "view more"

interface Nurses {
  name: string;
  id: string;
  phone: string;
  email: string;
  status: string;
}

const nurses: Nurses[] = [
  {
    name: "Ruth Nwabuze",
    id: "HS23455",
    phone: "+234 704 256 8201",
    email: "zoeby@aol.com",
    status: "Out-of-work",
  },
  {
    name: "James Kawu",
    id: "HS23455",
    phone: "+234 702 129 7529",
    email: "lukew@zoho.com",
    status: "Available",
  },
  {
    name: "Priscilla Agbasi",
    id: "HS23455",
    phone: "+234 919 360 5590",
    email: "ondosunshine@outlook.com",
    status: "Available",
  },
  {
    name: "Elizabeth Tukar",
    id: "HS23455",
    phone: "+234 819 829 4826",
    email: "leah@protonmail.com",
    status: "Out-of-work",
  },
  {
    name: "Joseph Ike",
    id: "HS23455",
    phone: "+234 902 099 7282",
    email: "adamawapeak@protonmail.com",
    status: "Out-of-work",
  },
  {
    name: "Daniel Kureebi",
    id: "HS23455",
    phone: "+234 805 145 6346",
    email: "michaelb@mail.com",
    status: "Out-of-work",
  },
  {
    name: "Joseph Weridide",
    id: "HS23455",
    phone: "+234 815 242 7824",
    email: "alexm@outlook.com",
    status: "Out-of-work",
  },
  {
    name: "Deborah Iwalewa",
    id: "HS23455",
    phone: "+234 902 354 1574",
    email: "isaiahm@yandex.com",
    status: "Out-of-work",
  },
  {
    name: "Timothy Ebikake",
    id: "HS23455",
    phone: "+234 811 962 3141",
    email: "lagosboy@mail.com",
    status: "Out-of-work",
  },
  {
    name: "Victoria Opuogbo",
    id: "HS23455",
    phone: "+234 809 771 7212",
    email: "kancroyalty@outlook.com",
    status: "Out-of-work",
  },
];

const SaNurseTable = () => {
  const handleViewMore = (nurse: Nurses) => {
    console.log("View more clicked for:", nurse);
  };

  const nursesColumn = [
    {
      key: "name" as keyof Nurses,
      label: "Name",
      render: (value: string) => (
        <span className="text-sm text-custom-black font-medium">{value}</span>
      ),
    },
    {
      key: "id" as keyof Nurses,
      label: "Nurse ID",
      render: (value: string) => (
        <span className="text-sm text-[#667085]">{value}</span>
      ),
    },
    {
      key: "phone" as keyof Nurses,
      label: "Phone",
      render: (value: string) => (
        <span className="text-sm text-[#667085]">{value}</span>
      ),
    },
    {
      key: "email" as keyof Nurses,
      label: "Email",
      render: (value: string) => (
        <span className="text-sm text-[#667085]">{value}</span>
      ),
    },
    {
      key: "status" as keyof Nurses,
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
      key: "id" as keyof Nurses,
      label: "Action",
      render: (_: string, row: Nurses) => (
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
