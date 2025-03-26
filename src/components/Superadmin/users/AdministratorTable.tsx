import { Pencil } from "lucide-react";
import Table from "../../../Shared/Table";
import { JSX } from "react";

interface Admin {
  id: number;
  name: string;
  email: string;
}

interface Column {
  key: keyof Admin;
  label: string;
  render?: (value: any, patient: Admin) => JSX.Element;
}

const AdministratorTable = () => {
  const columns: Column[] = [
    {
      key: "name" as keyof Admin,
      label: "Name",
      render: (value: string) => (
        <div className="font-medium text-sm text-[#101828]">{value}</div>
      ),
    },
    {
      key: "email" as keyof Admin,
      label: "Email address",
      render: (value: string) => (
        <div className="text-sm text-[#667085]">{value}</div>
      ),
    },
    {
      key: "id" as keyof Admin,
      label: "",
      render: (_value: number, row: Admin) => (
        <div className="flex justify-end">
          <button className="text-[#667085] p-2 rounded-md hover:bg-[#EAECF0]">
            <Pencil size={16} />
          </button>
        </div>
      ),
    },
  ];

  const data: Admin[] = [
    { id: 1, name: "Matron", email: "kjcpt@gmail.com" },
    { id: 2, name: "Medical director", email: "zoolyd@aol.com" },
  ];

  return (
    <div className="">
      <Table columns={columns} data={data} rowKey="id" pagination={false} />
    </div>
  );
};

export default AdministratorTable;
