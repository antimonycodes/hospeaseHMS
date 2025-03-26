import Table from "../../../Shared/Table";

interface Payment {
  id: string;
  patient: string;
  amount: string;
  purpose: string;
  paymentMethod: string;
  date: string;
  status: "Full Payment" | "Half Payment" | "All";
}

interface FpaymentTableProps {
  payments: Payment[];
}

const FpaymentTable = ({ payments }: FpaymentTableProps) => {
  const columns: {
    key: keyof Payment;
    label: string;
    render: (value: string | number, row: Payment) => React.ReactNode;
  }[] = [
    {
      key: "id",
      label: "Patient ID",
      render: (value) => (
        <span className="text-dark font-medium text-sm">{value}</span>
      ),
    },
    {
      key: "patient",
      label: "Patient Name",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "purpose",
      label: "Purpose",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "status",
      label: "Payment Type",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
  ];

  return (
    <div className="w-full bg-white rounded-b-[8px] shadow-table ">
      <Table
        data={payments}
        columns={columns}
        rowKey="id"
        pagination={payments.length > 10}
        rowsPerPage={10}
        radius="rounded-none"
      />
    </div>
  );
};

export default FpaymentTable;
