import { Pencil } from "lucide-react";
import Table from "../../../Shared/Table";

interface StaffMember {
  id: number;
  name: string;
  email: string;
}

const DepartmentTable = () => {
  const columns = [
    {
      key: "name" as keyof StaffMember,
      label: "Name",
      render: (value: string) => (
        <div className="font-medium text-[#101828]">{value}</div>
      ),
    },
    {
      key: "email" as keyof StaffMember,
      label: "Email address",
      render: (value: string) => <div className="text-[#667085]">{value}</div>,
    },
    {
      key: "id" as keyof StaffMember,
      label: "",
      render: (_value: number, row: StaffMember) => (
        <div className="flex justify-end">
          <button className="text-gray-500 p-2 rounded-md hover:bg-gray-100">
            <Pencil size={16} />
          </button>
        </div>
      ),
    },
  ];

  const data: StaffMember[] = [
    { id: 1, name: "Front Desk", email: "kjcpt@gmail.com" },
    { id: 2, name: "Laboratory", email: "zoolyd@aol.com" },
    { id: 3, name: "Pharmacy", email: "luke92@zsto.com" },
    { id: 4, name: "Finance", email: "ondasofminding@outlook.com" },
    { id: 5, name: "Matron", email: "leah@prontomail.com" },
    { id: 6, name: "Medical Director", email: "adamvijayak@prontomail.com" },
  ];

  return (
    <div className="">
      <Table columns={columns} data={data} rowKey="id" pagination={false} />
    </div>
  );
};

export default DepartmentTable;
